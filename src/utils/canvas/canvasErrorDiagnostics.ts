
import logger from '@/utils/logger';

/**
 * Logs canvas errors with diagnostic information
 */
export const logCanvasError = (errorType: string, details: any) => {
  // Use logger.error instead of non-existent canvasError
  logger.error(`Canvas error: ${errorType}`, details);
};

/**
 * Runs diagnostics on canvas state
 */
export const runCanvasDiagnostics = (canvas: any) => {
  if (!canvas) {
    logger.error('Canvas diagnostic failed: Canvas is null');
    return false;
  }
  
  try {
    // Check if canvas has basic methods
    const checks = {
      hasAdd: typeof canvas.add === 'function',
      hasRender: typeof canvas.renderAll === 'function',
      hasObjects: Array.isArray(canvas.getObjects?.()),
      isValid: true
    };
    
    checks.isValid = Object.values(checks).every(v => v);
    
    if (!checks.isValid) {
      logger.error('Canvas diagnostic failed', checks);
    }
    
    return checks.isValid;
  } catch (err) {
    logger.error('Canvas diagnostic error', err);
    return false;
  }
};
