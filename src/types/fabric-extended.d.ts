
/**
 * Extended type definitions for Fabric.js
 * Adds custom properties to base Fabric types
 */
import { Object as FabricObject, Line, Canvas, CanvasEvents } from 'fabric';

// Extend the Fabric Object interface
declare module 'fabric' {
  interface Object {
    id?: string;
    objectType?: string;
    data?: any;
    visible?: boolean;
    set(options: Record<string, any>): FabricObject;
  }
  
  // Extend specific shape interfaces
  interface Line {
    data?: any;
    stroke?: string;
    strokeWidth?: number;
  }

  interface ILineOptions {
    stroke?: string;
    strokeWidth?: number;
  }

  // Add custom events
  interface CanvasEvents {
    'object:created': any;
  }
}
