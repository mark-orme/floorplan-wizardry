
/**
 * Drawing modes and tools constants
 * @module constants/drawingModes
 */

/**
 * Drawing mode enum
 * Defines available drawing modes for the application
 */
export enum DrawingMode {
  Free = "free",
  Wall = "wall",
  Room = "room",
  Eraser = "eraser",
  Select = "select",
  Measure = "measure",
  Text = "text",
  Line = "line",
  Hand = "hand",
  StraightLine = "straightLine",
  Draw = "draw"
}

/**
 * Drawing tool type
 * String literal type for drawing tools
 */
export type DrawingTool = 'select' | 'draw' | 'wall' | 'room' | 'eraser' | 'text' | 'measure' | 'line' | 'hand' | 'straightLine';

/**
 * Array of all drawing tool values
 * Useful for validation and iteration
 */
export const DRAWING_TOOLS: DrawingTool[] = [
  'select', 'draw', 'wall', 'room', 'eraser', 'text', 'measure', 'line', 'hand', 'straightLine'
];
