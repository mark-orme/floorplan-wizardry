
/**
 * Fabric.js type definitions
 * @module core/Fabric
 */
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";

/**
 * Fabric canvas options interface
 */
export interface FabricCanvasOptions {
  width: number;
  height: number;
  backgroundColor?: string;
  selection?: boolean;
  isDrawingMode?: boolean;
  preserveObjectStacking?: boolean;
  skipTargetFind?: boolean;
  renderOnAddRemove?: boolean;
}

/**
 * Fabric object options interface
 */
export interface FabricObjectOptions {
  left?: number;
  top?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  selectable?: boolean;
  evented?: boolean;
  objectCaching?: boolean;
}

/**
 * Fabric line options interface
 */
export interface FabricLineOptions extends FabricObjectOptions {
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
}
