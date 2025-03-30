
/**
 * Drawing mode constants
 * @module constants/drawingModes
 */

/**
 * Enum for drawing tools
 */
export enum DrawingMode {
  SELECT = 'select',
  DRAW = 'draw',
  LINE = 'line',
  STRAIGHT_LINE = 'straight-line',
  RECTANGLE = 'rectangle',
  CIRCLE = 'circle',
  ERASER = 'eraser',
  HAND = 'hand',
  ROOM = 'room',
  WALL = 'wall',
  TEXT = 'text',
  MEASURE = 'measure'
}

/**
 * Drawing tool type alias (for backwards compatibility)
 * @deprecated Use DrawingMode enum instead
 */
export type DrawingTool = DrawingMode;
