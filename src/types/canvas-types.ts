
import { Object as FabricObject } from 'fabric';

/**
 * Extended Fabric Object with additional properties
 */
export interface ExtendedFabricObject extends FabricObject {
  set: (options: Record<string, any>) => FabricObject;
  visible?: boolean;
}

/**
 * Extended Fabric Canvas with additional properties
 */
export interface ExtendedFabricCanvas {
  wrapperEl: HTMLElement;
  initialize: () => void;
  skipTargetFind: boolean;
  _activeObject: any;
  _objects: any[];
  isDrawingMode?: boolean;
  selection?: boolean;
  defaultCursor?: string;
  hoverCursor?: string;
  freeDrawingBrush?: {
    color: string;
    width: number;
  };
  getPointer?: (e: Event) => { x: number; y: number };
  on: (event: string, handler: Function) => any;
  off: (event: string, handler: Function) => any;
  renderAll: () => any;
  requestRenderAll: () => any;
  getObjects: () => FabricObject[];
  width: number;
  height: number;
  setWidth: (value: number) => any;
  setHeight: (value: number) => any;
  backgroundColor: string;
  contains: (obj: FabricObject) => boolean;
  add: (...objects: FabricObject[]) => any;
  remove: (...objects: FabricObject[]) => any;
  getWidth: () => number;
  getHeight: () => number;
  setZoom: (zoom: number) => any;
  getZoom: () => number;
  dispose: () => void;
  discardActiveObject: (options?: any) => any;
  getActiveObjects: () => FabricObject[];
  toJSON: (propertiesToInclude?: string[]) => any;
  clear: () => any;
  sendToBack: (obj: FabricObject) => any;
  renderOnAddRemove?: boolean;
  fire?: (eventName: string, options?: any) => any;
}

export enum PropertyStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}
