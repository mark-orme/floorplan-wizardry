
/**
 * Drawing types module
 * @module types/drawingTypes
 */
import { DrawingMode } from "@/constants/drawingModes";
import { Point } from "@/types/core/Geometry";

/**
 * Drawing state interface
 */
export interface DrawingState {
  isDrawing: boolean;
  pathStartPoint: Point | null;
  startPoint: Point | null;
  currentPoint: Point | null;
  points: Point[];
  isEnabled: boolean;
}

/**
 * Create a default drawing state
 */
export const createDefaultDrawingState = (): DrawingState => ({
  isDrawing: false,
  pathStartPoint: null,
  startPoint: null,
  currentPoint: null,
  points: [],
  isEnabled: true
});

/**
 * Drawing mode map type
 */
export type DrawingModeMap = {
  [key in DrawingMode]: boolean;
};

/**
 * Zoom direction type
 */
export type ZoomDirection = "in" | "out";

/**
 * Drawing path interface
 */
export interface DrawingPath {
  id: string;
  points: Point[];
  color: string;
  width: number;
  tool: DrawingMode;
}

/**
 * Path segment interface
 */
export interface PathSegment {
  start: Point;
  end: Point;
  length: number;
}

/**
 * Performance statistics interface
 */
export interface PerformanceStats {
  fps: number;
  frameTime: number;
  maxFrameTime: number;
  droppedFrames: number;
  longFrames: number;
  errorCount?: number;
  retryCount?: number;
}

/**
 * Distance tool state interface
 */
export interface DistanceToolState {
  isActive: boolean;
  startPoint: Point | null;
  endPoint: Point | null;
  distance: number | null;
  angle: number | null;
}

// Using proper export type syntax
export type { Point };
