
import { Canvas, Object as FabricObject } from 'fabric';

/**
 * Extended Fabric object with custom properties
 */
export interface ExtendedFabricObject extends FabricObject {
  id?: string;
  objectType?: string;
  gridType?: 'small' | 'large';
  isGrid?: boolean;
  isLargeGrid?: boolean;
}

/**
 * Extended Fabric canvas with additional properties needed for our application
 */
export interface ExtendedFabricCanvas extends Canvas {
  wrapperEl: HTMLElement;
  upperCanvasEl?: HTMLCanvasElement;
  skipOffscreen?: boolean;
  allowTouchScrolling?: boolean;
  initialize?: () => void;
  skipTargetFind?: boolean;
  _activeObject?: FabricObject | null;
  _objects?: FabricObject[];
  getActiveObjects: () => FabricObject[];
  getElement?: () => HTMLCanvasElement;
  renderOnAddRemove?: boolean;
  loadFromJSON?: (json: any, callback?: () => void) => Canvas;
  sendObjectToBack?: (object: FabricObject) => Canvas;
  fire?: (eventName: string, options?: any) => Canvas;
  forEachObject?: (callback: (obj: FabricObject) => void) => void;
  viewportTransform?: number[];
}

/**
 * Helper function to safely cast a Fabric Canvas to our extended type
 */
export function asExtendedCanvas(canvas: Canvas): ExtendedFabricCanvas {
  return canvas as unknown as ExtendedFabricCanvas;
}

/**
 * Helper function to safely cast canvas objects
 */
export function asExtendedObject(object: FabricObject): ExtendedFabricObject {
  return object as ExtendedFabricObject;
}

/**
 * Property status enumeration
 */
export enum PropertyStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  IN_REVIEW = 'in_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PENDING_REVIEW = 'pending_review',
  COMPLETED = 'completed'
}

/**
 * Floor plan metadata interface
 */
export interface FloorPlanMetadata {
  level: number;
  name: string;
  created: string;
  updated: string;
  description?: string;
}

/**
 * Performance metrics interface
 */
export interface PerformanceMetrics {
  fps: number;
  renderTime: number;
  objectCount: number;
  visibleObjectCount?: number;
  memoryUsage?: number;
}

/**
 * Resizing state interface
 */
export interface ResizingState {
  width: number;
  height: number;
  scale: number;
  aspectRatio: number;
  isResizing: boolean;
  initialResizeComplete: boolean;
  resizeInProgress: boolean;
  lastResizeTime: number;
}
