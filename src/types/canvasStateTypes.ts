
import { DrawingMode } from "@/constants/drawingModes";

/**
 * DrawingTool type definition
 * Uses DrawingMode enum for consistency across the application
 */
export type DrawingTool = DrawingMode;

/**
 * Canvas state interface
 * Defines the shape of the canvas state used across the application
 */
export interface CanvasState {
  tool: DrawingTool;
  zoomLevel: number;
  lineThickness: number;
  lineColor: string;
  snapToGrid: boolean;
}

/**
 * Default canvas state values
 * Provides initial values for canvas state properties
 */
export const DEFAULT_CANVAS_STATE: CanvasState = {
  tool: DrawingMode.SELECT,
  zoomLevel: 1,
  lineThickness: 2,
  lineColor: "#000000",
  snapToGrid: true
};

/**
 * Interface for the result of useCanvasState hook
 */
export interface UseCanvasStateResult {
  canvas: null | any;
  setCanvas: React.Dispatch<React.SetStateAction<null | any>>;
  showGridDebug: boolean;
  setShowGridDebug: React.Dispatch<React.SetStateAction<boolean>>;
  forceRefreshKey: number;
  setForceRefreshKey: React.Dispatch<React.SetStateAction<number>>;
  activeTool: DrawingTool;
  setActiveTool: React.Dispatch<React.SetStateAction<DrawingTool>>;
  lineThickness: number;
  setLineThickness: React.Dispatch<React.SetStateAction<number>>;
  lineColor: string;
  setLineColor: React.Dispatch<React.SetStateAction<string>>;
  gridInitializedRef: React.MutableRefObject<boolean>;
  retryCountRef: React.MutableRefObject<number>;
  maxRetries: number;
  canvasStableRef: React.MutableRefObject<boolean>;
  mountedRef: React.MutableRefObject<boolean>;
}
