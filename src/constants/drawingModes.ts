
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
  ERASER = 'eraser'
}

/**
 * Available drawing tools
 * @type {string}
 */
export type DrawingTool = 'select' | 'draw' | 'line' | 'rectangle' | 'circle' | 'wall' | 'room' | 'measure' | 'text' | 'eraser';

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
    id: 'select',
    name: 'Select',
    description: 'Select and modify objects',
    icon: 'cursor'
  },
  {
    id: 'draw',
    name: 'Draw',
    description: 'Free-hand drawing',
    icon: 'pencil'
  },
  {
    id: 'line',
    name: 'Line',
    description: 'Draw straight lines',
    icon: 'minus'
  },
  {
    id: 'rectangle',
    name: 'Rectangle',
    description: 'Draw rectangles',
    icon: 'square'
  },
  {
    id: 'circle',
    name: 'Circle',
    description: 'Draw circles',
    icon: 'circle'
  },
  {
    id: 'wall',
    name: 'Wall',
    description: 'Draw walls with thickness',
    icon: 'square'
  },
  {
    id: 'room',
    name: 'Room',
    description: 'Create enclosed rooms',
    icon: 'layout'
  },
  {
    id: 'measure',
    name: 'Measure',
    description: 'Measure distances',
    icon: 'ruler'
  },
  {
    id: 'text',
    name: 'Text',
    description: 'Add text annotations',
    icon: 'type'
  },
  {
    id: 'eraser',
    name: 'Eraser',
    description: 'Erase objects',
    icon: 'eraser'
  }
];
