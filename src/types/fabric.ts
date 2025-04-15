
import { Line, Object as FabricObject } from 'fabric';

/**
 * Interface for Fabric.js Line objects to improve type safety
 */
export interface FabricLine extends Line {
  // Any additional properties specific to FabricLine
  objectType?: string;
  id?: string;
}

/**
 * Extended FabricObject with custom properties
 */
export interface ExtendedFabricObject extends FabricObject {
  objectType?: string;
  gridType?: 'small' | 'large';
  id?: string;
}
