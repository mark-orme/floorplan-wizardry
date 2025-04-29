
import * as fabric from 'fabric';

// Augment fabric module with proper type inheritance
declare module 'fabric' {
  interface Line extends Object {}
}

export interface ExtendedFabricCanvas extends fabric.Canvas {
  wrapperEl: HTMLElement;
}

export interface ExtendedFabricObject extends fabric.Object {
  evented?: boolean;
}

export function asExtendedObject(obj: fabric.Object): fabric.Object {
  return obj;
}

export function asExtendedCanvas(canvas: fabric.Canvas): ExtendedFabricCanvas {
  return canvas as ExtendedFabricCanvas;
}

// Add CanvasState interface
export interface CanvasState {
  objects: fabric.Object[];
  background: string;
  width: number;
  height: number;
  zoom: number;
  zoomLevel: number;
  viewportTransform: number[];
  tool: string;
  gridVisible: boolean;
  snapToGrid: boolean;
  gridSize: number;
}

// Add FloorPlanMetadata interface
export interface FloorPlanMetadata {
  createdAt: string;
  updatedAt: string;
  paperSize?: string;
  level?: number;
  version?: string;
  author?: string;
  dateCreated?: string;
  lastModified?: string;
  notes?: string;
}
