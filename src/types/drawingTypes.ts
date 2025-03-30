
/**
 * Drawing tool enum
 * Defines all available tools for canvas drawing
 */
export enum DrawingTool {
  SELECT = "select",
  DRAW = "draw",
  WALL = "wall",
  ROOM = "room",
  MEASURE = "measure",
  TEXT = "text",
  ERASER = "eraser"
}

/**
 * Drawing tool type based on enum
 * String literal type for drawing tools
 */
export type DrawingToolType = `${DrawingTool}`;

/**
 * @deprecated Use DrawingTool from src/types/drawingTypes.ts instead
 * This is kept for backward compatibility
 */
export type DrawingMode = DrawingTool;

// For compatibility with existing code
export type ZoomDirection = "in" | "out";

/**
 * Drawing state interface
 * Contains the current state of drawing operations
 */
export interface DrawingState {
  isDrawing: boolean;
  currentPath: any | null;
  pathStartPoint: { x: number, y: number } | null;
  zoomLevel: number;
}
