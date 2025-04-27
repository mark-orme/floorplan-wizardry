
import { Canvas, Object as FabricObject, Line } from 'fabric';

// Extended Fabric.js types with additional methods
export interface ExtendedCanvas extends Canvas {
  initialize: Function;
  skipTargetFind?: boolean;
  _activeObject?: FabricObject | null;
  _objects: FabricObject[];
  allowTouchScrolling?: boolean;
}

export interface ExtendedFabricObject extends FabricObject {
  set(options: Record<string, any>): ExtendedFabricObject;
  setOptions(options: Record<string, any>): ExtendedFabricObject;
  setCoords(): ExtendedFabricObject;
  visible: boolean;
}

export const createFabricLine = (coords: number[], options?: any): Line => {
  return new Line(coords, {
    ...options,
    stroke: options?.stroke || '#e0e0e0',
    strokeWidth: options?.strokeWidth || 0.5,
    selectable: false,
    evented: false
  });
};
