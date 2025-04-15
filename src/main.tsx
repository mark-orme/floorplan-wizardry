
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

// IMPORTANT: Apply CSP first, before any network requests
initializeCSP(true);
console.log('Initial CSP applied with Sentry domains included');

// Create the root element
const rootElement = createRootElement("root");
const root = createRoot(rootElement);

// First render the SecurityInitializer to ensure the CSP is properly set
root.render(<SecurityInitializer />);

// Wait to ensure CSP is fully applied before Sentry initialization
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
      <SecurityInitializer />
      <App />
    </ErrorBoundary>
  );
}, 1000); // Increased timeout to ensure CSP is applied

function initializeServices() {
  console.log('Initializing services with CSP state:', checkCSPApplied() ? 'Valid' : 'Invalid');
  
  // Initialize Sentry with minimal configuration - disable features that might cause CSP issues
  Sentry.init({
    dsn: "https://abae2c559058eb2bbcd15686dac558ed@o4508914471927808.ingest.de.sentry.io/4509038014234704",
    integrations: [
      Sentry.browserTracingIntegration(),
      // Disable replay to avoid worker-src CSP issues
    ],
    
    // Basic configuration
    release: import.meta.env.VITE_SENTRY_RELEASE || "development",
    environment: import.meta.env.MODE,
    
    // Reduce sampling to avoid excessive requests
    tracesSampleRate: 0.05,
    tracePropagationTargets: ["localhost", /^https:\/\/.*lovable\.dev/, /^https:\/\/.*lovable\.app/],
    
    // COMPLETELY DISABLE features that cause CSP issues
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
    profilesSampleRate: 0,
    
    // Only send errors if CSP allows it
    beforeSend(event, hint) {
      // Do a final check to make sure CSP is set correctly
      if (!checkCSPApplied()) {
        console.warn('CSP still invalid during Sentry send, applying emergency fix');
        fixSentryCSP();
        // This send will fail, but future ones might work
        return null;
      }
      
      // Filter out CSP errors to avoid noise
      const error = hint?.originalException;
      if (error instanceof Error && 
          (error.message.includes('Content Security Policy') || 
           error.message.includes('CSP') ||
           error.message.includes('Refused to connect'))) {
        return null;
      }
      
      return event;
    },
    
    // Use our own error handler for failures
    errorHandler: (error) => {
      console.error("Sentry error:", error);
      // Don't show errors to users, just log them
    }
  });
  
  // Verify CSP after Sentry init and reapply if needed
  setTimeout(() => {
    if (!checkCSPApplied()) {
      console.warn('CSP was overwritten after Sentry init, reapplying');
      fixSentryCSP();
    }
  }, 200);
}
