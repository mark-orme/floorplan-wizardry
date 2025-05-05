
/**
 * Drawing mode constants for consistent usage across the application
 */
export enum DrawingMode {
  SELECT = 'select',
  DRAW = 'draw',
  STRAIGHT_LINE = 'straight-line',
  WALL = 'wall',
  ROOM = 'room',
  ERASER = 'eraser',
  PAN = 'pan',
  MEASURE = 'measure',
  TEXT = 'text',
  SHAPE = 'shape',
  // Add missing DrawingMode values that were causing errors
  HAND = 'hand',
  ERASE = 'erase',
  LINE = 'line',
  RECTANGLE = 'rectangle',
  CIRCLE = 'circle',
  PENCIL = 'pencil',
  DOOR = 'door',
  WINDOW = 'window'
}

/**
 * Check if a mode is a drawing mode (vs. selection)
 */
export function isDrawingMode(mode: DrawingMode): boolean {
  return mode !== DrawingMode.SELECT;
}

/**
 * Check if a mode requires snapping
 */
export function requiresSnapping(mode: DrawingMode): boolean {
  return [
    DrawingMode.STRAIGHT_LINE,
    DrawingMode.WALL,
    DrawingMode.ROOM,
    DrawingMode.LINE,
    DrawingMode.RECTANGLE,
    DrawingMode.CIRCLE
  ].includes(mode);
}

/**
 * Convert string to DrawingMode
 */
export function toDrawingMode(mode: string): DrawingMode {
  return mode as DrawingMode;
}

/**
 * Get tool button appearance for a mode
 */
export function getToolLabel(mode: DrawingMode): string {
  switch (mode) {
    case DrawingMode.SELECT: return 'Select';
    case DrawingMode.DRAW: return 'Draw';
    case DrawingMode.STRAIGHT_LINE: return 'Line';
    case DrawingMode.WALL: return 'Wall';
    case DrawingMode.ROOM: return 'Room';
    case DrawingMode.ERASER: return 'Erase';
    case DrawingMode.PAN: return 'Pan';
    case DrawingMode.MEASURE: return 'Measure';
    case DrawingMode.TEXT: return 'Text';
    case DrawingMode.SHAPE: return 'Shape';
    case DrawingMode.HAND: return 'Hand';
    case DrawingMode.ERASE: return 'Erase';
    case DrawingMode.LINE: return 'Line';
    case DrawingMode.RECTANGLE: return 'Rectangle'; 
    case DrawingMode.CIRCLE: return 'Circle';
    case DrawingMode.PENCIL: return 'Pencil';
    case DrawingMode.DOOR: return 'Door';
    case DrawingMode.WINDOW: return 'Window';
    default: return 'Tool';
  }
}
