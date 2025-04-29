
import { Canvas, Object as FabricObject } from 'fabric';

/**
 * Extended fabric object interface with custom properties
 */
export interface ExtendedFabricObject extends FabricObject {
  id?: string;
  objectType?: string;
  isGrid?: boolean;
  isLargeGrid?: boolean;
  data?: any;
}

/**
 * Extended fabric canvas interface with additional properties
 */
export interface ExtendedFabricCanvas extends Canvas {
  wrapperEl: HTMLDivElement;
  renderOnAddRemove?: boolean;
  allowTouchScrolling?: boolean;
  skipTargetFind?: boolean;
  skipOffscreen?: boolean;
  viewportTransform?: number[];
  initialize: (element: string | HTMLCanvasElement, options?: any) => Canvas;
  forEachObject: (callback: (obj: FabricObject) => void) => void;
  getActiveObject: () => FabricObject | null;
  zoomToPoint: (point: { x: number, y: number }, value: number) => void;
  setViewportTransform?: (transform: number[]) => Canvas;
}

/**
 * Floor plan metadata interface
 */
export interface FloorPlanMetadata {
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  version?: number;
  scale?: number;
  unit?: string;
  name?: string;
  description?: string;
  tags?: string[];
  properties?: Record<string, any>;
}

/**
 * Canvas state interface
 */
export interface CanvasState {
  objects: any[];
  background?: string;
  width?: number;
  height?: number;
  zoom?: number;
  viewportTransform?: number[];
  tool?: string;
  gridVisible?: boolean;
  snapToGrid?: boolean;
  gridSize?: number;
}

/**
 * User interface for canvas collaboration
 */
export interface CanvasUser {
  id: string;
  name: string;
  color: string;
  cursor?: { x: number; y: number };
  active?: boolean;
  lastActive?: string;
}
