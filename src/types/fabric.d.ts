
import { Canvas as FabricCanvasType, Object as FabricObject } from 'fabric';

declare global {
  interface Window {
    fabric: {
      Canvas: any;
      Point: any;
      Line: any;
      Object: any;
      Circle: any;
      Rect: any;
      Path: any;
      Group: any;
      Text: any;
      IText: any;
      Textbox: any;
    };
  }

  namespace fabric {
    interface Canvas extends FabricCanvasType {
      isDrawingMode: boolean;
      selection: boolean;
      defaultCursor: string;
      hoverCursor: string;
      freeDrawingBrush: {
        color: string;
        width: number;
      };
      getPointer(e: any): { x: number; y: number };
      getElement(): HTMLCanvasElement;
      loadFromJSON(json: string | Object, callback?: Function): void;
      toJSON(propertiesToInclude?: string[]): Object;
      getWidth(): number;
      getHeight(): number;
      setWidth(width: number): void;
      setHeight(height: number): void;
      add(...objects: FabricObject[]): Canvas;
      remove(...objects: FabricObject[]): Canvas;
      contains(object: FabricObject): boolean;
      getObjects(type?: string): FabricObject[];
      item(index: number): FabricObject;
      getActiveObjects(): FabricObject[];
      discardActiveObject(): Canvas;
      setZoom(zoom: number): Canvas;
      getZoom(): number;
      sendObjectToBack(object: FabricObject): Canvas;
      sendToBack(object: FabricObject): Canvas;
      renderAll(): void;
      requestRenderAll(): void;
      dispose(): void;
      on(eventName: string, handler: Function): void;
      off(eventName: string, handler: Function): void;
      fire(eventName: string, options?: any): void;
      withImplementation(callback?: Function): Promise<void>;
    }
    
    interface Object extends FabricObject {
      id?: string;
      gridObject?: boolean;
      selectable: boolean;
      evented?: boolean;
      visible?: boolean;
      set(key: string | object, value?: any): Object;
    }

    interface Line extends Object {
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      stroke: string;
      strokeWidth: number;
    }

    interface Circle extends Object {
      radius: number;
      fill: string;
      stroke: string;
      strokeWidth: number;
    }

    interface Rect extends Object {
      width: number;
      height: number;
      fill: string;
      stroke: string;
      strokeWidth: number;
    }

    interface Path extends Object {
      path: any[];
      stroke: string;
      strokeWidth: number;
    }
  }
}

export {};
