
/**
 * Drawing modes and tools constants
 * @module constants/drawingModes
 */

/**
 * Available drawing modes
 * @enum {string}
 */
export enum DrawingMode {
  /** Free drawing mode */
  DRAW = 'draw',
  /** Selection mode */
  SELECT = 'select',
  /** Line drawing mode */
  LINE = 'line',
  /** Rectangle drawing mode */
  RECTANGLE = 'rectangle',
  /** Circle drawing mode */
  CIRCLE = 'circle',
  /** Wall drawing mode */
  WALL = 'wall',
  /** Room creation mode */
  ROOM = 'room',
  /** Measurement mode */
  MEASURE = 'measure',
  /** Text annotation mode */
  TEXT = 'text',
  /** Eraser mode */
  ERASER = 'eraser',
  /** Straight line drawing mode */
  STRAIGHT_LINE = 'straightLine',
  /** Hand (pan) mode */
  HAND = 'hand'
}

/**
 * Available drawing tools
 * Defined as union of DrawingMode enum values to ensure type safety
 * @type {string}
 */
export type DrawingTool = DrawingMode.SELECT | DrawingMode.DRAW | DrawingMode.LINE | 
  DrawingMode.RECTANGLE | DrawingMode.CIRCLE | DrawingMode.WALL | DrawingMode.ROOM | 
  DrawingMode.MEASURE | DrawingMode.TEXT | DrawingMode.ERASER | DrawingMode.STRAIGHT_LINE | 
  DrawingMode.HAND;

/**
 * Tool display information
 * @interface ToolInfo
 */
export interface ToolInfo {
  /** Tool identifier */
  id: DrawingTool;
  /** Display name */
  name: string;
  /** Tool description */
  description: string;
  /** Icon name */
  icon: string;
}

/**
 * Available drawing tools with display information
 * @constant {ToolInfo[]}
 */
export const DRAWING_TOOLS: ToolInfo[] = [
  {
    id: DrawingMode.SELECT,
    name: 'Select',
    description: 'Select and modify objects',
    icon: 'cursor'
  },
  {
    id: DrawingMode.DRAW,
    name: 'Draw',
    description: 'Free-hand drawing',
    icon: 'pencil'
  },
  {
    id: DrawingMode.LINE,
    name: 'Line',
    description: 'Draw straight lines',
    icon: 'minus'
  },
  {
    id: DrawingMode.STRAIGHT_LINE,
    name: 'Straight Line',
    description: 'Draw precise straight lines',
    icon: 'minus'
  },
  {
    id: DrawingMode.RECTANGLE,
    name: 'Rectangle',
    description: 'Draw rectangles',
    icon: 'square'
  },
  {
    id: DrawingMode.CIRCLE,
    name: 'Circle',
    description: 'Draw circles',
    icon: 'circle'
  },
  {
    id: DrawingMode.WALL,
    name: 'Wall',
    description: 'Draw walls with thickness',
    icon: 'square'
  },
  {
    id: DrawingMode.ROOM,
    name: 'Room',
    description: 'Create enclosed rooms',
    icon: 'layout'
  },
  {
    id: DrawingMode.HAND,
    name: 'Hand',
    description: 'Pan the canvas',
    icon: 'hand'
  },
  {
    id: DrawingMode.MEASURE,
    name: 'Measure',
    description: 'Measure distances',
    icon: 'ruler'
  },
  {
    id: DrawingMode.TEXT,
    name: 'Text',
    description: 'Add text annotations',
    icon: 'type'
  },
  {
    id: DrawingMode.ERASER,
    name: 'Eraser',
    description: 'Erase objects',
    icon: 'eraser'
  }
];
