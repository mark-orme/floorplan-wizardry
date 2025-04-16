
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
import { markPerformance, trackComponentLoad, markInitialized } from './utils/healthMonitoring';

// Track application load performance
const startTime = performance.now();

// Log initial load event
console.log(`Application loading started at ${new Date().toISOString()}`);
markPerformance('app-load-start');

// Log all rendering phases for debugging page load issues
const renderPhases = {
  start: Date.now(),
  cspApplied: 0,
  domReady: 0,
  securityInitialized: 0,
  servicesInitialized: 0,
  appRendered: 0
};

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
  renderPhases.cspApplied = Date.now();
  return true;
}

// Apply CSP immediately
const cspApplied = applyDirectCSP();
console.log('Initial direct CSP applied:', cspApplied);
markInitialized('csp', cspApplied);

// Track initialization progress
function updateInitProgress(stage: string) {
  if (renderPhases[stage as keyof typeof renderPhases] === undefined) {
    (renderPhases as any)[stage] = Date.now();
  }
  
  // Calculate the percentage of initialization completed (based on expected stages)
  const totalStages = Object.keys(renderPhases).length;
  const completedStages = Object.values(renderPhases).filter(time => time > 0).length;
  const percentage = Math.round((completedStages / totalStages) * 100);
  
  // Update a data attribute on the root element for potential progress indicators
  document.documentElement.setAttribute('data-init-progress', String(percentage));
  document.documentElement.setAttribute('data-init-stage', stage);
  
  // Log progress
  console.log(`Initialization progress: ${percentage}% (${stage})`);
  
  return { percentage, completedStages, totalStages };
}

// Create the root element
const rootElement = createRootElement("root");
const root = createRoot(rootElement);

// Track DOM ready state
document.addEventListener('DOMContentLoaded', () => {
  console.log(`DOM content loaded at ${new Date().toISOString()}`);
  renderPhases.domReady = Date.now();
  markPerformance('dom-content-loaded');
  updateInitProgress('domReady');
});

// Track window load state
window.addEventListener('load', () => {
  const loadTime = performance.now() - startTime;
  console.log(`Window fully loaded in ${loadTime.toFixed(2)}ms`);
  markPerformance('window-load-complete');
  
  // Report detailed timing metrics to Sentry when available
  setTimeout(() => {
    if (Sentry && typeof Sentry.captureMessage === 'function') {
      Sentry.setTag('page_load_time_ms', Math.round(loadTime));
      
      const timingPhases = {};
      Object.entries(renderPhases).forEach(([phase, timestamp]) => {
        if (timestamp > 0) {
          (timingPhases as any)[`${phase}_ms`] = timestamp - renderPhases.start;
        }
      });
      
      Sentry.captureMessage(`Application fully loaded in ${loadTime.toFixed(0)}ms`, {
        level: 'info',
        tags: {
          component: 'main',
          operation: 'page-load',
          load_time_ms: Math.round(loadTime)
        },
        extra: {
          renderPhases: timingPhases,
          navigationTiming: collectNavigationTiming(),
          resourceTiming: collectResourceTiming()
        }
      });
    }
  }, 1000);
});

// Collect navigation timing metrics
function collectNavigationTiming() {
  if (window.performance && window.performance.timing) {
    const timing = window.performance.timing;
    return {
      navigationStart: 0,
      fetchStart: timing.fetchStart - timing.navigationStart,
      domainLookupStart: timing.domainLookupStart - timing.navigationStart,
      domainLookupEnd: timing.domainLookupEnd - timing.navigationStart,
      connectStart: timing.connectStart - timing.navigationStart,
      connectEnd: timing.connectEnd - timing.navigationStart,
      secureConnectionStart: timing.secureConnectionStart ? timing.secureConnectionStart - timing.navigationStart : 0,
      requestStart: timing.requestStart - timing.navigationStart,
      responseStart: timing.responseStart - timing.navigationStart,
      responseEnd: timing.responseEnd - timing.navigationStart,
      domLoading: timing.domLoading - timing.navigationStart,
      domInteractive: timing.domInteractive - timing.navigationStart,
      domContentLoadedEventStart: timing.domContentLoadedEventStart - timing.navigationStart,
      domContentLoadedEventEnd: timing.domContentLoadedEventEnd - timing.navigationStart,
      domComplete: timing.domComplete - timing.navigationStart,
      loadEventStart: timing.loadEventStart - timing.navigationStart,
      loadEventEnd: timing.loadEventEnd - timing.navigationStart
    };
  }
  return {};
}

