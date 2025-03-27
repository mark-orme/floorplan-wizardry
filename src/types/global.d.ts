
/**
 * Global TypeScript declarations
 * Extends the Window interface with application-specific global properties
 */

import { Canvas } from 'fabric';

// Extend the Window interface with our custom properties
interface Window {
  /**
   * Global registry for Fabric.js canvas instances
   * Used for emergency recovery when standard initialization fails
   */
  fabricCanvasInstances?: Canvas[];
  
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
