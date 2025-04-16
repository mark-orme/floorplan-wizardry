
/**
 * Canvas error reporting utilities
 * @module utils/canvas/monitoring/errorReporting
 */
import { Canvas } from 'fabric';
import { generateCanvasDiagnosticReport, getCanvasHealthStatus } from './canvasHealthCheck';

/**
 * Log canvas initialization attempt
 * @param containerId Container ID
 */
export function logCanvasInitAttempt(containerId: string): void {
  console.log(`Canvas initialization attempt for container ${containerId}`);
}

/**
 * Log canvas initialization success
 * @param canvas Initialized canvas
 */
export function logCanvasInitSuccess(canvas: Canvas): void {
  console.log(`Canvas initialized successfully: ${canvas.width}x${canvas.height}`);
}

/**
 * Handle canvas initialization error
 * @param error Error object
 * @param containerId Container ID
 */
export function handleCanvasInitError(error: unknown, containerId: string): void {
  console.error(`Canvas initialization failed for container ${containerId}:`, error);
  
  // Log additional information
  console.info('Browser Info:', {
    userAgent: navigator.userAgent,
    vendor: navigator.vendor,
    platform: navigator.platform,
    hardwareConcurrency: navigator.hardwareConcurrency,
    deviceMemory: (navigator as any).deviceMemory || 'unknown'
  });
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
