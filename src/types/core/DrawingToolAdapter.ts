
import { DrawingMode } from '@/constants/drawingModes';

/**
 * Adapter function to ensure type safety when using DrawingMode
 * in components that expect a specific subset of modes
 * @param mode DrawingMode to validate
 * @returns The validated DrawingMode
 */
export function asDrawingTool(mode: DrawingMode): DrawingMode {
  // This function doesn't actually transform the value,
  // it just provides type checking at compile time
  return mode;
}

/**
 * Check if a mode requires precise input (like a stylus)
 * @param mode DrawingMode to check
 * @returns True if the mode benefits from precise input
 */
export function requiresPreciseInput(mode: DrawingMode): boolean {
  return [
    DrawingMode.STRAIGHT_LINE, 
    DrawingMode.LINE, 
    DrawingMode.WALL, 
    DrawingMode.RECT, 
    DrawingMode.RECTANGLE, 
    DrawingMode.CIRCLE
  ].includes(mode);
}

/**
 * Check if a mode supports pressure sensitivity
 * @param mode DrawingMode to check
 * @returns True if the mode supports pressure sensitivity
 */
export function supportsPressure(mode: DrawingMode): boolean {
  return [
    DrawingMode.DRAW, 
    DrawingMode.PENCIL
  ].includes(mode);
}
