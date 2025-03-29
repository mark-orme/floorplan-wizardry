/**
 * Grid debugging utilities
 * Tools for debugging grid creation and rendering issues
 * @module grid/gridDebugUtils
 */
import { Canvas, Object as FabricObject } from "fabric";
import { throttledLog } from "./consoleThrottling";
import { captureError } from "../sentryUtils";

/**
 * Track grid creation attempts for debugging
 */
export const gridDebugStats = {
  // Creation attempts
  attempts: 0,
  failedAttempts: 0,
  successfulAttempts: 0,
  
  // Timing
  firstAttemptTime: 0,
  lastAttemptTime: 0,
  lastSuccessTime: 0,
  
  // Canvas state when last attempted
  lastCanvasDimensions: { width: 0, height: 0 },
  lastCanvasObjectCount: 0,
  
  // Error tracking
  lastError: null as Error | null,
  errorMessages: [] as string[],
  
  // Grid state
  lastGridObjectCount: 0,
  
  // Tracking flags
  hasEverSucceeded: false,
  
  // Reset stats
  reset(): void {
    this.attempts = 0;
    this.failedAttempts = 0;
    this.successfulAttempts = 0;
    this.firstAttemptTime = 0;
    this.lastAttemptTime = 0;
    this.lastSuccessTime = 0;
    this.lastCanvasDimensions = { width: 0, height: 0 };
    this.lastCanvasObjectCount = 0;
    this.lastError = null;
    this.errorMessages = [];
    this.lastGridObjectCount = 0;
    // Keep hasEverSucceeded as is - it's a lifetime value
  }
};

/**
 * Track a grid creation attempt
 * 
 * @param {Canvas} canvas - The canvas instance
 * @param {boolean} success - Whether the attempt was successful
 * @param {Error} [error] - Optional error if attempt failed
 */
export function trackGridAttempt(
  canvas: Canvas,
  success: boolean,
  error?: Error
): void {
  const now = Date.now();
  
  // First time setup
  if (gridDebugStats.firstAttemptTime === 0) {
    gridDebugStats.firstAttemptTime = now;
  }
  
  // Update stats
  gridDebugStats.attempts++;
  gridDebugStats.lastAttemptTime = now;
  
  // Store canvas info
  if (canvas) {
    gridDebugStats.lastCanvasDimensions = {
      width: canvas.width || 0,
      height: canvas.height || 0
    };
    gridDebugStats.lastCanvasObjectCount = canvas.getObjects()?.length || 0;
  }
  
  if (success) {
    gridDebugStats.successfulAttempts++;
    gridDebugStats.lastSuccessTime = now;
    gridDebugStats.hasEverSucceeded = true;
  } else {
    gridDebugStats.failedAttempts++;
    
    if (error) {
      gridDebugStats.lastError = error;
      gridDebugStats.errorMessages.push(error.message);
      
      // Keep the list at a reasonable size
      if (gridDebugStats.errorMessages.length > 10) {
        gridDebugStats.errorMessages.shift();
      }
    }
  }
}

/**
 * Generate a detailed report of grid state
 * 
 * @param {Canvas} canvas - The canvas instance
 * @param {FabricObject[]} gridObjects - The grid objects
 * @returns {Object} Detailed grid state report
 */
export function dumpGridState(
  canvas: Canvas,
  gridObjects: FabricObject[]
): Record<string, any> {
  const now = Date.now();
  const state = {
    timestamp: new Date().toISOString(),
    timeSinceFirstAttempt: gridDebugStats.firstAttemptTime ? now - gridDebugStats.firstAttemptTime : null,
    timeSinceLastAttempt: gridDebugStats.lastAttemptTime ? now - gridDebugStats.lastAttemptTime : null,
    timeSinceLastSuccess: gridDebugStats.lastSuccessTime ? now - gridDebugStats.lastSuccessTime : null,
    
    // Canvas state
    canvasExists: !!canvas,
    canvasInitialized: canvas && canvas.width > 0 && canvas.height > 0,
    canvasDimensions: canvas ? { width: canvas.width, height: canvas.height } : null,
    zoom: canvas?.getZoom?.() || null,
    viewportTransform: canvas?.viewportTransform || null,
    
    // Grid state
    gridLayerExists: Array.isArray(gridObjects),
    gridObjectCount: gridObjects?.length || 0,
    canvasObjectCount: canvas?.getObjects()?.length || 0,
    gridObjectsOnCanvas: canvas && gridObjects ? 
      gridObjects.filter(obj => canvas.contains(obj)).length : 0,
    
    // Debug stats
    stats: { ...gridDebugStats }
  };
  
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    throttledLog('Grid state dump:', state);
  }
  
  // Send detailed report to Sentry
  captureError(
    new Error(`Grid debug report: ${state.gridObjectCount} objects, ${state.gridObjectsOnCanvas} on canvas`),
    "grid-debug-report",
    {
      level: "info",
      tags: { 
        component: "grid", 
        operation: "debug-dump",
        success: String(!!state.gridObjectsOnCanvas && state.gridObjectsOnCanvas > 0)
      },
      extra: state
    }
  );
  
  return state;
}

