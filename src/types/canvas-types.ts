
import * as fabric from 'fabric';

// Augment fabric module with proper type inheritance
declare module 'fabric' {
  interface Line extends Object {}
}

export interface ExtendedFabricCanvas extends fabric.Canvas {
  wrapperEl: HTMLElement;
}

export function asExtendedObject(obj: fabric.Object): fabric.Object {
  return obj;
}

export function asExtendedCanvas(canvas: fabric.Canvas): ExtendedFabricCanvas {
  return canvas as ExtendedFabricCanvas;
}
