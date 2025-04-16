
/**
 * Canvas Error Monitoring
 * Specialized error monitoring and diagnostics for canvas-related errors
 */
import { captureError, captureMessage } from '@/utils/sentryUtils';
import logger from '@/utils/logger';
import { toast } from 'sonner';

// Track canvas initialization attempts
const canvasInitAttempts: Record<string, number> = {};
const canvasErrorCounts: Record<string, number> = {};

/**
 * Log canvas initialization attempt
 * @param canvasId Unique canvas identifier
 * @param dimensions Canvas dimensions
 * @returns Current attempt number
 */
export function logCanvasInitAttempt(canvasId: string, dimensions: { width: number; height: number }): number {
  // Initialize or increment attempt counter
  canvasInitAttempts[canvasId] = (canvasInitAttempts[canvasId] || 0) + 1;
  
  // Get current attempt number
  const attempt = canvasInitAttempts[canvasId];
  
  // Log the attempt
  logger.info(`Canvas initialization attempt #${attempt} for canvas ${canvasId}`, {
    dimensions,
    attempt
  });
  
  // Report to Sentry for tracking patterns
  if (attempt > 1) {
    captureMessage(`Canvas initialization retry #${attempt}`, 'canvas-init-retry', {
      level: attempt > 3 ? 'warning' : 'info',
      tags: {
        component: 'Canvas',
        operation: 'initialization',
        attempt: String(attempt),
        canvasId
      },
      extra: {
        dimensions,
        timestamp: new Date().toISOString(),
        attempts: canvasInitAttempts[canvasId]
      }
    });
  }
  
  return attempt;
}

/**
 * Log canvas initialization success
 * @param canvasId Unique canvas identifier
 * @param duration Initialization duration in ms
 * @param details Additional initialization details
 */
export function logCanvasInitSuccess(canvasId: string, duration: number, details?: Record<string, any>): void {
  // Reset error count on success
  canvasErrorCounts[canvasId] = 0;
  
  // Log success
  logger.info(`Canvas ${canvasId} initialized successfully in ${duration}ms`, {
    duration,
    attempts: canvasInitAttempts[canvasId] || 1,
    ...details
  });
  
  // Report to Sentry for performance tracking
  captureMessage(`Canvas initialized successfully in ${duration}ms`, 'canvas-init-success', {
    level: 'info',
    tags: {
      component: 'Canvas',
      operation: 'initialization',
      canvasId,
      initDuration: `${Math.round(duration)}ms`
    },
    extra: {
      details,
      attempts: canvasInitAttempts[canvasId] || 1
    }
  });
}

/**
 * Handle canvas initialization error with comprehensive diagnostics
 * @param error The error that occurred
 * @param canvasId Unique canvas identifier
 * @param canvasElement DOM reference to canvas element
 * @param attempt Current attempt number
 * @returns Whether the error is fatal (preventing further attempts)
 */
export function handleCanvasInitError(
  error: unknown, 
  canvasId: string, 
  canvasElement: HTMLCanvasElement | null,
  attempt: number
): boolean {
  // Track error count
  canvasErrorCounts[canvasId] = (canvasErrorCounts[canvasId] || 0) + 1;
  
  // Extract error message
  const errorMessage = error instanceof Error 
    ? error.message 
    : String(error);
  
  // Log the error with details
  logger.error(`Canvas initialization error (attempt #${attempt})`, {
    error: errorMessage,
    canvasId,
    attempt
  });
  
  // Check for fatal canvas errors
  const isFatalCanvasError = checkForFatalCanvasError(error);
  
  // Collect detailed diagnostic information
  const diagnosticInfo = collectCanvasDiagnostics(canvasElement, isFatalCanvasError);
  
  // Get browser context information
  const browserContext = getBrowserContext();
  
  // Report error to Sentry with comprehensive details
  captureError(error, `canvas-init-error-${isFatalCanvasError ? 'fatal' : 'retry'}`, {
    level: isFatalCanvasError ? 'fatal' : (attempt > 3 ? 'error' : 'warning'),
    tags: {
      component: 'Canvas',
      operation: 'initialization',
      attempt: String(attempt),
      canvasId,
      errorType: isFatalCanvasError ? 'fatal' : 'recoverable'
    },
    extra: {
      diagnosticInfo,
      browserContext,
      errorCount: canvasErrorCounts[canvasId],
      errorMessage
    }
  });
  
  // Show error notification to user if this is a recurring issue
  if (attempt > 2 || isFatalCanvasError) {
    toast.error('Canvas initialization failed. Please refresh the page and try again.');
  }
  
  // Report if we've hit the error threshold
  if (canvasErrorCounts[canvasId] >= 5) {
    captureMessage('Canvas initialization error threshold exceeded', 'canvas-init-failure', {
      level: 'fatal',
      tags: {
        component: 'Canvas',
        operation: 'initialization',
        errorCount: String(canvasErrorCounts[canvasId])
      }
    });
  }
  
  return isFatalCanvasError;
}

