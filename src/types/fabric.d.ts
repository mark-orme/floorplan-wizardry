
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
    wrapperEl: HTMLDivElement;
    width: number;
    height: number;
    allowTouchScrolling: boolean;
    skipTargetFind: boolean;
    renderOnAddRemove: boolean;
    
    // Methods
    initialize: (element: string | HTMLCanvasElement, options?: any) => Canvas;
    forEachObject(callback: (obj: FabricObject) => void): void;
    viewportTransform?: number[];
    getActiveObject(): FabricObject | null;
    zoomToPoint(point: { x: number; y: number }, value: number): Canvas;
  }
  
  interface Object {
    // Additional properties
    id?: string;
    objectType?: string;
    visible: boolean;
    selectable: boolean;
    evented: boolean;
    
    // Methods
    set(options: Record<string, any>): FabricObject;
    setCoords(): FabricObject;
  }
}
