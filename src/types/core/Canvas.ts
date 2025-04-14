
/**
 * Canvas type definitions
 * Provides type safety for canvas-related operations
 */

import { Canvas as FabricCanvas } from 'fabric';

/**
 * Extended canvas options interface
 */
export interface CanvasOptions {
  /** Width of the canvas */
  width: number;
  /** Height of the canvas */
  height: number;
  /** Background color */
  backgroundColor?: string;
  /** Whether to include the background in exports */
  includeDefaultValues?: boolean;
  /** Whether to enable selection */
  selection?: boolean;
  /** Whether the canvas should be interactive */
  interactive?: boolean;
  /** Whether to use the retina resolution */
  enableRetinaScaling?: boolean;
  /** Whether to preserve object stacking order */
  preserveObjectStacking?: boolean;
}

/**
 * Canvas state interface
 */
export interface CanvasState {
  /** Canvas instance */
  canvas: FabricCanvas | null;
  /** Whether the canvas is ready */
  isReady: boolean;
  /** Whether the canvas is in drawing mode */
  isDrawing: boolean;
  /** Canvas dimensions */
  dimensions: {
    width: number;
    height: number;
  };
  /** Canvas zoom level */
  zoom: number;
  /** Canvas pan position */
  pan: {
    x: number;
    y: number;
  };
}

/**
 * Canvas context interface
 */
export interface CanvasContextType {
  /** Canvas instance */
  canvas: FabricCanvas | null;
  /** Set canvas instance */
  setCanvas: (canvas: FabricCanvas | null) => void;
  /** Canvas state */
  canvasState: CanvasState;
  /** Canvas operations */
  operations: {
    /** Clear the canvas */
    clear: () => void;
    /** Zoom the canvas */
    zoom: (factor: number) => void;
    /** Pan the canvas */
    pan: (x: number, y: number) => void;
    /** Reset the canvas view */
    resetView: () => void;
  };
}
