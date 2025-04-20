
import { DrawingMode } from '@/constants/drawingModes';
import type { DrawingMode as DrawingModeType } from '@/types/drawing-types';

/**
 * Validates that a string value is a valid DrawingMode
 * @param mode The mode to validate
 * @returns The validated DrawingMode
 * @throws Error if the mode is invalid
 */
export function validateDrawingMode(mode: string): DrawingMode {
  if (Object.values(DrawingMode).includes(mode as DrawingMode)) {
    return mode as DrawingMode;
  }
  
  console.warn(`Invalid drawing mode: ${mode}, defaulting to SELECT`);
  return DrawingMode.SELECT;
}

/**
 * Safely casts between DrawingMode types from different sources
 * to ensure compatibility
 * @param mode DrawingMode to cast
 * @returns The validated DrawingMode
 */
export function castDrawingMode(mode: DrawingModeType | DrawingMode): DrawingMode {
  return validateDrawingMode(mode as string);
}

/**
 * Get human-readable name for a drawing mode, with validation
 * @param mode DrawingMode to get name for
 * @returns Human-readable name
 */
export function getValidatedDrawingModeName(mode: string | DrawingMode): string {
  const validMode = validateDrawingMode(mode as string);
  
  // Return the name based on the mode
  switch (validMode) {
    case DrawingMode.SELECT: return 'Select';
    case DrawingMode.DRAW: return 'Draw';
    case DrawingMode.ERASE: return 'Erase';
    case DrawingMode.HAND: return 'Pan';
    case DrawingMode.WALL: return 'Wall';
    case DrawingMode.PENCIL: return 'Pencil';
    case DrawingMode.ROOM: return 'Room';
    case DrawingMode.TEXT: return 'Text';
    case DrawingMode.SHAPE: return 'Shape';
    case DrawingMode.LINE: return 'Line';
    case DrawingMode.RECTANGLE: return 'Rectangle';
    case DrawingMode.CIRCLE: return 'Circle';
    case DrawingMode.DOOR: return 'Door';
    case DrawingMode.WINDOW: return 'Window';
    case DrawingMode.STRAIGHT_LINE: return 'Straight Line';
    case DrawingMode.PAN: return 'Pan';
    case DrawingMode.ERASER: return 'Eraser';
    case DrawingMode.MEASURE: return 'Measure';
    case DrawingMode.DIMENSION: return 'Dimension';
    case DrawingMode.STAIR: return 'Stair';
    case DrawingMode.COLUMN: return 'Column';
    default: return 'Unknown';
  }
}
