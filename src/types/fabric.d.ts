
/**
 * Type definitions to extend the Fabric.js library
 * Adds custom properties and events specific to our application
 * @module fabric-extensions
 */

import { Canvas, CanvasEvents, Object as FabricObject, IObjectOptions } from 'fabric';

declare module 'fabric' {
  /**
   * Extended canvas events interface with custom events
   * @interface CanvasEvents
   */
  interface CanvasEvents {
    /** Event fired when measurement should be shown */
    'measurement:show': { target: FabricObject };
    
    /** Event fired when measurement should be hidden */
    'measurement:hide': {};
    
    /** Event fired when zoom level changes */
    'custom:zoom-changed': { zoom: number };
    
    /** Alternative zoom change event */
    'zoom:changed': { zoom: number };
    
    /** Event fired when viewport transform changes */
    'viewport:transform': { transform: number[] };
    
    /** Touch start event for mobile interactions */
    'touch:start': { touches: { x: number; y: number }[] };
    
    /** Touch move event for mobile interactions */
    'touch:move': { touches: { x: number; y: number }[]; e: TouchEvent };
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
  }
  
  /**
   * Extended Canvas interface with custom methods for history operations 
   * @interface Canvas
   */
  interface Canvas {
    /** Handle undo operation */
    handleUndo?: () => void;
    
    /** Handle redo operation */
    handleRedo?: () => void;
    
    /** Save current state before making changes */
    saveCurrentState?: () => void;
    
    /** Delete selected objects */
    deleteSelectedObjects?: () => void;
    
    /** Custom rendering options */
    renderingOptions?: {
      /** Whether to enable fast rendering for large canvases */
      fastRender?: boolean;
      /** Whether to skip offscreen objects during rendering */
      skipOffscreen?: boolean;
    };
  }
}
