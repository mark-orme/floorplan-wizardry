
import { Canvas, Object as FabricObject, Path, Polyline } from 'fabric';

declare module 'fabric' {
  interface ObjectOptions {
    objectType?: string;
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
