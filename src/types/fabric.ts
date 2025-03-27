
/**
 * Types for Fabric.js integration
 * Provides proper typing for Canvas, events, and related components
 * @module types/fabric
 */
import { Canvas as FabricCanvas, Object as FabricObject, Point as FabricPoint } from "fabric";

/**
 * Custom touch event with force information (for pressure sensitivity)
 * Uses a custom interface instead of extending TouchEvent directly
 */
export interface CustomTouchEvent {
  /** Touch points with optional force information */
  touches: Array<Touch & { force?: number }>;
  /** Method to prevent default browser behavior */
  preventDefault: () => void;
  /** Method to stop event propagation */
  stopPropagation: () => void;
  /** Whether event can be canceled */
  cancelable?: boolean;
  /** Target element of the event */
  target: EventTarget | null;
}

/**
 * Custom fabric event containing touch information
 */
export interface CustomFabricTouchEvent {
  /** The touch event information */
  e: CustomTouchEvent;
}

/**
 * Grid dimensions type
 */
export interface GridDimensions {
  /** Width in pixels */
  width: number;
  /** Height in pixels */
  height: number;
}

/**
 * Canvas creation options
 */
export interface CanvasCreationOptions {
  /** Canvas width in pixels */
  width: number;
  /** Canvas height in pixels */
  height: number;
  /** Canvas background color */
  backgroundColor?: string;
  /** Whether to enable retina scaling */
  enableRetinaScaling?: boolean;
  /** Whether to stop context menu on right click */
  stopContextMenu?: boolean;
  /** Whether to fire right click events */
  fireRightClick?: boolean;
  /** Whether to render on adding/removing objects */
  renderOnAddRemove?: boolean;
  /** Whether to enable pointer events */
  enablePointerEvents?: boolean;
  /** Whether to skip target finding by default */
  skipTargetFind?: boolean;
  /** Whether to use per-pixel target finding */
  perPixelTargetFind?: boolean;
  /** Tolerance for target finding in pixels */
  targetFindTolerance?: number;
  /** Whether canvas is interactive */
  interactive?: boolean;
}

/**
 * Canvas references for initialization and management
 */
export interface CanvasReferences {
  /** Reference to HTML canvas element */
  canvasRef: React.RefObject<HTMLCanvasElement>;
  /** Reference to Fabric.js canvas instance */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Reference to history state for undo/redo */
  historyRef: React.MutableRefObject<{
    past: FabricObject[][];
    future: FabricObject[][];
  }>;
}

/**
 * Grid render components and result
 */
export interface GridRenderResult {
  /** All grid objects */
  gridObjects: FabricObject[];
  /** Small grid lines */
  smallGridLines: FabricObject[];
  /** Large grid lines */
  largeGridLines: FabricObject[];
  /** Grid markers (labels) */
  markers: FabricObject[];
}

/**
 * Touch position information
 */
export interface TouchPosition {
  /** X coordinate */
  x: number;
  /** Y coordinate */
  y: number;
  /** Optional pressure/force value */
  force?: number;
}

/**
 * Grid creation safety options
 */
export interface GridSafetyOptions {
  /** Maximum number of creation attempts */
  maxAttempts: number;
  /** Timeout duration in milliseconds */
  timeout: number;
}
