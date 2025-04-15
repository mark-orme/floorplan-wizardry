
/**
 * Type definitions to extend the Fabric.js library
 * Adds custom properties and events specific to our application
 * @module fabric-extensions
 */

import { Canvas, CanvasEvents as FabricCanvasEvents, Object as FabricObject, IObjectOptions } from 'fabric';

declare module 'fabric' {
  /**
   * Extended canvas events interface with custom events
   * @interface CanvasEvents
   */
  interface CanvasEvents extends FabricCanvasEvents {
    /** Event fired when measurement should be shown */
    'measurement:show': { target: FabricObject };
    
    /** Event fired when measurement should be hidden */
    'measurement:hide': {};
    
    /** Event fired when zoom level changes */
    'custom:zoom-changed': { zoom: number };
    
    /** Alternative zoom change event */
    'zoom:changed': { zoom: number };
    
    /** Zoom change event */
    'zoom:change': { point?: { x: number, y: number }, x?: number, y?: number };
    
    /** Event fired when viewport transform changes */
    'viewport:transform': { transform: number[] };
    
    /** Viewport scaled event */
    'viewport:scaled': { point?: { x: number, y: number }, x?: number, y?: number };
    
    /** Touch start event for mobile interactions */
    'touch:start': { touches: { x: number; y: number }[] };
    
    /** Touch move event for mobile interactions */
    'touch:move': { touches: { x: number; y: number }[]; e: TouchEvent };
    
    /** Object selected event */
    'object:selected': { target: FabricObject };
  }
  
  /**
   * Extended FabricObject interface with custom properties
   * @interface Object
   */
  interface Object {
    /** Unique identifier for the object */
    id?: string | number;
    
    /** Type of object for specialized handling */
    objectType?: 'line' | 'room' | 'grid' | 'wall' | 'measurement' | 'furniture' | 'text' | string;
    
    /** Whether the object is currently being edited */
    isEditing?: boolean;
    
    /** Tolerance for target finding (hit detection) */
    targetFindTolerance?: number;
    
    /** Whether to use pixel-perfect target finding */
    perPixelTargetFind?: boolean;
    
    /** Length of a line in meters (for measurements) */
    lengthInMeters?: number;
    
    /** Original points before transformation */
    originalPoints?: { x: number; y: number }[];
    
    /** Associated measurement object */
    measurementLabel?: FabricObject;
    
    /** For active selection objects, iterate through child objects */
    forEachObject?: (callback: (obj: FabricObject) => void) => void;
    
    /** Explicitly override toJSON to take no arguments */
    toJSON?: (propertiesToInclude?: string[]) => object;
  }
  
  /**
   * Extended Canvas interface with custom methods for history operations and explicit toJSON override
   * @interface Canvas
   */
  interface Canvas {
    /** Explicitly override toJSON to accept optional property names to include */
    toJSON: (propertiesToInclude?: string[]) => object;
    
    /** Handle undo operation */
    handleUndo?: () => void;
    
    /** Handle redo operation */
    handleRedo?: () => void;
    
    /** Save current state before making changes */
    saveCurrentState?: () => void;
    
    /** Delete selected objects */
    deleteSelectedObjects?: () => void;
    
    /** Send object to back */
    sendToBack: (obj: FabricObject) => Canvas;
    
    /** Bring object forward */
    bringForward: (obj: FabricObject) => Canvas;
    
    /** Bring object to front */
    bringToFront: (obj: FabricObject) => Canvas;
    
    /** Custom rendering options */
    renderingOptions?: {
      /** Whether to enable fast rendering for large canvases */
      fastRender?: boolean;
      /** Whether to skip offscreen objects during rendering */
      skipOffscreen?: boolean;
    };
  }
}

// Add global type extensions for the fabric canvas instances
declare global {
  interface Window {
    /**
     * Global registry of fabric canvas instances for recovery
     * Used for emergency recovery of lost canvas references
     */
    fabricCanvasInstances?: fabric.Canvas[];
  }
  
  interface HTMLCanvasElement {
    /**
     * Reference to the Fabric.js canvas instance
     * Stored on the canvas element for recovery purposes
     */
    _fabric?: unknown;
  }
}
