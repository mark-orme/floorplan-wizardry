
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
// Track specific error types for better diagnostics
const errorTypeOccurrences: Record<string, number> = {};

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
        attempts: canvasInitAttempts[canvasId],
        domState: checkDomReadiness()
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
      attempts: canvasInitAttempts[canvasId] || 1,
      fabricDetails: collectFabricDetails(details?.canvasType),
      domState: checkDomReadiness()
    }
  });
}

/**
 * Check DOM readiness state to aid in debugging loading issues
 */
function checkDomReadiness(): Record<string, any> {
  return {
    readyState: document.readyState,
    domContentLoaded: document.readyState === 'interactive' || document.readyState === 'complete',
    elementsInBody: document.body ? document.body.childElementCount : 'body not available',
    hasCanvas: document.querySelectorAll('canvas').length > 0,
    canvasesCount: document.querySelectorAll('canvas').length,
    canvasIds: Array.from(document.querySelectorAll('canvas')).map(c => c.id || 'no-id'),
    canvasStyles: Array.from(document.querySelectorAll('canvas')).map(c => ({
      width: c.width,
      height: c.height,
      style: c.getAttribute('style') || 'no-style'
    }))
  };
}

/**
 * Collect Fabric.js version and capabilities to aid debugging
 */
function collectFabricDetails(canvasType?: string): Record<string, any> {
  const details: Record<string, any> = {
    canvasType: canvasType || 'unknown',
    detected: false
  };
  
  try {
    // Check if fabric is available in window
    if (typeof window !== 'undefined' && (window as any).fabric) {
      const fabric = (window as any).fabric;
      details.detected = true;
      details.version = fabric.version || 'unknown';
      details.hasObjectPrototype = typeof fabric.Object === 'function';
      details.hasCanvasPrototype = typeof fabric.Canvas === 'function';
      details.supportsWebGL = typeof fabric.WebGLFilterBackend === 'function';
    }
  } catch (e) {
    details.detectionError = String(e);
  }
  
  return details;
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
  
  // Classify error for better tracking
  const errorType = classifyCanvasError(errorMessage);
  errorTypeOccurrences[errorType] = (errorTypeOccurrences[errorType] || 0) + 1;
  
  // Log the error with details
  logger.error(`Canvas initialization error (attempt #${attempt}): ${errorMessage}`, {
    error: errorMessage,
    errorType,
    canvasId,
    attempt
  });
  
  // Check for fatal canvas errors
  const isFatalCanvasError = checkForFatalCanvasError(error);
  
  // Collect detailed diagnostic information
  const diagnosticInfo = collectCanvasDiagnostics(canvasElement, isFatalCanvasError);
  
  // Get browser context information
  const browserContext = getBrowserContext();
  
  // Enhanced stack trace collection
  const stackTrace = error instanceof Error ? error.stack : undefined;
  
  // Report error to Sentry with comprehensive details
  captureError(error, `canvas-init-error-${isFatalCanvasError ? 'fatal' : 'retry'}-${errorType}`, {
    level: isFatalCanvasError ? 'fatal' : (attempt > 3 ? 'error' : 'warning'),
    tags: {
      component: 'Canvas',
      operation: 'initialization',
      attempt: String(attempt),
      canvasId,
      errorType: errorType,
      errorMessage: errorMessage.substring(0, 50), // First 50 chars for tagging
      isFatal: String(isFatalCanvasError)
    },
    extra: {
      diagnosticInfo,
      browserContext,
      errorCount: canvasErrorCounts[canvasId],
      errorOccurrencesByType: errorTypeOccurrences,
      fullErrorMessage: errorMessage,
      stackTrace,
      elementsLowerError: errorMessage.includes('elements.lower.el'),
      domState: checkDomReadiness(),
      fabricAvailable: typeof (window as any).fabric !== 'undefined'
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
        errorCount: String(canvasErrorCounts[canvasId]),
        errorType
      },
      extra: {
        allErrorTypes: Object.keys(errorTypeOccurrences),
        errorTypeCounts: errorTypeOccurrences
      }
    });
  }
  
  return isFatalCanvasError;
}

/**
 * Classify canvas error types to track patterns
 */
