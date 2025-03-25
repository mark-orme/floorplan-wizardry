
import { Canvas, CanvasEvents } from 'fabric';

// Extend the Fabric.js Canvas events interface
declare module 'fabric' {
  interface CanvasEvents {
    'measurement:show': any;
    'measurement:hide': any;
    'custom:zoom-changed': any;
    'zoom:changed': any;
    'viewport:transform': any;
  }
}