/**
 * Check if an error is a fatal canvas error that should prevent retries
 */
function checkForFatalCanvasError(error: unknown): boolean {
  const errorMessage = error instanceof Error 
    ? error.message 
    : String(error);
  
  // List of known fatal canvas error signatures
  const fatalErrorPatterns = [
    'has been already initialized',
    'context creation failed',
    'WebGL context',
    'elements.lower.el', // This matches the current error we're seeing
    'canvas is already in use',
    'Cannot read property',
    'undefined is not an object', // General fatal JS errors
    'null is not an object',
    'Cannot read properties of null',
    'Cannot read properties of undefined'
  ];
  
  return fatalErrorPatterns.some(pattern => errorMessage.includes(pattern));
}

/**
 * Collect detailed canvas diagnostics for debugging
 */
function collectCanvasDiagnostics(
  canvasElement: HTMLCanvasElement | null,
  isFatal: boolean
): Record<string, any> {
  const diagnostics: Record<string, any> = {
    canvasElementExists: !!canvasElement,
    timestamp: new Date().toISOString(),
    documentReady: document.readyState,
    isFatalError: isFatal
  };
  
  // Canvas element details if available
  if (canvasElement) {
    try {
      diagnostics.canvasDetails = {
        width: canvasElement.width,
        height: canvasElement.height,
        offsetWidth: canvasElement.offsetWidth,
        offsetHeight: canvasElement.offsetHeight,
        clientWidth: canvasElement.clientWidth,
        clientHeight: canvasElement.clientHeight,
        style: {
          width: canvasElement.style.width,
          height: canvasElement.style.height,
          display: canvasElement.style.display,
          visibility: canvasElement.style.visibility
        },
        attributes: {
          id: canvasElement.id,
          className: canvasElement.className,
          dataset: JSON.stringify(canvasElement.dataset)
        },
        parentDetails: canvasElement.parentElement ? {
          tagName: canvasElement.parentElement.tagName,
          id: canvasElement.parentElement.id,
          className: canvasElement.parentElement.className,
          childCount: canvasElement.parentElement.childNodes.length
        } : 'No parent element'
      };
      
      // Check if canvas context can be obtained
      try {
        const context = canvasElement.getContext('2d');
        diagnostics.context2dAvailable = !!context;
      } catch (ctxError) {
        diagnostics.context2dError = String(ctxError);
      }
      
      // Check WebGL context
      try {
        const glContext = canvasElement.getContext('webgl') || canvasElement.getContext('experimental-webgl');
        diagnostics.webglAvailable = !!glContext;
      } catch (glError) {
        diagnostics.webglError = String(glError);
      }
    } catch (diagnosticError) {
      diagnostics.diagnosticCollectionError = String(diagnosticError);
    }
  }
  
  return diagnostics;
}

/**
 * Get browser and environment context for error diagnosis
 */
function getBrowserContext(): Record<string, any> {
  const context: Record<string, any> = {};
  
  try {
    if (typeof window !== 'undefined') {
      context.userAgent = navigator.userAgent;
      context.vendor = navigator.vendor;
      context.platform = navigator.platform;
      context.devicePixelRatio = window.devicePixelRatio;
      context.viewport = {
        width: window.innerWidth,
        height: window.innerHeight
      };
      context.screenSize = {
        width: window.screen.width,
        height: window.screen.height
      };
      
      // Memory info if available
      if (navigator.deviceMemory) {
        context.deviceMemory = navigator.deviceMemory;
      }
      
      // Connection info if available
      if (navigator.connection) {
        const conn = navigator.connection as any;
        context.connection = {
          effectiveType: conn.effectiveType,
          downlink: conn.downlink,
          rtt: conn.rtt,
          saveData: conn.saveData
        };
      }
      
      // Document state
      context.documentState = {
        readyState: document.readyState,
        hidden: document.hidden,
        visibilityState: document.visibilityState
      };
    }
  } catch (contextError) {
    context.contextCollectionError = String(contextError);
  }
  
  return context;
}

/**
 * Generate diagnostic report for canvas issues
 * @returns Diagnostic report object
 */
export function generateCanvasDiagnosticReport(): Record<string, any> {
  return {
    canvasInitAttempts,
    canvasErrorCounts,
    browserContext: getBrowserContext(),
    timestamp: new Date().toISOString(),
    appState: typeof window !== 'undefined' && window.__app_state ? window.__app_state : 'Not available',
    canvasState: typeof window !== 'undefined' && window.__canvas_state ? window.__canvas_state : 'Not available'
  };
}
