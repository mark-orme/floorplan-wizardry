
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
  TEXT = 'TEXT',
  
  /** Pencil drawing tool - more precise than freehand */
  PENCIL = 'PENCIL',
  
  /** Eraser tool for removing objects */
  ERASER = 'ERASER',
  
  /** Alternate name for eraser */
  ERASE = 'ERASE',
  
  /** Straight line tool - similar to LINE but with constraints */
  STRAIGHT_LINE = 'STRAIGHT_LINE',
  
  /** Measurement tool for distances */
  MEASURE = 'MEASURE',
  
  /** Shape drawing tool - generic shape */
  SHAPE = 'SHAPE',
  
  /** Door insertion tool */
  DOOR = 'DOOR',
  
  /** Window insertion tool */
  WINDOW = 'WINDOW',
  
  /** Dimension tool for showing sizes */
  DIMENSION = 'DIMENSION',
  
  /** Stair drawing tool */
  STAIR = 'STAIR',
  
  /** Column drawing tool */
  COLUMN = 'COLUMN'
}

export default DrawingMode;
