
/**
 * Drawing modes for the canvas
 */
export enum DrawingMode {
  SELECT = 'select',
  PAN = 'pan',
  DRAW = 'draw',
  LINE = 'line',
  RECTANGLE = 'rectangle',
  CIRCLE = 'circle',
  TEXT = 'text',
  WALL = 'wall',
  ERASE = 'erase',
  // Add missing modes that were causing errors
  PENCIL = 'pencil',
  ROOM = 'room',
  ERASER = 'eraser',
  STRAIGHT_LINE = 'straight_line',
  HAND = 'hand',
  MEASURE = 'measure',
  DOOR = 'door',
  WINDOW = 'window',
  SHAPE = 'shape'
}
