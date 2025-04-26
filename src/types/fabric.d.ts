
// Extended fabric.js type definitions
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';

declare module 'fabric' {
  interface Canvas {
    // Properties
    isDrawingMode: boolean;
    selection: boolean;
    defaultCursor: string;
    hoverCursor: string;
    freeDrawingBrush: {
      color: string;
      width: number;
    };
    wrapperEl: HTMLElement;
    width: number;
    height: number;

    // Methods
    add(...objects: FabricObject[]): Canvas;
    remove(...objects: FabricObject[]): Canvas;
    getObjects(): FabricObject[];
    getWidth(): number;
    getHeight(): number;
    setWidth(width: number): Canvas;
    setHeight(height: number): Canvas;
    renderAll(): Canvas;
    requestRenderAll(): Canvas;
    getActiveObjects(): FabricObject[];
    discardActiveObject(options?: any): Canvas;
    contains(object: FabricObject): boolean;
    getPointer(e: Event): { x: number; y: number };
    getElement(): HTMLCanvasElement;
    loadFromJSON(json: any, callback?: Function, reviverOptions?: any): Canvas;
    toJSON(propertiesToInclude?: string[]): any;
    setZoom(zoom: number): Canvas;
    getZoom(): number;
    sendToBack(object: FabricObject): Canvas;
    sendObjectToBack(object: FabricObject): Canvas;
    on(eventName: string, handler: Function): Canvas;
    off(eventName: string, handler?: Function): Canvas;
    fire(eventName: string, options?: any): Canvas;
    dispose(): void;
    clear(): Canvas;
  }
}
