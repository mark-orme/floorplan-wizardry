
import { FabricObject } from 'fabric';

export interface ExtendedFabricObject extends FabricObject {
  id?: string;
  name?: string;
  layerId?: string;
  objectType?: string;
  isCustomObject?: boolean;
  isGridLine?: boolean;
  customProps?: Record<string, any>;
  width?: number;
  height?: number;
  set?: (options: Record<string, any>) => FabricObject;
  setCoords?: () => FabricObject;
}

export interface FloorPlanMetadata {
  id: string;
  name: string;
  created?: string;
  modified?: string;
  thumbnail?: string;
  size?: number;
  width?: number;
  height?: number;
  index?: number;
}

// Add PropertyStatus for imports that expect it
export enum PropertyStatus {
  AVAILABLE = 'available',
  SOLD = 'sold',
  PENDING = 'pending',
  RESERVED = 'reserved',
  UNDER_CONSTRUCTION = 'under_construction'
}
