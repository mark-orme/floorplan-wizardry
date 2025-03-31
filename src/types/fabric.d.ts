
import { Canvas as FabricCanvas } from 'fabric';

/**
 * Global extensions to provide Fabric.js integration with HTML elements
 */
declare global {
  /**
   * Extend HTMLCanvasElement to support Fabric.js integration
   */
  interface HTMLCanvasElement {
    /**
     * Reference to the associated Fabric.js canvas instance
     * Used internally by Fabric.js
     */
    _fabric?: FabricCanvas;
  }
  
  /**
   * Extend Window with Fabric.js canvas instance tracking
   */
  interface Window {
    /**
     * Array of all Fabric canvas instances in the document
     * Used for global canvas management and cleanup
     */
    fabricCanvasInstances?: FabricCanvas[];
  }
}

/**
 * Configuration options for creating a Fabric.js canvas
 */
export interface CanvasCreationOptions {
  /** Canvas width in pixels */
  width: number;
  /** Canvas height in pixels */
  height: number;
  /** Background color of the canvas */
  backgroundColor?: string;
  /** Whether objects can be selected by clicking on them */
  selection?: boolean;
  /** Whether canvas should re-render on object add/remove */
  renderOnAddRemove?: boolean;
  /** Whether to maintain object state during operations */
  stateful?: boolean;
  /** Whether to fire right-click events */
  fireRightClick?: boolean;
  /** Whether to stop context menu on right click */
  stopContextMenu?: boolean;
  /** Whether to enable retina scaling for high-DPI displays */
  enableRetinaScaling?: boolean;
  /** Whether to skip rendering objects that are off the canvas */
  skipOffscreen?: boolean;
}

/**
 * Centralized references to canvas elements and instances
 * Used to maintain consistent access throughout the application
 */
export interface CanvasReferences {
  /** Reference to the HTML canvas element */
  canvasRef: React.RefObject<HTMLCanvasElement>;
  /** Reference to the Fabric.js canvas instance */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Direct access to Fabric.js canvas instance */
  canvas?: FabricCanvas | null;
  /** Reference to HTML canvas element for direct DOM operations */
  canvasElement?: HTMLCanvasElement | null;
  /** Reference to the container element that holds the canvas */
  container?: HTMLElement | null;
}

/**
 * Configuration for grid dimensions and appearance
 */
export interface GridDimensions {
  /** Space between grid lines in pixels */
  spacing: number;
  /** Width of the grid in pixels */
  width: number;
  /** Height of the grid in pixels */
  height: number;
}

/**
 * Result of grid rendering operation
 */
export interface GridRenderResult {
  /** Array of grid line objects added to the canvas */
  gridObjects: any[];
  /** Whether grid objects were added to canvas */
  addToCanvas: boolean;
}

/**
 * Extended TouchEvent with additional properties
 */
export interface CustomTouchEvent extends TouchEvent {
  /** X-coordinate of touch point relative to client area */
  clientX?: number;
  /** Y-coordinate of touch point relative to client area */
  clientY?: number;
}

/**
 * Fabric-specific touch event format
 */
export interface CustomFabricTouchEvent {
  /** List of touch points */
  touches: TouchList;
  /** Original touch event */
  e?: TouchEvent;
}

/**
 * Fabric.js pointer event interface
 * Standardizes mouse and touch events
 */
export interface FabricPointerEvent {
  /** Original DOM event (MouseEvent or TouchEvent) */
  e: MouseEvent | TouchEvent;
  /** Current pointer coordinates relative to canvas */
  pointer: { x: number; y: number };
  /** Absolute pointer coordinates (accounting for canvas transform) */
  absolutePointer?: { x: number; y: number };
  /** Coordinates in the scene coordinate system (Fabric v6 nomenclature) */
  scenePoint?: { x: number; y: number };
  /** Coordinates in the viewport coordinate system (Fabric v6 nomenclature) */
  viewportPoint?: { x: number; y: number };
  /** Object under the pointer, if any */
  target?: any; 
  /** Whether this event represents a click */
  isClick?: boolean;
  /** Current subtargets for event bubbling */
  currentSubTargets?: any[];
}
