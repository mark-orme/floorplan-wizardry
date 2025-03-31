
/**
 * Drawing mode enum
 * Defines the available drawing tools for the canvas
 */
export enum DrawingMode {
  /** Select and manipulate objects */
  SELECT = 'select',
  /** Freehand drawing */
  DRAW = 'draw',
  /** Create straight lines */
  STRAIGHT_LINE = 'straight-line',
  /** Create rectangles */
  RECTANGLE = 'rectangle',
  /** Create circles */
  CIRCLE = 'circle',
  /** Create text */
  TEXT = 'text',
  /** Create wall */
  WALL = 'wall',
  /** Create door */
  DOOR = 'door',
  /** Create window */
  WINDOW = 'window',
  /** Create room label */
  ROOM_LABEL = 'room-label',
  /** Create room */
  ROOM = 'room',
  /** Single line */
  LINE = 'line',
  /** Measure distances */
  MEASURE = 'measure',
  /** Move the canvas */
  PAN = 'pan',
  /** Hand tool for panning */
  HAND = 'hand',
  /** Zoom the canvas */
  ZOOM = 'zoom',
  /** Erase objects */
  ERASE = 'erase',
  /** Eraser tool */
  ERASER = 'eraser'
}

