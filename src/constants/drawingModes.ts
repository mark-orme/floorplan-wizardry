
export enum DrawingMode {
  SELECT = 'SELECT',
  DRAW = 'DRAW',
  RECT = 'RECT',
  CIRCLE = 'CIRCLE',
  LINE = 'LINE',
  WALL = 'WALL',
  DOOR = 'DOOR',
  WINDOW = 'WINDOW',
  ROOM = 'ROOM',
  MEASUREMENT = 'MEASUREMENT',
  MEASURE = 'MEASURE', // Add this for compatibility with existing code
  // Add missing values that are used in the codebase
  STRAIGHT_LINE = 'STRAIGHT_LINE',
  HAND = 'HAND',
  PAN = 'PAN',
  ERASER = 'ERASER',
  ERASE = 'ERASE',
  TEXT = 'TEXT',
  ZOOM = 'ZOOM',
  PENCIL = 'PENCIL',
  SHAPE = 'SHAPE',
  COLUMN = 'COLUMN',
  DIMENSION = 'DIMENSION',
  STAIR = 'STAIR',
  RECTANGLE = 'RECTANGLE',
  ROOM_LABEL = 'ROOM_LABEL'
}
