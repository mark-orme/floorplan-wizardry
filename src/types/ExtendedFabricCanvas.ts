import { Canvas, IEvent } from 'fabric';

/**
 * Extended fabric canvas type with additional properties 
 */
export interface ExtendedFabricCanvas extends Canvas {
  wrapperEl: HTMLDivElement;
  skipTargetFind: boolean;
  allowTouchScrolling?: boolean;
  skipOffscreen?: boolean;
  renderOnAddRemove?: boolean;
  fire?: (eventName: string, options?: any) => Canvas;
  on: (event: string, handler: (e: IEvent<any>) => void) => Canvas;
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

export type { ExtendedFabricObject } from '@/types/canvas-types';
