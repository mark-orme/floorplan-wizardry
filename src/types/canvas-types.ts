
import { Canvas as FabricCanvas, Object as FabricObject, Line, ILineOptions } from "fabric";

/**
 * Extended Fabric canvas with additional properties
 */
export interface ExtendedFabricCanvas extends FabricCanvas {
  // Properties required by ExtendedCanvas
  wrapperEl: HTMLElement;
  initialize: () => void;
  skipTargetFind: boolean;
  _activeObject: any;
  _objects: any[];
  
  // Additional properties for virtualization
  skipOffscreen?: boolean;
  allowTouchScrolling?: boolean;
}

/**
 * Performance metrics for canvas
 */
export interface PerformanceMetrics {
  fps: number;
  renderTime: number;
  objectCount: number;
  visibleObjectCount?: number;
}

/**
 * Extended object interface
 */
export interface ExtendedFabricObject extends FabricObject {
  objectType?: string;
  id?: string;
  isGrid?: boolean;
  isLargeGrid?: boolean;
  visible?: boolean;
  selectable?: boolean;
  evented?: boolean;
  set: (options: Record<string, any>) => FabricObject;
}

/**
 * Extended line options
 */
export interface ExtendedLineOptions extends ILineOptions {
  isGrid?: boolean;
  isLargeGrid?: boolean;
  visible?: boolean;
  stroke?: string;
  strokeWidth?: number;
  selectable?: boolean;
  evented?: boolean;
}

/**
 * Helper function to safely cast canvas objects
 */
export function asExtendedCanvas(canvas: FabricCanvas): ExtendedFabricCanvas {
  return canvas as unknown as ExtendedFabricCanvas;
}

