
/**
 * Canvas resizing types
 * @module canvas-resizing/types
 */
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { CanvasDimensions, DebugInfoState } from "@/types/drawingTypes";

/**
 * Props for the useCanvasResizing hook
 * @interface UseCanvasResizingProps
 */
export interface UseCanvasResizingProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  setCanvasDimensions: React.Dispatch<React.SetStateAction<CanvasDimensions>>;
  setDebugInfo: React.Dispatch<React.SetStateAction<DebugInfoState>>;
  setHasError: (value: boolean) => void;
  setErrorMessage: (value: string) => void;
  createGrid: (canvas: FabricCanvas) => FabricObject[];
}

/**
 * Interface for tracking resizing state
 * @interface ResizingState
 */
export interface ResizingState {
  initialResizeComplete: boolean;
  resizeInProgress: boolean;
  lastResizeTime: number;
  minResizeInterval?: number;
  resizeTimeoutId?: number | null;
  requestId?: number | null;
}

/**
 * Return type for the useCanvasResizing hook
 * @interface CanvasResizingResult
 */
export interface CanvasResizingResult {
  updateCanvasDimensions: () => void;
  resetResizeState?: () => void;
  cancelResize?: () => void;
}

/**
 * Configuration options for canvas resizing
 * @interface ResizeConfig
 */
export interface ResizeConfig {
  debounceTime?: number;
  minDimensionChange?: number;
  maxUpdatesPerSecond?: number;
  safetyTimeout?: number;
}

/**
 * Resize event details
 * @interface ResizeEventDetails
 */
export interface ResizeEventDetails {
  oldDimensions: CanvasDimensions;
  newDimensions: CanvasDimensions;
  timestamp: number;
  success: boolean;
  error?: Error;
}
