
import { Canvas, Object as FabricObject } from 'fabric';

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
  left?: number;
  top?: number;
  type?: string;
  visible?: boolean;
  selectable?: boolean;
  evented?: boolean;
  set?: (options: Record<string, any>) => FabricObject;
  setCoords?: () => FabricObject;
}

export interface FloorPlanMetadata {
  id: string;
  name: string;
  created?: string;
  modified?: string;
  updated?: string; // Extra field for backwards compatibility
  description?: string;
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

// Add ExtendedFabricCanvas export
export interface ExtendedFabricCanvas extends Canvas {
  wrapperEl?: HTMLDivElement;
  initialize?: Function;
  skipTargetFind?: boolean;
  allowTouchScrolling?: boolean;
  skipOffscreen?: boolean;
  renderOnAddRemove?: boolean;
  viewportTransform?: number[];
  getActiveObject?: () => any;
  forEachObject?: (callback: (obj: FabricObject) => void) => void;
}
