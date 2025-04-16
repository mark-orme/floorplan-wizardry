
import { Canvas, Object as FabricObject, Line } from 'fabric';

// Extend the global fabric namespace
declare global {
  namespace fabric {
    interface Canvas {
      __lastRenderTime?: number;
    }
    
    interface Text extends FabricObject {
      text?: string;
    }
    
    interface Object {
      data?: {
        type?: string;
        startPoint?: { x: number, y: number };
        endPoint?: { x: number, y: number };
        createdAt?: string;
        [key: string]: any;
      };
      objectType?: string;
      measurement?: string;
    }
    
    interface Line extends Object {
      calcLinePoints?(): { x1: number, y1: number, x2: number, y2: number };
    }
  }
}

// Extend FabricCanvas to include additional properties
declare module 'fabric' {
  interface Canvas {
    __lastRenderTime?: number;
    // Add other properties as needed
  }
  
  interface Object {
    data?: {
      type?: string;
      startPoint?: { x: number, y: number };
      endPoint?: { x: number, y: number };
      createdAt?: string;
      [key: string]: any;
    };
    objectType?: string;
    measurement?: string;
  }
  
  interface Line {
    calcLinePoints?(): { x1: number, y1: number, x2: number, y2: number };
  }
}
