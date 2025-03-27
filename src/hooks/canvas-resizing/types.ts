
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
  /** Reference to the HTML canvas element */
  canvasRef: React.RefObject<HTMLCanvasElement>;
  /** Reference to the Fabric canvas instance */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Function to update canvas dimensions state */
  setCanvasDimensions: React.Dispatch<React.SetStateAction<CanvasDimensions>>;
  /** Function to update debug information state */
  setDebugInfo: React.Dispatch<React.SetStateAction<DebugInfoState>>;
  /** Function to set error state */
  setHasError: (value: boolean) => void;
  /** Function to set error message */
  setErrorMessage: (value: string) => void;
  /** Function to create grid objects on the canvas */
  createGrid: (canvas: FabricCanvas) => FabricObject[];
}

/**
 * Interface for tracking resizing state
 * @interface ResizingState
 */
export interface ResizingState {
  /** Whether initial resize has completed */
  initialResizeComplete: boolean;
  /** Whether resize is currently in progress */
  resizeInProgress: boolean;
  /** Timestamp of last resize operation */
  lastResizeTime: number;
  /** Minimum time between resize operations in milliseconds */
  minResizeInterval?: number;
  /** ID of the current resize timeout */
  resizeTimeoutId?: number | null;
  /** ID of the current animation frame request */
  requestId?: number | null;
}

/**
 * Return type for the useCanvasResizing hook
 * @interface CanvasResizingResult
 */
export interface CanvasResizingResult {
  /** Function to trigger canvas dimension update */
  updateCanvasDimensions: () => void;
  /** Function to reset resize state */
  resetResizeState?: () => void;
  /** Function to cancel current resize operation */
  cancelResize?: () => void;
}

/**
 * Configuration options for canvas resizing
 * @interface ResizeConfig
 */
export interface ResizeConfig {
  /** Debounce time in milliseconds */
  debounceTime?: number;
  /** Minimum dimension change in pixels to trigger resize */
  minDimensionChange?: number;
  /** Maximum number of updates per second */
  maxUpdatesPerSecond?: number;
  /** Timeout in milliseconds for safety cancelation */
  safetyTimeout?: number;
}

/**
 * Resize event details
 * @interface ResizeEventDetails
 */
export interface ResizeEventDetails {
  /** Canvas dimensions before resize */
  oldDimensions: CanvasDimensions;
  /** Canvas dimensions after resize */
  newDimensions: CanvasDimensions;
  /** Timestamp of the resize event */
  timestamp: number;
  /** Whether the resize operation completed successfully */
  success: boolean;
  /** Error details if resize failed */
  error?: Error;
}
