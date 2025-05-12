
/**
 * Enum of available drawing modes
 */
export enum DrawingMode {
  /** Selection tool for manipulating objects */
  SELECT = 'SELECT',
  
  /** Freehand drawing tool */
  DRAW = 'DRAW',
  
  /** Straight line drawing tool */
  LINE = 'LINE',
  
  /** Wall drawing tool */
  WALL = 'WALL',
  
  /** Room drawing tool */
  ROOM = 'ROOM',
  
  /** Hand tool for panning the canvas */
  HAND = 'HAND',
  
  /** Pan tool for moving the canvas view */
  PAN = 'PAN',
  
  /** Rectangle drawing tool */
  RECTANGLE = 'RECTANGLE',
  
  /** Circle drawing tool */
  CIRCLE = 'CIRCLE',
  
  /** Text insertion tool */
  TEXT = 'TEXT'
}

export default DrawingMode;