// Collect resource timing metrics for critical resources
function collectResourceTiming() {
  if (window.performance && window.performance.getEntriesByType) {
    try {
      const resourceEntries = window.performance.getEntriesByType('resource');
      
      // Filter and process only the most important resources (JS, CSS, fonts)
      return resourceEntries
        .filter((entry: any) => {
          const url = entry.name || '';
          return url.endsWith('.js') || 
                 url.endsWith('.css') || 
                 url.includes('fonts') ||
                 url.includes('vendor');
        })
        .map((entry: any) => ({
          name: entry.name,
          type: entry.initiatorType,
          duration: Math.round(entry.duration),
          size: entry.transferSize || 0,
          startTime: Math.round(entry.startTime)
        }))
        .sort((a: any, b: any) => b.duration - a.duration) // Sort by duration (slowest first)
        .slice(0, 5); // Only return the 5 slowest resources
    } catch (e) {
      console.error('Error collecting resource timing:', e);
      return { error: 'Failed to collect resource timing' };
    }
  }
  return {};
}

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
  
  // Check for canvas-specific errors
  const isCanvasError = errorInfo.message.includes('canvas') || 
                       errorInfo.message.includes('fabric') ||
                       errorInfo.source.includes('fabric') ||
                       errorInfo.message.includes('elements.lower.el'); // The specific error we're seeing
  
  if (isCanvasError) {
    // Flag as a canvas-specific error for special handling
    (errorInfo as any).isCanvasError = true;
  }
  
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
updateInitProgress('securityInitialized');
renderPhases.securityInitialized = Date.now();

// Short wait to ensure CSP is fully applied before Sentry initialization
setTimeout(() => {
  // Double-check CSP is applied correctly before initializing services
  if (!checkCSPApplied()) {
    console.warn('CSP check failed, applying emergency fix');
    applyFullCSP();
  }
  
  // Initialize services (including Sentry)
  initializeServices();
  updateInitProgress('servicesInitialized');
  renderPhases.servicesInitialized = Date.now();
  
  // Render the full application
  root.render(
    <ErrorBoundary 
      componentName="Root"
      captureErrors={true}
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
  
  updateInitProgress('appRendered');
  renderPhases.appRendered = Date.now();
  markPerformance('app-rendered');
}, 300);

function initializeServices() {
  console.log('Initializing services with CSP state:', checkCSPApplied() ? 'Valid' : 'Invalid');
  const serviceStartTime = performance.now();
  
  // IMPORTANT: Check one more time and fix if needed
  if (!checkCSPApplied()) {
    console.warn('CSP still invalid before Sentry init, applying final emergency fix');
    applyFullCSP();
  }
  
  // Initialize Sentry with enhanced configuration for debugging
  Sentry.init({
    dsn: "https://abae2c559058eb2bbcd15686dac558ed@o4508914471927808.ingest.de.sentry.io/4509038014234704",
    
    // Carefully selected integrations to avoid CSP issues
    integrations: [
      new Sentry.BrowserTracing({
        // Trace transactions for canvas operations
        tracingOrigins: ['localhost', /^\//],
      }),
    ],
    
    // Basic configuration
    release: import.meta.env.VITE_SENTRY_RELEASE || "development",
    environment: import.meta.env.MODE,
    
    // Increase sample rates for debugging page load issues
    tracesSampleRate: 0.5,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 0.5,
    profilesSampleRate: 0.1,
    
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
          
          // Add initialization phases
          const initPhases = {};
          Object.entries(renderPhases).forEach(([phase, timestamp]) => {
            if (timestamp > 0) {
              (initPhases as any)[phase] = timestamp - renderPhases.start;
            }
          });
          
          event.extra = event.extra || {};
          event.extra.performance = performanceMetrics;
          event.extra.initPhases = initPhases;
          
          // Add canvas state if available
          if (window.__canvas_state) {
            event.extra.canvasState = window.__canvas_state;
          }
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
      
      // Add additional canvas info for 'elements.lower.el' errors
      if (error instanceof Error && error.message.includes('elements.lower.el')) {
        event.tags.error_type = 'canvas_elements_lower';
        event.tags.browser = navigator.userAgent.includes('Safari') ? 'safari' : 
                            navigator.userAgent.includes('Firefox') ? 'firefox' : 
                            navigator.userAgent.includes('Chrome') ? 'chrome' : 'other';
        
        event.extra = event.extra || {};
        event.extra.fabricInfo = {
          canvasState: window.__canvas_state || 'Not available',
          devicePixelRatio: window.devicePixelRatio,
          screenSize: {
            width: window.screen.width,
            height: window.screen.height
          }
        };
      }
      
      return event;
    }
  });
  
  // Mark Sentry as initialized in health monitoring
  markInitialized('sentry', true);
  
  // Report any early errors that occurred before Sentry was initialized
  setTimeout(() => {
    if (window.__earlyErrors && window.__earlyErrors.length > 0) {
      window.__earlyErrors.forEach(error => {
        // Special handling for canvas errors
        const level = (error as any).isCanvasError ? 'fatal' : 'error';
        
        Sentry.captureMessage(`Early error: ${error.message}`, {
          level: level as Sentry.SeverityLevel,
          tags: {
            early_error: 'true',
            error_type: (error as any).isCanvasError ? 'canvas' : 'other',
            source: error.source
          },
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
      level: 'info',
      extra: {
        initializationPhases: renderPhases
      }
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
