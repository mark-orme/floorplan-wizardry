
import { Canvas, Object as FabricObject, Path, Polyline, Point as FabricPoint } from 'fabric';

declare module 'fabric' {
  interface ObjectOptions {
    objectType?: string;
  }
  
  interface Object {
    objectType?: string;
  }
}

// Define our custom events
declare module 'fabric' {
  interface CanvasEvents {
    'line:scaling': {
      startPoint: { x: number, y: number };
      endPoint: { x: number, y: number };
      e?: MouseEvent | TouchEvent;
    };
    'touch:gesture': any;
    'touch:gesture:start': any;
    'touch:gesture:move': any;
    'touch:gesture:end': any;
    'custom:zoom-changed': {
      zoom: number;
    };
  }
}

// Ensure correct typing for various methods and properties
declare module 'fabric' {
  // Add any custom extensions to Fabric types if needed
  interface Canvas {
    contains(object: FabricObject): boolean;
    // Add the missing moveTo method
    moveTo(object: FabricObject, index: number): Canvas;
    // Add missing methods for object placement
    sendObjectToBack(object: FabricObject): Canvas;
    bringObjectForward(object: FabricObject): Canvas;
    bringObjectToFront(object: FabricObject): Canvas;
    sendObjectBackwards(object: FabricObject): Canvas;
  }
}
