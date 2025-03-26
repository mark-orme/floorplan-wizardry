
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
}

/**
 * Return type for the useCanvasResizing hook
 * @interface CanvasResizingResult
 */
export interface CanvasResizingResult {
  updateCanvasDimensions: () => void;
}
