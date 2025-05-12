
import { fabric } from 'fabric';
import { Object as FabricObject } from 'fabric';

/**
 * Create a group of fabric objects
 */
export function createGroup(objects: FabricObject[], options?: any): fabric.Group {
  return new fabric.Group(objects, options);
}

/**
 * Create a path from SVG path data
 */
export function createPath(pathData: string, options?: any): fabric.Path {
  return new fabric.Path(pathData, options);
}

/**
 * Check if an object is a fabric Group
 */
export function isGroup(object: FabricObject): object is fabric.Group {
  return object instanceof fabric.Group;
}

/**
 * Check if an object is a fabric Path
 */
export function isPath(object: FabricObject): object is fabric.Path {
  return object instanceof fabric.Path;
}

/**
 * Additional fabric component helpers
 */
export const FabricComponents = {
  createRect: (options?: any) => new fabric.Rect(options),
  createCircle: (options?: any) => new fabric.Circle(options),
  createLine: (points: number[], options?: any) => new fabric.Line(points, options),
  createText: (text: string, options?: any) => new fabric.Text(text, options),
  createImage: (imgElement: HTMLImageElement, options?: any) => new fabric.Image(imgElement, options),
};

export default FabricComponents;
