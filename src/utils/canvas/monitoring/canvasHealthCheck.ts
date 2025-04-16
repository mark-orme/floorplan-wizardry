
/**
 * Canvas health check utilities
 * @module utils/canvas/monitoring/canvasHealthCheck
 */
import { Canvas, Object as FabricObject } from 'fabric';

/**
 * Canvas health status
 */
export interface CanvasHealthStatus {
  isInitialized: boolean;
  hasObjects: boolean;
  objectCount: number;
  isDrawingMode: boolean;
  dimensions: {
    width: number;
    height: number;
  };
  hasSelections: boolean;
  gridLayerExists: boolean;
  sessionDuration: number;
  lastRenderTime: number | null;
  memoryUsage: {
    jsHeapSize: number;
    totalJSHeapSize: number;
    usedJSHeapSize: number;
  } | null;
}

/**
 * Default health status
 */
const DEFAULT_HEALTH_STATUS: CanvasHealthStatus = {
  isInitialized: false,
  hasObjects: false,
  objectCount: 0,
  isDrawingMode: false,
  dimensions: {
    width: 0,
    height: 0
  },
  hasSelections: false,
  gridLayerExists: false,
  sessionDuration: 0,
  lastRenderTime: null,
  memoryUsage: null
};

/**
 * Session start time
 */
const SESSION_START_TIME = Date.now();

/**
 * Get canvas health status
 * @param canvas Canvas to check
 * @returns Canvas health status
 */
export function getCanvasHealthStatus(canvas: Canvas | null): CanvasHealthStatus {
  if (!canvas) {
    return DEFAULT_HEALTH_STATUS;
  }

  // Get objects
  const objects = canvas.getObjects();
  const gridLayer = objects.filter(obj => obj.objectType === 'grid');
  
  // Get memory usage
  const memoryUsage = typeof performance !== 'undefined' && 'memory' in performance ? 
    {
      jsHeapSize: (performance as any).memory.jsHeapSizeLimit,
      totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
      usedJSHeapSize: (performance as any).memory.usedJSHeapSize
    } : null;
  
  return {
    isInitialized: true,
    hasObjects: objects.length > 0,
    objectCount: objects.length,
    isDrawingMode: canvas.isDrawingMode,
    dimensions: {
      width: canvas.width || 0,
      height: canvas.height || 0
    },
    hasSelections: !!canvas.getActiveObject(),
    gridLayerExists: gridLayer.length > 0,
    sessionDuration: Date.now() - SESSION_START_TIME,
    lastRenderTime: canvas.__lastRenderTime || null,
    memoryUsage
  };
}

/**
 * Check if canvas is healthy
 * @param canvas Canvas to check
 * @returns True if canvas is healthy
 */
export function isCanvasHealthy(canvas: Canvas | null): boolean {
  if (!canvas) {
    return false;
  }
  
  const status = getCanvasHealthStatus(canvas);
  return status.isInitialized && !isNaN(status.dimensions.width) && !isNaN(status.dimensions.height);
}

/**
 * Generate canvas diagnostic report
 * @param canvas Canvas to check
 * @returns Diagnostic report
 */
export function generateCanvasDiagnosticReport(canvas: Canvas | null): string {
  const status = getCanvasHealthStatus(canvas);
  
  return `
Canvas Diagnostic Report:
------------------------
Time: ${new Date().toISOString()}
Session Duration: ${Math.floor(status.sessionDuration / 1000)}s

Canvas Status:
- Initialized: ${status.isInitialized}
- Drawing Mode: ${status.isDrawingMode}
- Dimensions: ${status.dimensions.width}x${status.dimensions.height}

Objects:
- Total: ${status.objectCount}
- Has Selections: ${status.hasSelections}
- Grid Layer: ${status.gridLayerExists}

Memory (if available):
${status.memoryUsage ? `- JS Heap Size: ${Math.round(status.memoryUsage.jsHeapSize / 1024 / 1024)}MB
- Total JS Heap: ${Math.round(status.memoryUsage.totalJSHeapSize / 1024 / 1024)}MB
- Used JS Heap: ${Math.round(status.memoryUsage.usedJSHeapSize / 1024 / 1024)}MB` : '- Not available'}
`;
}

/**
 * Check if Fabric.js is loaded correctly
 * @returns True if Fabric.js is loaded
 */
export function checkFabricJsLoading(): boolean {
  try {
    return typeof FabricObject !== 'undefined';
  } catch (error) {
    console.error('Fabric.js loading check failed:', error);
    return false;
  }
}
