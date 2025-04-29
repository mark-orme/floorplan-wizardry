
import { FabricObject } from 'fabric';

export interface ExtendedFabricObject extends FabricObject {
  id?: string;
  name?: string;
  layerId?: string;
  objectType?: string;
  isCustomObject?: boolean;
  isGridLine?: boolean;
  customProps?: Record<string, any>;
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
