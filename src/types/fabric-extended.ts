
import { Canvas as FabricCanvas, Line, Object as FabricObject, ILineOptions } from "fabric";

export interface ExtendedFabricObject extends FabricObject {
  objectType?: string;
  id?: string;
  isGrid?: boolean;
  isLargeGrid?: boolean;
}

export interface ExtendedLineOptions extends ILineOptions {
  isGrid?: boolean;
  isLargeGrid?: boolean;
  visible?: boolean;
}

export function createFabricLine(
  points: number[], 
  options: ExtendedLineOptions = {}
): FabricObject {
  // Create a line using the provided points [x1, y1, x2, y2]
  return new Line(points, options);
}

export interface ExtendedCanvas extends FabricCanvas {
  allowTouchScrolling?: boolean;
}
