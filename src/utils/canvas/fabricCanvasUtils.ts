import { Canvas as FabricCanvas } from 'fabric';

/**
 * Gets the actual canvas from a canvas reference
 * @param canvasRef Canvas reference which could be a MutableRefObject or the canvas itself
 * @returns The actual fabric canvas instance or null
 */
export function getActualCanvas(canvasRef: FabricCanvas | React.MutableRefObject<FabricCanvas | null>): FabricCanvas | null {
  if (!canvasRef) {
    return null;
  }
  
  // If it's a ref, return the current value
  if ('current' in canvasRef) {
    return canvasRef.current;
  }
  
  // Otherwise, it's already a canvas
  return canvasRef;
}

/**
 * Safely performs an operation on a canvas
 * @param canvasRef Canvas reference
 * @param operation Function to execute with the canvas
 * @returns Result of the operation or undefined if canvas is null
 */
export function withCanvas<T>(
  canvasRef: FabricCanvas | React.MutableRefObject<FabricCanvas | null>,
  operation: (canvas: FabricCanvas) => T
): T | undefined {
  const canvas = getActualCanvas(canvasRef);
  
  if (canvas) {
    return operation(canvas);
  }
  
  return undefined;
}
