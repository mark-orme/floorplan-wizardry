
/**
 * Canvas health monitoring utilities
 * @module utils/canvas/monitoring/canvasHealthCheck
 */
import { Canvas as FabricCanvas } from 'fabric';
import { ErrorCategory, ErrorSeverity } from './errorTypes';
import { reportCanvasError } from './errorReporting';

/**
 * Health check result
 */
export interface HealthCheckResult {
  healthy: boolean;
  issues: string[];
  objectCount: number;
  hasActiveSelection: boolean;
  hasBackground: boolean;
}

/**
 * Run a health check on the canvas
 * @param canvas Fabric canvas instance
 * @returns Health check result
 */
export function runCanvasHealthCheck(canvas: FabricCanvas | null): HealthCheckResult {
  const issues: string[] = [];
  
  if (!canvas) {
    return {
      healthy: false,
      issues: ['Canvas is null or undefined'],
      objectCount: 0,
      hasActiveSelection: false,
      hasBackground: false
    };
  }
  
  // Check canvas dimensions
  if (canvas.width === 0 || canvas.height === 0) {
    issues.push('Canvas has zero width or height');
  }
  
  // Check objects array
  const objectCount = canvas.getObjects().length;
  
  // Check selection
  const hasActiveSelection = !!canvas.getActiveObject();
  
  // Check background
  const hasBackground = !!canvas.backgroundColor;
  
  // Check canvas state
  if (!canvas.getContext()) {
    issues.push('Canvas has no context');
  }
  
  const healthy = issues.length === 0;
  
  return {
    healthy,
    issues,
    objectCount,
    hasActiveSelection,
    hasBackground
  };
}

/**
 * Monitor canvas health at regular intervals
 * @param canvas Fabric canvas instance
 * @param interval Check interval in milliseconds
 * @param callback Optional callback for health check results
 * @returns Cleanup function
 */
export function monitorCanvasHealth(
  canvas: FabricCanvas | null,
  interval: number = 30000,
  callback?: (result: HealthCheckResult) => void
): () => void {
  if (!canvas) {
    reportCanvasError(
      'Cannot monitor canvas health: canvas is null',
      ErrorCategory.INITIALIZATION,
      ErrorSeverity.MEDIUM
    );
    return () => {};
  }
  
  const intervalId = setInterval(() => {
    const result = runCanvasHealthCheck(canvas);
    
    if (!result.healthy) {
      reportCanvasError(
        `Canvas health check failed: ${result.issues.join(', ')}`,
        ErrorCategory.RENDERING,
        ErrorSeverity.MEDIUM,
        { result }
      );
    }
    
    if (callback) {
      callback(result);
    }
  }, interval);
  
  return () => clearInterval(intervalId);
}