/**
 * Check for common grid issues
 * 
 * @param {Canvas} canvas - The canvas instance
 * @param {FabricObject[]} gridObjects - The grid objects
 * @returns {string[]} Array of identified issues
 */
export function identifyGridIssues(
  canvas: Canvas,
  gridObjects: FabricObject[]
): string[] {
  const issues: string[] = [];
  
  if (!canvas) {
    issues.push("Canvas reference is null or undefined");
    return issues;
  }
  
  // Check canvas dimensions
  if (!canvas.width || !canvas.height || canvas.width <= 0 || canvas.height <= 0) {
    issues.push(`Canvas has invalid dimensions: ${canvas.width}x${canvas.height}`);
  }
  
  // Check grid objects
  if (!Array.isArray(gridObjects)) {
    issues.push("Grid objects reference is not an array");
  } else if (gridObjects.length === 0) {
    issues.push("Grid objects array is empty");
  } 
  
  // Check if grid objects are on canvas
  if (Array.isArray(gridObjects) && gridObjects.length > 0 && canvas) {
    const onCanvas = gridObjects.filter(obj => canvas.contains(obj)).length;
    
    if (onCanvas === 0) {
      issues.push("No grid objects are present on the canvas");
    } else if (onCanvas < gridObjects.length) {
      issues.push(`Only ${onCanvas}/${gridObjects.length} grid objects are on canvas`);
    }
    
    // Check grid object properties to ensure they're intact
    const invalidObjects = gridObjects.filter(obj => 
      !obj || !obj.get('name') || !(obj.get('name') as string).startsWith('grid-')
    );
    
    if (invalidObjects.length > 0) {
      issues.push(`${invalidObjects.length} grid objects are missing required properties`);
    }
  }
  
  // Additional checks for the canvas
  if (canvas) {
    // Check for abnormal zoom levels
    const zoom = canvas.getZoom();
    if (zoom && (zoom < 0.1 || zoom > 10)) {
      issues.push(`Canvas has abnormal zoom level: ${zoom}`);
    }
    
    // Check for large number of objects that might cause performance issues
    const totalObjects = canvas.getObjects()?.length || 0;
    if (totalObjects > 1000) {
      issues.push(`Canvas has unusually high number of objects: ${totalObjects}`);
    }
    
    // Check if canvas is in an invalid state
    try {
      const isRendering = (canvas as any)._isCurrentlyDrawing;
      if (isRendering) {
        issues.push("Canvas is currently in drawing state, may be locked");
      }
    } catch (e) {
      issues.push("Error checking canvas rendering state");
    }
  }
  
  // Report issues to Sentry
  if (issues.length > 0) {
    captureError(
      new Error(`Grid issues identified: ${issues.length} problems found`),
      "grid-issues",
      {
        level: "warning",
        tags: { component: "grid", operation: "diagnose" },
        extra: { 
          issues,
          canvasDimensions: canvas ? { width: canvas.width, height: canvas.height } : null,
          gridObjectCount: gridObjects?.length || 0
        }
      }
    );
  }
  
  return issues;
}

/**
 * Diagnostic function to be called when grid fails to render
 * Captures detailed state for debugging
 * 
 * @param {Canvas} canvas - The canvas instance 
 * @param {FabricObject[]} gridObjects - The grid objects
 * @param {string} context - Additional context about where this was called from
 */
export function diagnoseGridFailure(
  canvas: Canvas | null,
  gridObjects: FabricObject[] | null,
  context: string
): void {
  // Create a comprehensive report
  const report = {
    timestamp: new Date().toISOString(),
    context,
    canvasState: canvas ? {
      exists: true,
      width: canvas.width,
      height: canvas.height,
      zoom: canvas.getZoom?.() || 'unknown',
      objectCount: canvas.getObjects()?.length || 0,
      viewportTransform: canvas.viewportTransform,
      renderOnAddRemove: canvas.renderOnAddRemove
    } : { exists: false },
    gridState: gridObjects ? {
      exists: true,
      length: gridObjects.length,
      onCanvas: canvas ? gridObjects.filter(obj => canvas.contains(obj)).length : 'n/a'
    } : { exists: false },
    debugStats: { ...gridDebugStats },
    browserInfo: typeof window !== 'undefined' ? {
      userAgent: window.navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    } : null
  };
  
  // Send detailed diagnostic to Sentry
  captureError(
    new Error(`Grid failure diagnosed from ${context}`),
    "grid-failure-diagnosis",
    {
      level: "error",
      tags: { 
        component: "grid", 
        operation: "diagnose",
        context
      },
      extra: report
    }
  );
  
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error(`[Grid Diagnosis] Failure from ${context}:`, report);
  }
}
