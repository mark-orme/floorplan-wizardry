
import { Canvas as FabricCanvas, Object as FabricObject, Line, Point as FabricPoint } from 'fabric';

// Point interface for consistent internal usage
export interface Point {
  x: number;
  y: number;
}

// Core canvas extensions
export interface ExtendedFabricCanvas extends FabricCanvas {
  wrapperEl: HTMLElement;
  initialize: () => void;
  skipTargetFind?: boolean;
  allowTouchScrolling?: boolean;
  skipOffscreen?: boolean;
  renderOnAddRemove?: boolean;
  viewportTransform?: number[];
  forEachObject?: (callback: (obj: FabricObject) => void) => void;
  zoomToPoint?: (point: Point, value: number) => void;
  getActiveObject?: () => any;
  _activeObject?: any;
  _objects?: any[];
}

// Object extensions
export interface ExtendedFabricObject extends FabricObject {
  id?: string;
  objectType?: string;
  isGrid?: boolean;
  isLargeGrid?: boolean;
  visible?: boolean;
  selectable?: boolean;
  evented?: boolean;
  excludeFromExport?: boolean | (() => void);
  isOnScreen?: boolean;
}

// Grid constants
export const GRID_CONSTANTS = {
  SMALL_GRID_SIZE: 20,
  LARGE_GRID_SIZE: 100,
  SMALL_GRID_COLOR: '#e0e0e0',
  LARGE_GRID_COLOR: '#c0c0c0',
  SMALL_GRID_WIDTH: 0.5,
  LARGE_GRID_WIDTH: 1,
  PIXELS_PER_METER: 100
};

// Measurement data for tooltips
export interface MeasurementData {
  distance: number;
  startPoint: Point;
  endPoint: Point;
  midPoint: Point;
  angle: number;
  unit: 'px' | 'm' | 'cm' | 'mm';
  pixelsPerMeter: number;
}

// FloorPlan type definitions
export interface FloorPlan {
  id: string;
  name: string;
  width: number;
  height: number;
  level?: number;
  updatedAt: string;
  label?: string;
  walls?: any[];
  rooms?: any[];
  strokes?: any[];
  data?: Record<string, any>;
}

// FloorPlan metadata
export interface FloorPlanMetadata {
  id: string;
  name: string;
  created?: string;
  modified?: string;
  updated?: string;
  description?: string;
  thumbnail?: string;
  size?: number;
  width?: number;
  height?: number;
  index?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Gesture state for touch interactions
export interface GestureStateObject {
  type: 'pinch' | 'rotate' | 'pan';
  state: 'start' | 'move' | 'end';
  scale?: number;
  rotation?: number;
  translation?: Point;
  startPoints?: Point[];
}

// Convert between fabric Points and our Points
export const toFabricPoint = (point: Point): FabricPoint => new FabricPoint(point.x, point.y);
export const fromFabricPoint = (point: FabricPoint): Point => ({ x: point.x, y: point.y });
