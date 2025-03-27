
/**
 * Types for Fabric.js integration
 * Provides proper typing for Canvas, events, and related components
 * @module types/fabric
 */
import { Canvas as FabricCanvas, Object as FabricObject, Point as FabricPoint } from "fabric";

/**
 * Custom touch event with force information (for pressure sensitivity)
 * Uses a custom interface to extend TouchEvent while preserving type safety
 */
export interface CustomTouchEvent {
  touches: (Touch & { force?: number })[];
  preventDefault: () => void;
  stopPropagation: () => void;
  cancelable?: boolean;
  target: EventTarget | null;
}

/**
 * Custom fabric event containing touch information
 */
export interface CustomFabricTouchEvent {
  e: CustomTouchEvent;
}

/**
 * Grid dimensions type
 */
export interface GridDimensions {
  width: number;
  height: number;
}

/**
 * Canvas creation options
 */
export interface CanvasCreationOptions {
  width: number;
  height: number;
  backgroundColor?: string;
  enableRetinaScaling?: boolean;
  stopContextMenu?: boolean;
  fireRightClick?: boolean;
  renderOnAddRemove?: boolean;
  enablePointerEvents?: boolean;
  skipTargetFind?: boolean;
  perPixelTargetFind?: boolean;
  targetFindTolerance?: number;
  interactive?: boolean;
}

/**
 * Canvas references for initialization and management
 */
export interface CanvasReferences {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  historyRef: React.MutableRefObject<{
    past: FabricObject[][];
    future: FabricObject[][];
  }>;
}

/**
 * Grid render components and result
 */
export interface GridRenderResult {
  gridObjects: FabricObject[];
  smallGridLines: FabricObject[];
  largeGridLines: FabricObject[];
  markers: FabricObject[];
}

/**
 * Touch position information
 */
export interface TouchPosition {
  x: number;
  y: number;
  force?: number;
}

/**
 * Grid creation safety options
 */
export interface GridSafetyOptions {
  maxAttempts: number;
  timeout: number;
}
