
/**
 * Drawing tool type definitions
 * @module types/core/DrawingTool
 */
import { DrawingMode } from "@/constants/drawingModes";

/**
 * DrawingTool type alias for DrawingMode
 * Represents the current drawing tool
 */
export type DrawingTool = DrawingMode;

/**
 * Tool operation interface
 * Represents a drawing tool operation
 */
export interface ToolOperation {
  /** Tool identifier */
  tool: DrawingTool;
  /** Start drawing at a point */
  startDrawing: (x: number, y: number) => void;
  /** Continue drawing to a point */
  continueDrawing: (x: number, y: number) => void;
  /** End drawing at a point */
  endDrawing: (x: number, y: number) => void;
  /** Cancel the current drawing */
  cancelDrawing: () => void;
}

/**
 * Tool configuration interface
 * Represents configuration options for a drawing tool
 */
export interface ToolConfig {
  /** Line color */
  lineColor: string;
  /** Line thickness */
  lineThickness: number;
  /** Fill color (for shapes) */
  fillColor?: string;
  /** Whether shape is filled */
  filled?: boolean;
  /** Whether snapping to grid is enabled */
  snapToGrid?: boolean;
  /** Whether straightening is enabled */
  straighten?: boolean;
}
