
import { createRoot } from 'react-dom/client'
import * as Sentry from "@sentry/react";
import App from './App.tsx'
import './index.css'
import { createRootElement } from './utils/domUtils.ts'
import SecurityInitializer from './components/security/SecurityInitializer';
import { initializeSecurity } from './utils/security';
import { ErrorBoundary } from './utils/canvas/errorBoundary';
import { initializeCSP, checkCSPApplied, fixSentryCSP } from './utils/security/contentSecurityPolicy';
import { toast } from 'sonner';

// CRITICAL: First, directly apply a meta tag with the correct domains BEFORE any Sentry initialization
const addDirectCSPMetaTag = () => {
  // Force remove any existing CSP meta tag
  const existingTags = document.querySelectorAll('meta[http-equiv="Content-Security-Policy"]');
  existingTags.forEach(tag => tag.remove());
  
  // Most permissive CSP that includes ALL required domains
  const cspContent = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self' https://*.supabase.co wss://*.lovable.dev https://*.lovable.dev https://o4508914471927808.ingest.de.sentry.io https://*.ingest.de.sentry.io https://*.ingest.sentry.io https://*.sentry.io https://sentry.io https://api.sentry.io https://ingest.sentry.io wss://ws-eu.pusher.com https://sockjs-eu.pusher.com wss://*.pusher.com https://*.pusher.com https://*.lovable.app ws: http://localhost:*; frame-src 'self' https://*.lovable.dev https://*.lovable.app; object-src 'none'; base-uri 'self'; worker-src 'self' blob: 'unsafe-inline'; child-src 'self' blob:;";
  
  const meta = document.createElement('meta');
  meta.httpEquiv = 'Content-Security-Policy';
  meta.content = cspContent;
  document.head.appendChild(meta);
  
  console.log('Direct CSP meta tag applied with ALL domains:', cspContent);
  return true;
};

// Apply CSP directly BEFORE any other operations
const cspApplied = addDirectCSPMetaTag();
console.log('Initial direct CSP applied:', cspApplied);

// Also apply through the utility for completeness
initializeCSP(true);
console.log('Secondary CSP application completed');

// Create the root element
const rootElement = createRootElement("root");
const root = createRoot(rootElement);

// First render the SecurityInitializer to ensure the CSP is properly set
root.render(<SecurityInitializer forceRefresh={true} />);

// Shorter wait to ensure CSP is fully applied before Sentry initialization
setTimeout(() => {
  // Double-check CSP is applied correctly before initializing services
  if (!checkCSPApplied()) {
    console.warn('CSP check failed, applying emergency fix');
    fixSentryCSP();
  }
  
  // Initialize services (including Sentry)
  initializeServices();
  
  // Render the full application
  root.render(
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
      <SecurityInitializer forceRefresh={true} />
      <App />
    </ErrorBoundary>
  );
}, 500); // Shorter timeout but still enough to ensure CSP is applied

function initializeServices() {
  console.log('Initializing services with CSP state:', checkCSPApplied() ? 'Valid' : 'Invalid');
  
  // IMPORTANT: Check one more time and fix if needed
  if (!checkCSPApplied()) {
    console.warn('CSP still invalid before Sentry init, applying final emergency fix');
    addDirectCSPMetaTag();
  }
  
  // Initialize Sentry with minimal configuration - disable features that might cause CSP issues
  Sentry.init({
    dsn: "https://abae2c559058eb2bbcd15686dac558ed@o4508914471927808.ingest.de.sentry.io/4509038014234704",
    integrations: [
      // Disable all integrations to avoid CSP issues
      // Sentry.browserTracingIntegration(),
    ],
    
    // Basic configuration
    release: import.meta.env.VITE_SENTRY_RELEASE || "development",
    environment: import.meta.env.MODE,
    
    // REDUCE to bare minimum to avoid CSP issues
    tracesSampleRate: 0.01, // Reduce sample rate significantly
    
    // COMPLETELY DISABLE all features that cause CSP issues
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
    profilesSampleRate: 0,
    
    // Filter out CSP errors and check CSP before sending
    beforeSend(event, hint) {
      // Do a final check to make sure CSP is set correctly
      if (!checkCSPApplied()) {
        console.warn('CSP still invalid during Sentry send, applying emergency fix');
        addDirectCSPMetaTag(); // Apply directly
        return null; // Don't send this event
      }
      
      // Filter out CSP errors to avoid noise
      const error = hint?.originalException;
      if (error instanceof Error && 
          (error.message.includes('Content Security Policy') || 
           error.message.includes('CSP') ||
           error.message.includes('Refused to connect'))) {
        console.warn('Filtering out CSP-related error', error.message);
        return null;
      }
      
      return event;
    }
  });
  
  // Verify CSP after Sentry init and reapply if needed
  setTimeout(() => {
    if (!checkCSPApplied()) {
      console.warn('CSP was overwritten after Sentry init, reapplying direct meta tag');
      addDirectCSPMetaTag();
    }
  }, 100);
}

export default root;
