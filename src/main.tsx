
import { createRoot } from 'react-dom/client'
import * as Sentry from "@sentry/react";
import App from './App.tsx'
import './index.css'
import { createRootElement } from './utils/domUtils.ts'
import SecurityInitializer, { applyFullCSP } from './components/security/SecurityInitializer';
import { initializeSecurity } from './utils/security';
import { ErrorBoundary } from './utils/canvas/errorBoundary';
import { initializeCSP, checkCSPApplied, fixSentryCSP, MASTER_CSP_STRING } from './utils/security/contentSecurityPolicy';
import { toast } from 'sonner';

// First step: directly apply CSP with meta tag BEFORE any other operations
function applyDirectCSP() {
  console.log('Applying direct CSP...');
  
  // Remove any existing CSP meta tags
  const existingTags = document.querySelectorAll('meta[http-equiv="Content-Security-Policy"]');
  existingTags.forEach(tag => tag.remove());
  
  // Apply the master CSP
  const meta = document.createElement('meta');
  meta.httpEquiv = 'Content-Security-Policy';
  meta.content = MASTER_CSP_STRING;
  document.head.appendChild(meta);
  
  // Mark as applied
  document.documentElement.setAttribute('data-csp-applied', 'true');
  document.documentElement.setAttribute('data-csp-timestamp', Date.now().toString());
  
  console.log('Direct CSP meta tag applied with ALL domains');
  return true;
}

// Apply CSP immediately
const cspApplied = applyDirectCSP();
console.log('Initial direct CSP applied:', cspApplied);

// Create the root element
const rootElement = createRootElement("root");
const root = createRoot(rootElement);

// First render the SecurityInitializer to ensure the CSP is properly set
root.render(<SecurityInitializer forceRefresh={true} />);

// Short wait to ensure CSP is fully applied before Sentry initialization
setTimeout(() => {
  // Double-check CSP is applied correctly before initializing services
  if (!checkCSPApplied()) {
    console.warn('CSP check failed, applying emergency fix');
    applyFullCSP();
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
}, 300);

function initializeServices() {
  console.log('Initializing services with CSP state:', checkCSPApplied() ? 'Valid' : 'Invalid');
  
  // IMPORTANT: Check one more time and fix if needed
  if (!checkCSPApplied()) {
    console.warn('CSP still invalid before Sentry init, applying final emergency fix');
    applyFullCSP();
  }
  
  // Initialize Sentry with minimal configuration to avoid CSP issues
  Sentry.init({
    dsn: "https://abae2c559058eb2bbcd15686dac558ed@o4508914471927808.ingest.de.sentry.io/4509038014234704",
    
    // Carefully selected integrations to avoid CSP issues
    integrations: [],
    
    // Basic configuration
    release: import.meta.env.VITE_SENTRY_RELEASE || "development",
    environment: import.meta.env.MODE,
    
    // Set sample rates low to minimize potential CSP issues
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
    profilesSampleRate: 0,
    
    // Filter out CSP errors and check CSP before sending
    beforeSend(event, hint) {
      // Do a final check to make sure CSP is set correctly
      if (!checkCSPApplied()) {
        console.warn('CSP still invalid during Sentry send, applying emergency fix');
        applyFullCSP(); 
        // Continue with the event anyway
      }
      
      // Filter out CSP errors to avoid noise
      const error = hint?.originalException;
      if (error instanceof Error && 
          (error.message.includes('Content Security Policy') || 
           error.message.includes('CSP') ||
           error.message.includes('Refused to connect'))) {
        console.warn('Filtering out CSP-related error:', error.message);
        return null;
      }
      
      return event;
    }
  });
  
  // Verify CSP after Sentry init and reapply if needed
  setTimeout(() => {
    if (!checkCSPApplied()) {
      console.warn('CSP was overwritten after Sentry init, reapplying direct meta tag');
      applyFullCSP();
    }
  }, 100);
}

export default root;
