
/**
 * Canvas error reporting utilities
 * @module utils/canvas/monitoring/errorReporting
 */
import { Canvas } from 'fabric';
import { generateCanvasDiagnosticReport, getCanvasHealthStatus } from './canvasHealthCheck';

/**
 * Log canvas initialization attempt
 * @param containerId Container ID
 * @param additionalInfo Additional info about the initialization attempt
 * @returns The attempt number
 */
export function logCanvasInitAttempt(containerId: string, additionalInfo: Record<string, any> = {}): number {
  console.log(`Canvas initialization attempt for container ${containerId}`, additionalInfo);
  // Return a standardized attempt number (simulated for now)
  return 1;
}

/**
 * Log canvas initialization success
 * @param canvasId Canvas ID
 * @param initDuration Time taken to initialize in ms
 * @param additionalInfo Additional initialization info
 */
export function logCanvasInitSuccess(canvasId: string, initDuration: number, additionalInfo: Record<string, any> = {}): void {
  console.log(`Canvas ${canvasId} initialized successfully in ${initDuration}ms`, additionalInfo);
}

/**
 * Handle canvas initialization error
 * @param error Error object
 * @param containerId Container ID
 * @param canvasElement Canvas element if available
 * @param attemptNumber Attempt number
 * @returns Whether error is fatal
 */
export function handleCanvasInitError(
  error: unknown, 
  containerId: string,
  canvasElement: HTMLCanvasElement | null = null,
  attemptNumber: number = 1
): boolean {
  console.error(`Canvas initialization failed for container ${containerId} (attempt ${attemptNumber}):`, error);
  
  // Determine if error is fatal based on attempt number or error type
  const isFatal = attemptNumber >= 3 || (error instanceof Error && error.message.includes('fatal'));
  
  // Log additional information
  console.info('Browser Info:', {
    userAgent: navigator.userAgent,
    vendor: navigator.vendor,
    platform: navigator.platform,
    hardwareConcurrency: navigator.hardwareConcurrency,
    deviceMemory: (navigator as any).deviceMemory || 'unknown',
    canvasElementPresent: !!canvasElement
  });
  
  return isFatal;
}

/**
 * Report canvas error with diagnostic data
 * @param error Error object
 * @param canvas Canvas instance
 * @param context Additional context
 */
export function reportCanvasError(
  error: unknown,
  canvas: Canvas | null,
  context?: Record<string, unknown>
): void {
  console.error('Canvas error:', error);
  
  // Additional diagnostics
  if (canvas) {
    console.info('Canvas diagnostic data:', getCanvasHealthStatus(canvas));
    console.info(generateCanvasDiagnosticReport(canvas));
  }
  
  if (context) {
    console.info('Error context:', context);
  }
}

/**
 * Generate error ID for tracking
 * @returns Unique error ID
 */
export function generateErrorId(): string {
  return `canvas-error-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
}
