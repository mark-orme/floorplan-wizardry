
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
  skipTargetFind?: boolean;
  allowTouchScrolling?: boolean;
  skipOffscreen?: boolean;
  renderOnAddRemove?: boolean;
  viewportTransform: number[]; // Ensure this is non-optional
  isDrawingMode: boolean; // Ensure this is non-optional
}

export interface ExtendedFabricObject extends fabric.Object {
  evented?: boolean;
  id?: string;
  name?: string;
  layerId?: string;
  objectType?: string;
  isCustomObject?: boolean;
  isGridLine?: boolean;
  customProps?: Record<string, any>;
}

export function asExtendedObject(obj: fabric.Object): fabric.Object {
  return obj;
}

export function asExtendedCanvas(canvas: fabric.Canvas): ExtendedFabricCanvas {
  // Ensure viewportTransform is always an array
  if (!canvas.viewportTransform) {
    canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
  }
  
  // Ensure isDrawingMode is always defined
  if (canvas.isDrawingMode === undefined) {
    (canvas as any).isDrawingMode = false;
  }
  
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

// Add PIXELS_PER_METER constant for access in other files
export const CANVAS_CONSTANTS = {
  PIXELS_PER_METER: 100,
  DEFAULT_GRID_SIZE: 20
};
