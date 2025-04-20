
/**
 * Drawing mode enum
 * Defines the available tools for drawing and interacting with the canvas
 */
export enum DrawingMode {
  SELECT = 'select',
  DRAW = 'draw',
  LINE = 'line',
  STRAIGHT_LINE = 'straightLine',
  RECTANGLE = 'rectangle',
  CIRCLE = 'circle',
  TEXT = 'text',
  PAN = 'pan',
  HAND = 'hand',
  ZOOM = 'zoom',
  ERASE = 'erase',
  ERASER = 'eraser',
  MEASURE = 'measure',
  WALL = 'wall',
  DOOR = 'door',
  WINDOW = 'window',
  ROOM = 'room',
  ROOM_LABEL = 'roomLabel',
  PENCIL = 'pencil',
  SHAPE = 'shape',
  // Add any other drawing modes needed by the application
}
