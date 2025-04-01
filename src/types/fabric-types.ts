
/**
 * Extended Fabric.js types
 * @module types/fabricTypes
 */
import { Object as FabricObject } from "fabric";

/**
 * Extended FabricObject with custom properties for grid
 */
export interface ExtendedFabricObject extends FabricObject {
  /** Type of object, e.g. 'grid', 'wall', etc. */
  objectType?: string;
  /** Type of grid - 'small' or 'large' */
  gridType?: 'small' | 'large';
}

