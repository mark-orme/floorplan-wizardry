
/**
 * Global TypeScript declarations
 * Extends the Window interface with application-specific global properties
 */

import { Canvas } from 'fabric';

// Ensure these declarations are global
declare global {
  // Extend the Window interface with our custom properties
  interface Window {
    /**
     * Global registry for Fabric.js canvas instances
     * Used for emergency recovery when standard initialization fails
     */
    fabricCanvasInstances?: Canvas[];
    
    /**
     * Reference to the current fabric canvas instance
     * Used for debugging and testing purposes
     */
    fabricCanvas?: Canvas;
    
    /**
     * Debug information exposed globally
     */
    canvasDebug?: {
      lastInitTime: number;
      gridCreated: boolean;
      errorState: boolean;
      version: string;
    };
  }

  // Extend HTMLCanvasElement with custom properties
  interface HTMLCanvasElement {
    /**
     * Reference to associated Fabric.js canvas instance
     */
    _fabric?: any;
  }
  
  // Add type for Fabric.js pointer events
  interface FabricPointerEvent {
    e: MouseEvent | TouchEvent;
    pointer?: { x: number; y: number };
    target?: any;
  }
}

// Export an empty object to make this file a module
export {};
