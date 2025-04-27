
import { Canvas as FabricCanvas, Line, Object as FabricObject, ILineOptions } from "fabric";

export interface ExtendedFabricObject extends FabricObject {
  objectType?: string;
  id?: string;
  isGrid?: boolean;
  isLargeGrid?: boolean;
  visible?: boolean;
  selectable?: boolean;
  evented?: boolean;
  stroke?: string;
  strokeWidth?: number;
  set: (options: Record<string, any>) => FabricObject;
}

export interface ExtendedLineOptions extends ILineOptions {
  isGrid?: boolean;
  isLargeGrid?: boolean;
  visible?: boolean;
  stroke?: string;
  strokeWidth?: number;
  selectable?: boolean;
  evented?: boolean;
}

export function createFabricLine(
  points: number[], 
  options: ExtendedLineOptions = {}
): FabricObject {
  return new Line(points, options);
}

export interface ExtendedCanvas extends FabricCanvas {
  allowTouchScrolling?: boolean;
}

// Type alias for FabricCanvas to help with imports
export type FabricCanvas = FabricCanvas;
