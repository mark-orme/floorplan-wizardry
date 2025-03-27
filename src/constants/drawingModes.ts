
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
  Line = "line"
}

/**
 * Drawing tool type
 * String literal type for drawing tools
 */
export type DrawingTool = 'select' | 'draw' | 'wall' | 'room' | 'eraser' | 'text' | 'measure' | 'line';
