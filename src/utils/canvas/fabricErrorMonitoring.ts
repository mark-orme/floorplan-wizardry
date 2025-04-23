
import { Canvas, Object as FabricObject } from 'fabric';
import { captureMessage, captureError } from '../sentry';

/**
 * Safely send an object to the back of the canvas
 * @param obj - Fabric object to send to back
 * @param canvas - Fabric canvas instance
 */
export const safeSendToBack = (obj: FabricObject, canvas: Canvas): void => {
  try {
    canvas.sendToBack(obj);
  } catch (error) {
    console.error('Error sending object to back:', error);
    captureError(error instanceof Error ? error : new Error('Failed to send object to back'));
  }
};

/**
 * Capture rendering errors safely
 * @param canvas - Fabric canvas instance
 * @param component - Name of the component where error occurred
 * @param error - The error that occurred
 */
export const captureRenderingError = (canvas: Canvas, component: string, error: unknown): void => {
  console.error(`Rendering error in ${component}:`, error);
  
  // Safely convert error to string for logging
  const errorMessage = error instanceof Error 
    ? error.message 
    : String(error);
  
  captureMessage(`Canvas rendering error in ${component}: ${errorMessage}`, 'error');
  
  // Try to collect canvas diagnostics
  try {
    const diagnostics = {
      objectCount: canvas.getObjects().length,
      canvasWidth: canvas.width,
      canvasHeight: canvas.height,
      renderingEnabled: !canvas.skipOffscreen
    };
    
    // Use JSON.stringify to convert the object to a string for the error message
    captureMessage(`Canvas state: ${JSON.stringify(diagnostics)}`, 'info');
  } catch (diagError) {
    captureMessage('Failed to collect canvas diagnostics', 'warning');
  }
};
