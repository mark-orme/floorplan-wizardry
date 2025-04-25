
/**
 * Drawing modes used by the canvas tools
 * This is the **single source of truth** for DrawingMode everywhere!
 */
export enum DrawingMode {
  SELECT = 'select',
  DRAW = 'draw',
  RECT = 'rectangle',
  CIRCLE = 'circle',
  LINE = 'line',
  PENCIL = 'pencil',
  ERASER = 'eraser',
  TEXT = 'text',
  SHAPE = 'shape',
  STRAIGHT_LINE = 'straight_line',
  ERASE = 'erase',
  HAND = 'hand',
  WALL = 'wall',
  ROOM = 'room',
  PAN = 'pan',
  ROOM_LABEL = 'room_label',
  MEASURE = 'measure',
  DOOR = 'door',
  WINDOW = 'window',
  ZOOM = 'zoom'
}
