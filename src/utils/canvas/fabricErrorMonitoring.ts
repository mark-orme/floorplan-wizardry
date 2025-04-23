
import { captureMessage } from '@/utils/sentry';

/**
 * Monitors Fabric.js errors and reports them
 */
export const monitorFabricErrors = (canvas: any) => {
  if (!canvas) return;
  
  const originalRenderAll = canvas.renderAll;
  
  canvas.renderAll = function() {
    try {
      return originalRenderAll.apply(this, arguments);
    } catch (err) {
      captureMessage(`Fabric renderAll error: ${err.message}`, 'error');
      console.error('Fabric renderAll error:', err);
      throw err;
    }
  };
};

/**
 * Verifies if a Fabric object has a required method
 */
export const verifyFabricMethod = (obj: any, methodName: string) => {
  const hasMethod = obj && typeof obj[methodName] === 'function';
  
  if (!hasMethod) {
    // Convert the object to a string representation for error reporting
    captureMessage(`Fabric method missing: ${methodName} on ${obj?.type || 'unknown'}`, 'error');
  }
  
  return hasMethod;
};

/**
 * Logs a fabric error with context information
 */
export const logFabricError = (objectType: any, methodName: string, hasMethod: boolean) => {
  // Convert the object to a string before passing to captureMessage
  captureMessage(`Fabric error: ${objectType} - ${methodName} exists: ${hasMethod}`, 'error');
};
