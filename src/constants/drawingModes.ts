
/**
 * Drawing modes used by the canvas tools
 * This is the **single source of truth** for DrawingMode everywhere!
 */
export enum DrawingMode {
  SELECT = 'select',
  DRAW = 'draw',
  RECT = 'rect',            // legacy alias
  RECTANGLE = 'rectangle',
  CIRCLE = 'circle',
  LINE = 'line',
  STRAIGHT_LINE = 'straight_line',
  PENCIL = 'pencil',
  ERASER = 'eraser',
  ERASE = 'erase',
  TEXT = 'text',
  SHAPE = 'shape',
  HAND = 'hand',
  WALL = 'wall',
  ROOM = 'room',
  ROOM_LABEL = 'room_label',
  PAN = 'pan',
  MEASURE = 'measure',
  DOOR = 'door',
  WINDOW = 'window',
  ZOOM = 'zoom'
}
