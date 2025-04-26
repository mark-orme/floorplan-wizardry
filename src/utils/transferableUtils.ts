
/**
 * Utilities for working with transferable objects in web workers
 * @module utils/transferableUtils
 */

/**
 * Create a transferable canvas state
 * @param canvasJson Canvas JSON state
 * @returns Object with data and transferables
 */
export function createTransferableCanvasState(canvasJson: any) {
  // Create array buffer for transferable data
  const data = {
    json: JSON.stringify(canvasJson),
    timestamp: Date.now()
  };
  
  // In a real implementation, we would create transferable objects
  // like ArrayBuffers, but this is simplified for example
  const transferables: ArrayBuffer[] = [];
  
  return { data, transferables };
}

/**
 * Parse a transferable canvas state
 * @param data Transferable data
 * @returns Parsed canvas state
 */
export function parseTransferableCanvasState(data: any) {
  return JSON.parse(data.json);
}
