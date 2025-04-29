// Add missing window property types
interface Window {
  __app_state?: Record<string, unknown>;
  __canvas_state?: Record<string, unknown>;
}

import 'fabric';

// Augment Fabric to ensure it has all the properties we need
declare module 'fabric' {
  interface Canvas {
    /** The DIV wrapper for sizing/DOM events */
    wrapperEl: HTMLDivElement;
    /** Optional helpers your hooks use */
    renderOnAddRemove?: boolean;
    allowTouchScrolling?: boolean;
    skipOffscreen?: boolean;
    skipTargetFind?: boolean;
    forEachObject(callback: (obj: any) => void): void;
    viewportTransform?: number[];
    getActiveObject(): any;
    zoomToPoint(point: { x: number, y: number }, value: number): void;
    setViewportTransform?(transform: number[]): Canvas;
    
    // Additional methods from @types/fabric
    add(...objects: any[]): Canvas;
    remove(...objects: any[]): Canvas;
    getObjects(): any[];
    getWidth(): number;
    getHeight(): number;
    setWidth(width: number): Canvas;
    setHeight(height: number): Canvas;
    renderAll(): Canvas;
    requestRenderAll(): Canvas;
    getActiveObjects(): any[];
    discardActiveObject(options?: any): Canvas;
    contains(object: any): boolean;
    getPointer(e: Event): { x: number; y: number };
    getElement(): HTMLCanvasElement;
    loadFromJSON(json: any, callback?: Function, reviverOptions?: any): Canvas;
    toJSON(propertiesToInclude?: string[]): any;
    setZoom(zoom: number): Canvas;
    getZoom(): number;
    sendToBack(object: any): Canvas;
    sendObjectToBack(object: any): Canvas;
    on(eventName: string, handler: Function): Canvas;
    off(eventName: string, handler?: Function): Canvas;
    fire(eventName: string, options?: any): Canvas;
    dispose(): void;
    clear(): Canvas;
    freeDrawingBrush: {
      color: string;
      width: number;
    };
    isDrawingMode: boolean;
    selection: boolean;
    defaultCursor: string;
    hoverCursor: string;
  }

  interface Object {
    id?: string;
    objectType?: string;
    visible?: boolean;
    selectable?: boolean;
    evented?: boolean;
    type: string;
    left: number;
    top: number;
    width: number;
    height: number;
    set(options: Record<string, any>): Object;
    setCoords(): Object;
  }
}

// Add fabric namespace
declare namespace fabric {
  export class Canvas {
    constructor(element: string | HTMLCanvasElement, options?: any);
    /** The DIV wrapper for sizing/DOM events */
    wrapperEl: HTMLDivElement;
    /** Optional helpers your hooks use */
    renderOnAddRemove?: boolean;
    allowTouchScrolling?: boolean;
    skipOffscreen?: boolean;
    skipTargetFind?: boolean;
    forEachObject(callback: (obj: any) => void): void;
    viewportTransform?: number[];
    getActiveObject(): any;
    zoomToPoint(point: { x: number, y: number }, value: number): void;
    
    // Additional methods from @types/fabric
    add(...objects: any[]): Canvas;
    remove(...objects: any[]): Canvas;
    getObjects(): any[];
    getWidth(): number;
    getHeight(): number;
    setWidth(width: number): Canvas;
    setHeight(height: number): Canvas;
    renderAll(): Canvas;
    requestRenderAll(): Canvas;
    getActiveObjects(): any[];
    discardActiveObject(options?: any): Canvas;
    contains(object: any): boolean;
    getPointer(e: Event): { x: number; y: number };
    getElement(): HTMLCanvasElement;
    loadFromJSON(json: any, callback?: Function, reviverOptions?: any): Canvas;
    toJSON(propertiesToInclude?: string[]): any;
    setZoom(zoom: number): Canvas;
    getZoom(): number;
    sendToBack(object: any): Canvas;
    sendObjectToBack(object: any): Canvas;
    on(eventName: string, handler: Function): Canvas;
    off(eventName: string, handler?: Function): Canvas;
    fire(eventName: string, options?: any): Canvas;
    dispose(): void;
    clear(): Canvas;
    freeDrawingBrush: {
      color: string;
      width: number;
    };
    isDrawingMode: boolean;
    selection: boolean;
    defaultCursor: string;
    hoverCursor: string;
  }

  export class ActiveSelection {
    constructor(objects: any[], options?: any);
    forEachObject(callback: (obj: any) => void): void;
  }

  export class Point {
    x: number;
    y: number;
    constructor(x: number, y: number);
  }

  export class Object {
    type: string;
    id?: string;
    objectType?: string;
    visible?: boolean;
    selectable?: boolean;
    evented?: boolean;
    set(options: Record<string, any>): Object;
    setCoords(): Object;
  }

  export class Line extends Object {
    constructor(points: number[], options?: any);
    set(options: Record<string, any>): Line;
  }
}
