
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';

export interface ExtendedFabricObject extends FabricObject {
  visible?: boolean;
  selectable?: boolean;
  evented?: boolean;
  left?: number;
  top?: number;
  width?: number;
  height?: number;
  objectType?: string;
  gridType?: 'small' | 'large';
  [key: string]: any;
}

export interface ExtendedFabricCanvas extends FabricCanvas {
  wrapperEl: HTMLDivElement; // Using HTMLDivElement to match the expected type
  upperCanvasEl?: HTMLCanvasElement;
  skipOffscreen?: boolean;
  allowTouchScrolling?: boolean;
  initialize: () => void; // Making initialize required
  skipTargetFind?: boolean;
  renderOnAddRemove?: boolean;
  fire?: (eventName: string, options?: any) => FabricCanvas;
  on: (event: string, handler: (e: { target?: any }) => void) => FabricCanvas;
  off: (event: string, handler: (e: { target?: any }) => void) => FabricCanvas;
  renderAll: () => FabricCanvas;
  requestRenderAll: () => FabricCanvas;
  getObjects: () => any[];
  setWidth: (value: number) => FabricCanvas;
  setHeight: (value: number) => FabricCanvas;
  backgroundColor: string;
  contains: (obj: any) => boolean;
  add: (...objects: any[]) => FabricCanvas;
  remove: (...objects: any[]) => FabricCanvas;
  getWidth(): number;
  getHeight(): number;
  setZoom: (zoom: number) => FabricCanvas;
  getZoom: () => number;
  dispose: () => void;
  discardActiveObject: (options?: any) => FabricCanvas;
  getActiveObjects: () => any[];
  toJSON: (propertiesToInclude?: string[]) => any;
  clear: () => FabricCanvas;
  sendToBack: (obj: any) => FabricCanvas;
  getElement?: () => HTMLCanvasElement;
  loadFromJSON?: (json: any, callback?: () => void) => FabricCanvas;
  bringForward?: (obj: any) => FabricCanvas;
  bringToFront?: (obj: any) => FabricCanvas;
  _activeObject?: any;
  _objects?: any[];
}

// Update the FloorPlanMetadata interface to include the description field
export interface FloorPlanMetadata {
  level: number;
  name: string;
  created: string; 
  updated: string;
  description?: string; // Add description field
  updatedAt?: string;  // Add updatedAt field for backwards compatibility
}

export enum PropertyStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  PENDING_REVIEW = 'in_review', // Add missing status
  IN_REVIEW = 'in_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  COMPLETED = 'completed' // Add missing status
}

/**
 * Helper function to cast a Canvas to ExtendedFabricCanvas
 */
export function asExtendedCanvas(canvas: FabricCanvas): ExtendedFabricCanvas {
  return canvas as unknown as ExtendedFabricCanvas;
}

// For backwards compatibility
export type ExtendedCanvas = ExtendedFabricCanvas;
