
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

/**
 * Safely performs an async operation on a canvas
 * @param canvasRef Canvas reference
 * @param operation Async function to execute with the canvas
 * @returns Promise with the result of the operation or undefined if canvas is null
 */
export async function withCanvasAsync<T>(
  canvasRef: FabricCanvas | React.MutableRefObject<FabricCanvas | null>,
  operation: (canvas: FabricCanvas) => Promise<T>
): Promise<T | undefined> {
  const canvas = getActualCanvas(canvasRef);
  
  if (canvas) {
    return await operation(canvas);
  }
  
  return undefined;
}

/**
 * Checks if a canvas reference contains a valid canvas
 * @param canvasRef Canvas reference
 * @returns Whether the canvas is valid
 */
export function isValidCanvas(canvasRef: FabricCanvas | React.MutableRefObject<FabricCanvas | null>): boolean {
  return getActualCanvas(canvasRef) !== null;
}

/**
 * Creates a wrapper function that applies an operation only if the canvas is valid
 * @param operation Function to execute with the canvas
 * @returns Wrapped function that only executes if canvas is valid
 */
export function createCanvasOperation<T, Args extends any[]>(
  operation: (canvas: FabricCanvas, ...args: Args) => T
): (canvasRef: FabricCanvas | React.MutableRefObject<FabricCanvas | null>, ...args: Args) => T | undefined {
  return (canvasRef, ...args) => {
    return withCanvas(canvasRef, (canvas) => operation(canvas, ...args));
  };
}
