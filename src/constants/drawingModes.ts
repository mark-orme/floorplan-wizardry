
/**
 * Drawing modes for canvas operations
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
  
  // Add missing modes referenced in errors
  STRAIGHT_LINE = 'straight_line',
  PAN = 'pan',
  ERASER = 'eraser',
  MEASURE = 'measure'
}
