
/**
 * Utilities for working with transferable objects
 */

interface TransferableCanvasState {
  data: ArrayBuffer;
  transferables: ArrayBuffer[];
}

/**
 * Converts a canvas JSON state into a transferable format for workers
 * @param canvasJson The JSON representation of the canvas
 * @returns Object with data and transferables
 */
export const createTransferableCanvasState = (canvasJson: any): TransferableCanvasState => {
  // Convert JSON to string
  const jsonString = JSON.stringify(canvasJson);
  
  // Convert string to Uint8Array
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(jsonString);
  
  // Return the buffer and transferables
  return {
    data: encodedData.buffer,
    transferables: [encodedData.buffer]
  };
};

/**
 * Decodes a transferable canvas state back to JSON
 * @param buffer ArrayBuffer containing encoded canvas state
 * @returns Parsed JSON object
 */
export const decodeTransferableCanvasState = (buffer: ArrayBuffer): any => {
  const decoder = new TextDecoder();
  const jsonString = decoder.decode(buffer);
  return JSON.parse(jsonString);
};

/**
 * Creates a structured clone of an object for transferring
 * @param data Any serializable object
 * @returns Structured clone of the data
 */
export const createStructuredClone = <T>(data: T): T => {
  return structuredClone ? structuredClone(data) : JSON.parse(JSON.stringify(data));
};
