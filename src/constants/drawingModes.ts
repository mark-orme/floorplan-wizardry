
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
  WINDOW = 'window',
  DIMENSION = 'dimension',
  STAIR = 'stair',
  COLUMN = 'column'
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
  const normalized = mode.toLowerCase().replace(/_/g, '-');
  
  // Check if it's directly in the enum
  if (Object.values(DrawingMode).includes(normalized as DrawingMode)) {
    return normalized as DrawingMode;
  }
  
  // Handle special cases
  switch (normalized) {
    case 'straight_line':
    case 'straightline':
      return DrawingMode.STRAIGHT_LINE;
    case 'erase':
      return DrawingMode.ERASER;
    case 'hand':
      return DrawingMode.PAN;
    default:
      return DrawingMode.SELECT;
  }
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
    case DrawingMode.DIMENSION: return 'Dimension';
    case DrawingMode.STAIR: return 'Stair';
    case DrawingMode.COLUMN: return 'Column';
    default: return 'Tool';
  }
}

// Add DEFAULT_STROKE_COLOR for imports that need it
export const DEFAULT_STROKE_COLOR = '#000000';
export const DEFAULT_STROKE_WIDTH = 2;

export const DEFAULT_COLORS = {
  stroke: '#000000',
  fill: 'transparent',
  highlight: '#3498db',
  error: '#e74c3c',
  warning: '#f39c12',
  success: '#2ecc71'
};

// Add PIXELS_PER_METER for imports that need it
export const PIXELS_PER_METER = 100;
export const DEFAULT_GRID_SIZE = 20;