function classifyCanvasError(errorMessage: string): string {
  if (errorMessage.includes('elements.lower.el')) {
    return 'lower-element-undefined';
  } else if (errorMessage.includes('has been already initialized')) {
    return 'already-initialized';
  } else if (errorMessage.includes('WebGL context')) {
    return 'webgl-context';
  } else if (errorMessage.includes('context creation failed')) {
    return 'context-creation';
  } else if (errorMessage.includes('Cannot read properties of null')) {
    return 'null-property-access';
  } else if (errorMessage.includes('Cannot read properties of undefined')) {
    return 'undefined-property-access';
  } else if (errorMessage.includes('not a function')) {
    return 'not-a-function';
  } else if (errorMessage.includes('canvas is already in use')) {
    return 'canvas-in-use';
  } else {
    return 'other-canvas-error';
  }
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
    isFatalError: isFatal,
    allCanvasElements: {
      count: document.querySelectorAll('canvas').length,
      elementIds: Array.from(document.querySelectorAll('canvas')).map(c => c.id || 'no-id')
    }
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

  // Add DOM inspection details to help debug the lower.el issue
  diagnostics.domInspection = {
    canvasCount: document.querySelectorAll('canvas').length,
    fabricCanvasLowerExists: document.querySelectorAll('.fabric-canvas-container .lower-canvas').length > 0,
    canvasWrapperCount: document.querySelectorAll('.canvas-wrapper').length,
    canvasContainersDetails: Array.from(document.querySelectorAll('.canvas-wrapper')).map(el => ({
      childCount: el.childNodes.length,
      hasCanvas: el.querySelector('canvas') !== null
    }))
  };
  
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
      
      // Memory info if available - use optional chaining and type check
      if ('deviceMemory' in navigator) {
        const deviceMemory = (navigator as any).deviceMemory;
        if (deviceMemory !== undefined) {
          context.deviceMemory = deviceMemory;
        }
      }
      
      // Connection info if available - use optional chaining and type check
      if ('connection' in navigator) {
        const conn = (navigator as any).connection;
        if (conn) {
          context.connection = {
            effectiveType: conn.effectiveType,
            downlink: conn.downlink,
            rtt: conn.rtt,
            saveData: conn.saveData
          };
        }
      }
      
      // Document state
      context.documentState = {
        readyState: document.readyState,
        hidden: document.hidden,
        visibilityState: document.visibilityState
      };

      // Script loading status
      context.scriptLoading = {
        fabricScriptLoaded: typeof (window as any).fabric !== 'undefined',
        totalScriptsLoaded: document.querySelectorAll('script').length,
        asyncScriptsCount: document.querySelectorAll('script[async]').length
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
    errorTypeOccurrences,
    mostFrequentError: Object.entries(errorTypeOccurrences)
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, 1)
      .map(([type, count]) => ({ type, count }))[0] || 'none',
    browserContext: getBrowserContext(),
    timestamp: new Date().toISOString(),
    domState: checkDomReadiness(),
    appState: typeof window !== 'undefined' && (window as any).__app_state ? (window as any).__app_state : 'Not available',
    canvasState: typeof window !== 'undefined' && (window as any).__canvas_state ? (window as any).__canvas_state : 'Not available',
    fabricLibraryStatus: collectFabricDetails()
  };
}

/**
 * Check if Fabric.js has been loaded properly
 */
export function checkFabricJsLoading(): Record<string, any> {
  const result = {
    fabricDetected: false,
    fabricVersion: null,
    fabricObjectAvailable: false,
    fabricCanvasAvailable: false,
    fabricProblem: null,
    polyfillsLoaded: false
  };
  
  try {
    // Check if fabric global is available
    if (typeof window !== 'undefined' && (window as any).fabric) {
      result.fabricDetected = true;
      result.fabricVersion = (window as any).fabric.version;
      result.fabricObjectAvailable = typeof (window as any).fabric.Object === 'function';
      result.fabricCanvasAvailable = typeof (window as any).fabric.Canvas === 'function';
      
      // Check for specific missing components related to the lower.el error
      if (!(window as any).fabric.util || !(window as any).fabric.util.getElementOffset) {
        result.fabricProblem = 'Missing fabric.util.getElementOffset';
      }
    } else {
      result.fabricProblem = 'Fabric.js not loaded in window';
    }
    
    // Check for polyfills that Fabric.js might require
    if (typeof window !== 'undefined') {
      result.polyfillsLoaded = typeof (window as any).requestAnimationFrame === 'function';
    }
  } catch (e) {
    result.fabricProblem = String(e);
  }
  
  return result;
}

