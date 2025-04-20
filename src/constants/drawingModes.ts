
/**
 * Drawing modes for canvas operations
 */
export enum DrawingMode {
  SELECT = 'SELECT',
  DRAW = 'DRAW',
  ERASE = 'ERASE',
  HAND = 'HAND',
  WALL = 'WALL',
  PENCIL = 'PENCIL',
  ROOM = 'ROOM',
  TEXT = 'TEXT',
  SHAPE = 'SHAPE',
  LINE = 'LINE',
  RECTANGLE = 'RECTANGLE',
  CIRCLE = 'CIRCLE',
  DOOR = 'DOOR',
  WINDOW = 'WINDOW',
  
  // Add missing modes referenced in errors
  STRAIGHT_LINE = 'STRAIGHT_LINE',
  PAN = 'PAN',
  ERASER = 'ERASER',
  MEASURE = 'MEASURE'
}
