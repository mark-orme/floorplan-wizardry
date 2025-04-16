
/**
 * Extended type definitions for Fabric.js
 * Adds custom properties to base Fabric types
 */
import { Object as FabricObject, Line } from 'fabric';

// Extend the Fabric Object interface
declare module 'fabric' {
  interface Object {
    id?: string;
    objectType?: string;
    data?: any;
  }
  
  // Extend specific shape interfaces
  interface Line {
    data?: any;
  }
}
