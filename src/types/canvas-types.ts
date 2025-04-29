
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
  width?: number;
  height?: number;
  left?: number;
  top?: number;
  visible?: boolean;
  selectable?: boolean;
  evented?: boolean;
  stroke?: string;
  strokeWidth?: number;
  type?: string;
  set?: (options: Record<string, any>) => FabricObject;
  setCoords?: () => FabricObject;
}

/**
 * Extended fabric canvas interface with additional properties
 */
export interface ExtendedFabricCanvas extends Canvas {
  wrapperEl?: HTMLDivElement; // Make wrapperEl optional to avoid type conflicts
  renderOnAddRemove?: boolean;
  allowTouchScrolling?: boolean;
  skipTargetFind?: boolean;
  skipOffscreen?: boolean;
  viewportTransform?: number[];
  initialize?: (element: string | HTMLCanvasElement, options?: any) => Canvas;
  forEachObject?: (callback: (obj: FabricObject) => void) => void;
  getActiveObject?: () => FabricObject | null;
  zoomToPoint?: (point: { x: number, y: number }, value: number) => void;
  setViewportTransform?: (transform: number[]) => Canvas;
  enableRetinaScaling?: boolean;
  toObject?(): any;
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
  // Additional fields for backwards compatibility
  updated?: string;
  modified?: string;
  id?: string;
  thumbnail?: string;
  size?: number;
  width?: number;
  height?: number;
  index?: number;
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
  zoomLevel?: number;
}

/**
 * Debug info state
 */
export interface DebugInfoState {
  canvasReady?: boolean;
  hasError?: boolean;
  errorMessage?: string;
  objectCount?: number;
  eventCount?: number;
  fps?: number;
  visibleObjectCount?: number;
  renderTime?: number;
  memoryUsage?: number;
  canvasInitialized?: boolean;
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

/**
 * Helper function to cast a canvas to ExtendedFabricCanvas
 */
export function asExtendedCanvas(canvas: Canvas | null): ExtendedFabricCanvas | null {
  if (!canvas) return null;
  return canvas as ExtendedFabricCanvas;
}

/**
 * Helper function to cast an object to ExtendedFabricObject
 */
export function asExtendedObject<T extends FabricObject>(obj: FabricObject): T & ExtendedFabricObject {
  return obj as T & ExtendedFabricObject;
}

// Re-export the Canvas type itself for compatibility
export type { Canvas } from 'fabric';
