
import { Canvas } from 'fabric';

// Define extended fabric canvas type with required properties
export interface ExtendedFabricCanvas extends Canvas {
  wrapperEl: HTMLDivElement;
  initialize: () => void;
  skipTargetFind: boolean;
  _activeObject: any;
  _objects: any[];
  allowTouchScrolling?: boolean;
  skipOffscreen?: boolean;
  renderOnAddRemove?: boolean;
  fire?: (eventName: string, options?: any) => Canvas;
  isDrawingMode?: boolean;
  selection?: boolean;
  defaultCursor?: string;
  hoverCursor?: string;
  freeDrawingBrush?: {
    color: string;
    width: number;
  };
  getPointer?: (e: Event) => { x: number; y: number };
  on: (event: string, handler: (e: {target?: any}) => void) => Canvas;
  off: (event: string, handler: (e: {target?: any}) => void) => Canvas;
  renderAll: () => Canvas;
  requestRenderAll: () => Canvas;
  getObjects: () => any[];
  setWidth: (value: number) => Canvas;
  setHeight: (value: number) => Canvas;
  backgroundColor: string;
  contains: (obj: any) => boolean;
  add: (...objects: any[]) => Canvas;
  remove: (...objects: any[]) => Canvas;
  getWidth(): number;
  getHeight(): number;
  setZoom: (zoom: number) => Canvas;
  getZoom: () => number;
  dispose: () => void;
  discardActiveObject: (options?: any) => Canvas;
  getActiveObjects: () => any[];
  toJSON: (propertiesToInclude?: string[]) => any;
  clear: () => Canvas;
  sendToBack: (obj: any) => Canvas;
  getElement?: () => HTMLCanvasElement;
  loadFromJSON?: (json: any, callback?: () => void) => Canvas;
  bringForward?: (obj: any) => Canvas;
  bringToFront?: (obj: any) => Canvas;
}

/**
 * Helper to cast a standard Canvas to our extended type
 */
export const asExtendedCanvas = (canvas: Canvas): ExtendedFabricCanvas => {
  return canvas as ExtendedFabricCanvas;
};

/**
 * For backward compatibility with other type definitions
 */
export type ExtendedCanvas = ExtendedFabricCanvas;

/**
 * Helper to ensure interoperability between Canvas and ExtendedCanvas
 */
export const asCanvas = (extendedCanvas: ExtendedFabricCanvas): Canvas => {
  return extendedCanvas;
};

// Export fabric object interface
export interface ExtendedFabricObject {
  set: (options: Record<string, any>) => any;
  visible?: boolean;
  selectable?: boolean;
  evented?: boolean;
  left?: number;
  top?: number;
  width?: number;
  height?: number;
  [key: string]: any;
}
