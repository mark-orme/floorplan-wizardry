
import { createRoot } from 'react-dom/client'
import * as Sentry from "@sentry/react";
import App from './App.tsx'
import './index.css'
import { getPusher } from './utils/pusher.ts'
import { createRootElement } from './utils/domUtils.ts'
import SecurityInitializer from './components/security/SecurityInitializer';
import { initializeSecurity } from './utils/security';
import { ErrorBoundary } from './utils/canvas/errorBoundary';
import { initializeCSP } from './utils/security/contentSecurityPolicy';

// Check if browser profiling is supported in this environment
const isProfilingSupported = () => {
  try {
    // Using a feature detection approach instead of direct Profiler access
    return typeof window !== 'undefined' && 
           typeof window.performance !== 'undefined' && 
           typeof window.performance.mark === 'function';
  } catch (e) {
    return false;
  }
};

// Create integrations array based on browser support
const sentryIntegrations = [
  Sentry.browserTracingIntegration(),
  Sentry.replayIntegration(),
];

// Initialize Sentry for error tracking and monitoring
Sentry.init({
  dsn: "https://abae2c559058eb2bbcd15686dac558ed@o4508914471927808.ingest.de.sentry.io/4509038014234704",
  integrations: sentryIntegrations,
  // Enable automatic release tracking and source maps
  release: import.meta.env.VITE_SENTRY_RELEASE || "development",
  dist: import.meta.env.VITE_SENTRY_DIST,
  environment: import.meta.env.MODE,
  
  // Tracing
  tracesSampleRate: 0.05, // Reduce to 5% of the transactions to avoid excessive requests
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ["localhost", /^https:\/\/.*lovable\.dev/, /^https:\/\/.*lovable\.app/],
  
  // Session Replay
  replaysSessionSampleRate: 0.02, // This sets the sample rate at 2%
  replaysOnErrorSampleRate: 0.2, // 20% when sampling sessions where errors occur
  
  // Disable performance profiling to avoid document policy violations
  profilesSampleRate: 0, 
  
  // Ensure we capture breadcrumbs for better debugging context
  beforeBreadcrumb(breadcrumb) {
    return breadcrumb;
  },
  
  // Add custom context to all errors
  beforeSend(event, hint) {
    // Add app-specific tags
    event.tags = {
      ...event.tags,
      appVersion: import.meta.env.VITE_APP_VERSION || 'unknown',
      appBuild: import.meta.env.VITE_APP_BUILD || 'unknown'
    };
    
    // Filter out sensitive data if needed
    if (event.request && event.request.headers) {
      delete event.request.headers['Authorization'];
    }
    
    // Check if CSP blocked the request and don't report those errors
    const error = hint?.originalException;
    if (error instanceof Error && 
        (error.message.includes('Content Security Policy') || 
         error.message.includes('Refused to connect') ||
         error.message.includes('violates') ||
         error.message.includes('blocked by CSP'))) {
      // Don't report CSP errors to avoid noise
      return null;
    }
    
    // Rate limit error reporting to avoid flooding Sentry
    if (event.exception && 
        event.exception.values && 
        event.exception.values.length > 0 && 
        event.exception.values[0].value) {
      const errorValue = event.exception.values[0].value;
      
      // Check for known errors that should be throttled
      if (errorValue.includes('Failed to fetch') || 
          errorValue.includes('Network Error') ||
          errorValue.includes('timeout')) {
        // Only send 1 in 10 of these common errors
        if (Math.random() > 0.1) {
          return null;
        }
      }
    }
    
    return event;
  }
});

// Initialize all security features with production settings
initializeSecurity();

// Initialize Pusher
getPusher();

// Create the root and render the application using our utility
const rootElement = createRootElement("root");

createRoot(rootElement).render(
  <ErrorBoundary 
    componentName="Root"
    fallback={
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-center p-6 max-w-md mx-auto">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-2xl">!</span>
          </div>
          <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">We've encountered an error and our team has been notified.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    }
  >
    <SecurityInitializer />
    <App />
  </ErrorBoundary>
);
