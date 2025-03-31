
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
  /** Measure distances */
  MEASURE = 'measure',
  /** Move the canvas */
  PAN = 'pan',
  /** Zoom the canvas */
  ZOOM = 'zoom',
  /** Erase objects */
  ERASE = 'erase'
}
