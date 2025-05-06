
import { Object as FabricObject } from 'fabric';

/**
 * Represents a drawing layer in the canvas with associated objects
 */
export interface DrawingLayer {
  /** Unique identifier for the layer */
  id: string;
  
  /** Display name of the layer */
  name: string;
  
  /** Whether the layer is visible */
  visible: boolean;
  
  /** Whether the layer is locked (objects cannot be modified) */
  locked: boolean;
  
  /** Fabric objects belonging to this layer */
  objects: FabricObject[];
  
  /** Optional metadata for the layer */
  metadata?: Record<string, any>;
  
  /** Optional z-index for ordering layers */
  zIndex?: number;
  
  /** Optional opacity for the entire layer */
  opacity?: number;
}
