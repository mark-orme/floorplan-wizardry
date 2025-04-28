
import { ExtendedFabricCanvas } from '@/types/canvas-types';
import { MutableRefObject } from 'react';

export interface CanvasDimensions {
  width: number;
  height: number;
}

export interface DebugInfoState {
  fps?: number;
  objects?: number;
  visible?: number;
  width?: number;
  height?: number;
  zoom?: number;
  isDrawingMode?: boolean;
  canvasReady?: boolean;
}

export interface CanvasResizingOptions {
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  preserveAspectRatio?: boolean;
  onResize?: (dimensions: CanvasDimensions) => void;
  onResizeComplete?: (dimensions: CanvasDimensions) => void;
  debounceDelay?: number;
}

export interface UseCanvasResizingProps {
  fabricCanvasRef: MutableRefObject<ExtendedFabricCanvas | null>;
  options?: CanvasResizingOptions;
  debugInfo?: MutableRefObject<DebugInfoState>;
}

/**
 * Canvas resizing state
 */
export interface ResizingState {
  isResizing: boolean;
  dimensions: CanvasDimensions;
  prevDimensions: CanvasDimensions | null;
}

/**
 * Canvas resizing result
 */
export interface CanvasResizingResult {
  isResizing: boolean;
  dimensions: CanvasDimensions;
  resize: (dimensions: Partial<CanvasDimensions>) => void;
}
