
/**
 * Performance Audit Utilities
 * Tools for identifying and fixing computational bottlenecks
 * @module utils/performanceAudit
 */
import { Canvas as FabricCanvas } from 'fabric';
import logger from '@/utils/logger';

// Operation types that should be offloaded
const HEAVY_OPERATIONS = [
  'area calculation',
  'distance calculation',
  'path simplification',
  'grid snapping',
  'serialization',
  'deserialization',
  'batch processing',
  'polygon operations',
  'canvas state management'
];

/**
 * Interface for performance audit result
 */
export interface PerformanceAuditResult {
  /** Whether the audit passed */
  passed: boolean;
  /** Messages from the audit */
  messages: string[];
  /** Suggestions for improvements */
  suggestions: string[];
  /** Performance metrics */
  metrics: {
    /** FPS during rendering */
    fps: number;
    /** Canvas object count */
    objectCount: number;
    /** Memory usage */
    memoryUsage: number;
    /** Rendering time */
    renderTime: number;
  };
}

/**
 * Audit canvas for performance issues
 * @param canvas Fabric canvas instance
 * @returns Audit results
 */
export const auditCanvasPerformance = (canvas: FabricCanvas | null): PerformanceAuditResult => {
  if (!canvas) {
    return {
      passed: false,
      messages: ['No canvas provided for audit'],
      suggestions: ['Initialize canvas before auditing'],
      metrics: { fps: 0, objectCount: 0, memoryUsage: 0, renderTime: 0 }
    };
  }
  
  // Start measurements
  const startTime = performance.now();
  const objectCount = canvas.getObjects().length;
  
  // Measure render time
  let renderTime = 0;
  const renderCompletePromise = new Promise<void>(resolve => {
    canvas.once('after:render', () => {
      renderTime = performance.now() - startTime;
      resolve();
    });
    canvas.renderAll();
  });
  
  // Get memory usage if available
  const memoryUsage = (performance as any).memory 
    ? (performance as any).memory.usedJSHeapSize / (1024 * 1024)
    : 0;
  
  // Estimate FPS based on render time
  const estimatedFps = renderTime > 0 ? Math.min(60, 1000 / renderTime) : 60;
  
  // Generate suggestions based on object count
  const suggestions: string[] = [];
  
  if (objectCount > 500) {
    suggestions.push('Large object count detected. Consider using worker-based rendering and object culling.');
  }
  
  if (renderTime > 16) {
    suggestions.push('Slow rendering detected. Consider using optimization techniques like object pooling or simplified geometries.');
  }
  
  if (memoryUsage > 100) {
    suggestions.push('High memory usage detected. Check for memory leaks or excessive object properties.');
  }
  
  // Detect if worker is being used appropriately
  if (objectCount > 200 && !window.Worker) {
    suggestions.push('Web Workers are not supported in this browser but would be beneficial for this canvas size.');
  }
  
  // Create final audit result
  const result: PerformanceAuditResult = {
    passed: renderTime <= 16 && estimatedFps >= 50,
    messages: [
      `Canvas has ${objectCount} objects`,
      `Render time: ${renderTime.toFixed(2)}ms`,
      `Estimated FPS: ${estimatedFps.toFixed(1)}`,
      memoryUsage > 0 ? `Memory usage: ${memoryUsage.toFixed(2)}MB` : 'Memory usage: Unknown'
    ],
    suggestions,
    metrics: {
      fps: estimatedFps,
      objectCount,
      memoryUsage,
      renderTime
    }
  };
  
  // Log audit results
  logger.info('Canvas performance audit completed', result);
  
  return result;
};

/**
 * Check if given code is using worker-based computation
 * @param code Code to analyze
 * @returns Analysis result
 */
export const analyzeCodeForWorkerUsage = (code: string): {
  usesWorkers: boolean;
  missingWorkers: string[];
  suggestions: string[];
} => {
  const result = {
    usesWorkers: false,
    missingWorkers: [] as string[],
    suggestions: [] as string[]
  };
  
  // Check if code includes worker imports
  result.usesWorkers = code.includes('Worker') || 
                      code.includes('useGeometryWorker') || 
                      code.includes('useOptimizedGeometryWorker');
  
  // Check for heavy operations
  HEAVY_OPERATIONS.forEach(operation => {
    if (code.toLowerCase().includes(operation) && !result.usesWorkers) {
      result.missingWorkers.push(operation);
    }
  });
  
  // Generate suggestions
  if (result.missingWorkers.length > 0) {
    result.suggestions.push(`Consider offloading these operations to Web Workers: ${result.missingWorkers.join(', ')}`);
    
    if (!code.includes('useOptimizedGeometryWorker')) {
      result.suggestions.push('Import and use useOptimizedGeometryWorker for heavy geometry calculations');
    }
  }
  
  return result;
};

/**
 * Create a performance report for the application
 * @returns Performance report data
 */
export const generatePerformanceReport = (): Record<string, any> => {
  return {
    timestamp: new Date().toISOString(),
    browser: navigator.userAgent,
    workerSupport: typeof Worker !== 'undefined',
    transferableSupport: testTransferableSupport(),
    memory: (performance as any).memory 
      ? {
          jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit / (1024 * 1024),
          totalJSHeapSize: (performance as any).memory.totalJSHeapSize / (1024 * 1024),
          usedJSHeapSize: (performance as any).memory.usedJSHeapSize / (1024 * 1024)
        }
      : 'Not available',
    recommendations: getPerformanceRecommendations()
  };
};

/**
 * Test if transferable objects are supported
 * @returns Whether transferable objects are supported
 */
function testTransferableSupport(): boolean {
  try {
    const buffer = new ArrayBuffer(1);
    const worker = new Worker(
      URL.createObjectURL(new Blob([''], { type: 'application/javascript' }))
    );
    
    worker.postMessage(buffer, [buffer]);
    const isSupported = buffer.byteLength === 0;
    worker.terminate();
    
    return isSupported;
  } catch (e) {
    return false;
  }
}

/**
 * Get performance recommendations based on current browser environment
 * @returns Array of recommendations
 */
function getPerformanceRecommendations(): string[] {
  const recommendations: string[] = [];
  
  // Worker support
  if (typeof Worker === 'undefined') {
    recommendations.push('Web Workers are not supported in this browser. Consider providing a fallback for heavy calculations.');
  }
  
  // SharedArrayBuffer support for thread pooling
  if (typeof SharedArrayBuffer === 'undefined') {
    recommendations.push('SharedArrayBuffer is not supported. Thread communication will be slower.');
  }
  
  // Memory limits
  if ((performance as any).memory && (performance as any).memory.jsHeapSizeLimit < 2147483648) {
    recommendations.push('Low memory limit detected. Consider memory optimizations.');
  }
  
  return recommendations;
}
