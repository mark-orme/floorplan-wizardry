
/**
 * Extended Fabric.js types
 * @module types/fabricTypes
 */
import { Object as FabricObject } from "fabric";
import { FabricEventNames as OriginalFabricEventNames } from './fabric-events';

/**
 * Extended FabricObject with custom properties for grid
 */
export interface ExtendedFabricObject extends FabricObject {
  /** Type of object, e.g. 'grid', 'wall', etc. */
  objectType?: string;
  /** Type of grid - 'small' or 'large' */
  gridType?: 'small' | 'large';
}

/**
 * Re-export FabricEventNames from fabric-events
 */
export { FabricEventNames } from './fabric-events';

/**
 * Re-export FabricEventTypes as an alias for FabricEventNames for compatibility
 */
export const FabricEventTypes = OriginalFabricEventNames;
