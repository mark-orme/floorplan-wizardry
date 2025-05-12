
import { fabric } from 'fabric';

/**
 * Simplified FabricComponents utility
 * Provides helper functions for common Fabric.js operations
 */

/**
 * Create a group of fabric objects
 */
export function createGroup(objects: fabric.Object[], options?: fabric.IObjectOptions): fabric.Group {
  return new fabric.Group(objects, options);
}

/**
 * Create a path from SVG path data
 */
export function createPath(pathData: string, options?: fabric.IPathOptions): fabric.Path {
  return new fabric.Path(pathData, options);
}

/**
 * Check if an object is a fabric Group
 */
export function isGroup(object: fabric.Object): boolean {
  return object instanceof fabric.Group;
}

/**
 * Check if an object is a fabric Path
 */
export function isPath(object: fabric.Object): boolean {
  return object instanceof fabric.Path;
}

/**
 * Additional fabric component helpers
 */
export const FabricComponents = {
  createRect: (options?: fabric.IRectOptions) => new fabric.Rect(options),
  createCircle: (options?: fabric.ICircleOptions) => new fabric.Circle(options),
  createLine: (points: number[], options?: fabric.ILineOptions) => new fabric.Line(points, options),
  createText: (text: string, options?: fabric.ITextOptions) => new fabric.Text(text, options),
  createImage: (imgElement: HTMLImageElement, options?: fabric.IImageOptions) => new fabric.Image(imgElement, options),
};

export default FabricComponents;
