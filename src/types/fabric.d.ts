
// Extended fabric.js type definitions
import { Canvas as FabricCanvas, Object as FabricObject, Line, ILineOptions } from 'fabric';

declare module 'fabric' {
  // Export existing types more explicitly
  export { Canvas, Object, Line };
  
  interface IObjectOptions {
    objectType?: string;
    isGrid?: boolean;
    isLargeGrid?: boolean;
  }
  
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
    allowTouchScrolling: boolean;
    skipTargetFind: boolean;
    _activeObject: FabricObject | null;
    _objects: FabricObject[];
    initialize: Function;

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
    
    // For advanced features
    forEachObject(callback: (obj: FabricObject) => void): void;
    getContext(): CanvasRenderingContext2D;
  }
  
  interface Object {
    // Key properties
    visible: boolean;
    selectable: boolean;
    evented: boolean;
    
    // Methods
    set(options: Record<string, any>): FabricObject;
    setOptions(options: Record<string, any>): FabricObject;
    setCoords(): FabricObject;
    
    // For advanced features
    _controlsVisibility: Record<string, boolean>;
    controls: Record<string, any>;
    initialize: Function;
  }
}
