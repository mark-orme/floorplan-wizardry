
import { Canvas, Object as FabricObject, Path, Polyline } from 'fabric';

declare module 'fabric' {
  interface ObjectOptions {
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
  }
}

// Ensure correct typing for various methods and properties
declare module 'fabric' {
  // Add any custom extensions to Fabric types if needed
  interface Canvas {
    contains(object: FabricObject): boolean;
    // Add the missing moveTo method
    moveTo(object: FabricObject, index: number): Canvas;
  }
}
