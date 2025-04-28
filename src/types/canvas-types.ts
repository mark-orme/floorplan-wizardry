
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';

/**
 * Extended Fabric Object with additional properties
 */
export interface ExtendedFabricObject extends FabricObject {
  set: (options: Record<string, any>) => FabricObject;
  visible?: boolean;
  selectable?: boolean;
  evented?: boolean;
  objectType?: string;
  gridType?: 'small' | 'large';
}

/**
 * Extended Fabric Canvas with required properties
 */
export interface ExtendedFabricCanvas extends FabricCanvas {
  wrapperEl: HTMLElement;
  upperCanvasEl?: HTMLCanvasElement;
  skipOffscreen?: boolean;
  allowTouchScrolling?: boolean;
  renderOnAddRemove?: boolean;
  initialize?: () => void;
  skipTargetFind?: boolean;
  _activeObject?: any;
  _objects?: any[];
  fire?: (eventName: string, options?: any) => FabricCanvas;
  isDrawingMode?: boolean;
  selection?: boolean;
  defaultCursor?: string;
  hoverCursor?: string;
  freeDrawingBrush?: {
    color: string;
    width: number;
  };
  getPointer?: (e: Event) => { x: number; y: number };
  on: (event: string, handler: (e: {target?: any}) => void) => FabricCanvas;
  off: (event: string, handler: (e: {target?: any}) => void) => FabricCanvas;
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
}

export enum PropertyStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
  PENDING_REVIEW = 'pending_review',
  COMPLETED = 'completed'
}

export type FloorPlanMetadata = {
  id: string;
  name: string;
  created: string;
  modified: string;
  status: PropertyStatus;
  description?: string;  // Adding missing property
  updatedAt?: string;    // Adding missing property
};

/**
 * Helper to cast a standard Canvas to our extended type
 */
export const asExtendedCanvas = (canvas: any): ExtendedFabricCanvas => {
  return canvas as ExtendedFabricCanvas;
};
