
import { Object as FabricObject } from 'fabric';

/**
 * Interface representing a drawing layer
 */
export interface DrawingLayer {
  /** Unique identifier for the layer */
  id: string;
  
  /** Display name of the layer */
  name: string;
  
  /** Whether the layer is currently visible */
  visible: boolean;
  
  /** Whether the layer is locked for editing */
  locked: boolean;
  
  /** Fabric objects contained in this layer */
  objects: FabricObject[];
}

/**
 * Create a new empty layer with default properties
 * @param name Optional name for the layer
 * @returns A new DrawingLayer object
 */
export function createLayer(name: string = `Layer ${Date.now()}`): DrawingLayer {
  return {
    id: `layer-${Date.now()}`,
    name,
    visible: true,
    locked: false,
    objects: []
  };
}

/**
 * Check if an object is a DrawingLayer
 * @param obj Object to check
 * @returns Whether the object is a DrawingLayer
 */
export function isDrawingLayer(obj: any): obj is DrawingLayer {
  return obj &&
    typeof obj === 'object' &&
    'id' in obj &&
    'name' in obj &&
    'visible' in obj &&
    'locked' in obj &&
    'objects' in obj;
}

export default DrawingLayer;
