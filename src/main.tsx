
import { createRoot } from 'react-dom/client'
import * as Sentry from "@sentry/react";
import App from './App.tsx'
import './index.css'
import { getPusher } from './utils/pusher.ts'
import { createRootElement } from './utils/domUtils.ts'
import SecurityInitializer from './components/security/SecurityInitializer';
import { initializeSecurity } from './utils/security';
import { ErrorBoundary } from './utils/canvas/errorBoundary';

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
  tracesSampleRate: 1.0, // Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
  
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%
  replaysOnErrorSampleRate: 1.0, // 100% when sampling sessions where errors occur
  
  // Disable performance profiling to avoid document policy violations
  profilesSampleRate: 0, 
  
  // Ensure we capture breadcrumbs for better debugging context
  beforeBreadcrumb(breadcrumb) {
    return breadcrumb;
  },
  
  // Add custom context to all errors
  beforeSend(event) {
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
    
    return event;
  }
});

// Initialize all security features 
initializeSecurity();

// Initialize Pusher
getPusher();

// Create the root and render the application using our utility
const rootElement = createRootElement("root");

// Add no-referrer meta tag for privacy
if (typeof document !== 'undefined') {
  const metaReferrer = document.createElement('meta');
  metaReferrer.setAttribute('name', 'referrer');
  metaReferrer.content = 'no-referrer';
  document.head.appendChild(metaReferrer);
  
  // Block iframe embedding
  const metaFrameOptions = document.createElement('meta');
  metaFrameOptions.httpEquiv = 'X-Frame-Options';
  metaFrameOptions.content = 'DENY';
  document.head.appendChild(metaFrameOptions);
  
  // Add CSP header
  const metaCSP = document.createElement('meta');
  metaCSP.httpEquiv = 'Content-Security-Policy';
  metaCSP.content = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' https://*.sentry.io https://*.supabase.co wss://*.lovable.dev; frame-ancestors 'none'; object-src 'none'";
  document.head.appendChild(metaCSP);
}

createRoot(rootElement).render(
  <ErrorBoundary 
    componentName="Root"
    fallback={({ error, componentStack, resetError }) => (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-center p-6 max-w-md mx-auto">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-2xl">!</span>
          </div>
          <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">We've encountered an error and our team has been notified.</p>
          <button
            onClick={resetError}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )}
  >
    <SecurityInitializer />
    <App />
  </ErrorBoundary>
);
