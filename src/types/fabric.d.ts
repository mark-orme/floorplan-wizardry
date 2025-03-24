
import { Canvas, Object as FabricObject, Path, Polyline } from 'fabric';

declare module 'fabric' {
  interface ObjectOptions {
    objectType?: string;
  }
}

// Add any additional custom type extensions here if needed
