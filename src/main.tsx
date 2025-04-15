
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

// Track application load performance
const startTime = performance.now();

// Log initial load event
console.log(`Application loading started at ${new Date().toISOString()}`);

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

// Track DOM ready state
document.addEventListener('DOMContentLoaded', () => {
  console.log(`DOM content loaded at ${new Date().toISOString()}`);
});

// Track window load state
window.addEventListener('load', () => {
  const loadTime = performance.now() - startTime;
  console.log(`Window fully loaded in ${loadTime.toFixed(2)}ms`);
  
  // Report this to Sentry when available
  setTimeout(() => {
    if (Sentry && typeof Sentry.captureMessage === 'function') {
      Sentry.setTag('page_load_time_ms', Math.round(loadTime));
      Sentry.captureMessage(`Application fully loaded in ${loadTime.toFixed(0)}ms`, 'info');
    }
  }, 1000);
});

// Track unhandled global errors
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error || event.message);
  
  // We'll report this to Sentry once it's initialized
  const errorInfo = {
    message: event.message || 'Unknown error',
    source: event.filename || 'unknown',
    line: event.lineno,
    column: event.colno,
    stack: event.error && event.error.stack,
    timestamp: new Date().toISOString()
  };
  
  // Store for later reporting once Sentry is initialized
  window.__earlyErrors = window.__earlyErrors || [];
  window.__earlyErrors.push(errorInfo);
});

// Track unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  
  // Store for later reporting
  const rejectionInfo = {
    message: event.reason?.message || 'Unknown promise rejection',
    stack: event.reason?.stack,
    timestamp: new Date().toISOString()
  };
  
  window.__earlyRejections = window.__earlyRejections || [];
  window.__earlyRejections.push(rejectionInfo);
});

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
            <div className="text-sm text-gray-500 mb-4">
              <p>Error information has been logged. Please try refreshing the page.</p>
            </div>
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
      <App />
    </ErrorBoundary>
  );
}, 300);

function initializeServices() {
  console.log('Initializing services with CSP state:', checkCSPApplied() ? 'Valid' : 'Invalid');
  const serviceStartTime = performance.now();
  
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
      
      // Add page load context to errors
      event.tags = event.tags || {};
      event.tags.page_url = window.location.href;
      event.tags.referrer = document.referrer || 'direct';
      
      // Add performance metrics if available
      if (window.performance) {
        try {
          const performanceMetrics = {
            navigationStart: 0,
            loadEventEnd: 0,
            domComplete: 0
          };
          
          const perfTiming = performance.timing;
          if (perfTiming) {
            performanceMetrics.navigationStart = perfTiming.navigationStart;
            performanceMetrics.loadEventEnd = perfTiming.loadEventEnd;
            performanceMetrics.domComplete = perfTiming.domComplete;
          }
          
          event.extra = event.extra || {};
          event.extra.performance = performanceMetrics;
        } catch (e) {
          console.error('Error collecting performance metrics:', e);
        }
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
  
  // Report any early errors that occurred before Sentry was initialized
  setTimeout(() => {
    if (window.__earlyErrors && window.__earlyErrors.length > 0) {
      window.__earlyErrors.forEach(error => {
        Sentry.captureMessage(`Early error: ${error.message}`, {
          level: 'error',
          extra: error
        });
      });
      console.log(`Reported ${window.__earlyErrors.length} early errors to Sentry`);
    }
    
    if (window.__earlyRejections && window.__earlyRejections.length > 0) {
      window.__earlyRejections.forEach(rejection => {
        Sentry.captureMessage(`Early promise rejection: ${rejection.message}`, {
          level: 'error',
          extra: rejection
        });
      });
      console.log(`Reported ${window.__earlyRejections.length} early rejections to Sentry`);
    }
    
    // Report initialization duration
    const serviceInitTime = performance.now() - serviceStartTime;
    Sentry.captureMessage(`Services initialized in ${serviceInitTime.toFixed(0)}ms`, {
      level: 'info'
    });
  }, 1000);
  
  // Verify CSP after Sentry init and reapply if needed
  setTimeout(() => {
    if (!checkCSPApplied()) {
      console.warn('CSP was overwritten after Sentry init, reapplying direct meta tag');
      applyFullCSP();
    }
  }, 100);
}

// Declare global types for early error tracking
// Use interface augmentation instead of direct declaration
declare global {
  interface Window {
    __earlyErrors?: Array<{
      message: string;
      source?: string;
      line?: number;
      column?: number;
      stack?: string;
      timestamp: string;
    }>;
    __earlyRejections?: Array<{
      message: string;
      stack?: string;
      timestamp: string;
    }>;
    // Use the existing type definitions from global.d.ts
    // DO NOT redefine these properties with different types
  }
}

export default root;

