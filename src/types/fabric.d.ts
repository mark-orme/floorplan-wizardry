
/**
 * Type definitions to extend the Fabric.js library
 * Adds custom properties and events specific to our application
 * @module fabric-extensions
 */

import { Canvas, CanvasEvents, Object as FabricObject } from 'fabric';

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
  }
  
  /**
   * Extended FabricObject interface with custom properties
   * @interface Object
   */
  interface Object {
    /** Type of object for specialized handling */
    objectType?: 'line' | 'room' | 'grid' | string;
    
    /** Whether the object is currently being edited */
    isEditing?: boolean;
    
    /** Tolerance for target finding (hit detection) */
    targetFindTolerance?: number;
    
    /** Whether to use pixel-perfect target finding */
    perPixelTargetFind?: boolean;
  }
}
