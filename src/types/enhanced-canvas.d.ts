
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';

declare module 'fabric' {
  interface Canvas extends FabricCanvas {
    isDrawingMode: boolean;
    selection: boolean;
    defaultCursor: string;
    hoverCursor: string;
    freeDrawingBrush: {
      color: string;
      width: number;
    };
    wrapperEl: HTMLElement;
    upperCanvasEl?: HTMLCanvasElement;
    getPointer(e: Event): { x: number; y: number };
    on(event: string, handler: Function): Canvas;
    off(event: string, handler: Function): Canvas;
    getElement(): HTMLCanvasElement;
    loadFromJSON(json: any, callback?: Function): Canvas;
    renderAll(): Canvas;
    requestRenderAll(): Canvas;
    getObjects(): FabricObject[];
    width: number;
    height: number;
    setWidth(value: number): Canvas;
    setHeight(value: number): Canvas;
    setDimensions?(options: { width: number; height: number }): Canvas;
    backgroundColor: string;
    contains(obj: FabricObject): boolean;
    add(...objects: FabricObject[]): Canvas;
    remove(...objects: FabricObject[]): Canvas;
    getWidth(): number;
    getHeight(): number;
  }
}
