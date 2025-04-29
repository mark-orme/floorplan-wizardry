
import * as fabric from 'fabric';

// Augment fabric module with proper type inheritance
declare module 'fabric' {
  interface Line extends Object {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  }
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

// Updated FloorPlanMetadata interface to include all required properties
export interface FloorPlanMetadata {
  createdAt: string;
  updatedAt: string;
  name?: string;
  description?: string;
  updated?: string;
  modified?: string;
  paperSize?: string;
  level?: number;
  version?: string;
  author?: string;
  dateCreated?: string;
  lastModified?: string;
  notes?: string;
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
