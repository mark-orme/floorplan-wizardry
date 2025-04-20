
/**
 * Centralized DrawingMode enum to ensure consistency across the application
 */
export enum DrawingMode {
  SELECT = 'select',
  DRAW = 'draw',
  ERASE = 'erase',
  HAND = 'hand',
  WALL = 'wall',
  PENCIL = 'pencil',
  ROOM = 'room',
  TEXT = 'text',
  SHAPE = 'shape',
  LINE = 'line',
  RECTANGLE = 'rectangle',
  CIRCLE = 'circle',
  DOOR = 'door',
  WINDOW = 'window',
  STRAIGHT_LINE = 'straight_line',
  PAN = 'pan',
  ERASER = 'eraser',
  MEASURE = 'measure',
  DIMENSION = 'dimension',
  STAIR = 'stair',
  COLUMN = 'column'
}

// Type aliases for compatibility with different parts of the application
export type DrawingTool = DrawingMode;
export type DrawingToolId = keyof typeof DrawingMode;
