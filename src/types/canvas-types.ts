
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';

export interface ExtendedFabricObject extends FabricObject {
  visible?: boolean;
  objectType?: string;
  gridType?: 'small' | 'large';
  selectable?: boolean;
  evented?: boolean;
  left?: number;
  top?: number;
  width?: number;
  height?: number;
  [key: string]: any;
}

export interface ExtendedFabricCanvas extends FabricCanvas {
  // Make these optional so raw fabric.Canvas still type-checks
  wrapperEl?: HTMLDivElement;
  upperCanvasEl?: HTMLCanvasElement;
  initialize?: () => void;
  
  // Methods used in various hooks
  skipOffscreen?: boolean;
  allowTouchScrolling?: boolean;
  skipTargetFind?: boolean;
  renderOnAddRemove?: boolean;
  fire?: (eventName: string, options?: any, target?: any) => FabricCanvas;
  forEachObject?: (callback: (obj: any) => void, context?: any) => void;
  viewportTransform?: number[];
  _activeObject?: any;
  _objects?: any[];
  
  // Canvas methods to ensure they're available
  on: (event: string, handler: (e: { target?: any }) => void) => FabricCanvas;
  off: (event: string, handler: (e: { target?: any }) => void) => FabricCanvas;
  renderAll: () => FabricCanvas;
  requestRenderAll: () => FabricCanvas;
  getObjects: () => any[];
  setWidth: (value: number) => FabricCanvas;
  setHeight: (value: number) => FabricCanvas;
  backgroundColor: string;
  contains: (obj: any) => boolean;
  add: (...objects: any[]) => FabricCanvas;
  remove: (...objects: any[]) => FabricCanvas;
  getWidth(): number;
  getHeight(): number;
  setZoom: (zoom: number) => FabricCanvas;
  getZoom: () => number;
  dispose: () => void;
  discardActiveObject: (options?: any) => FabricCanvas;
  getActiveObjects: () => any[];
  toJSON: (propertiesToInclude?: string[]) => any;
  clear: () => FabricCanvas;
  sendToBack: (obj: any) => FabricCanvas;
  getElement?: () => HTMLCanvasElement;
  loadFromJSON?: (json: any, callback?: () => void) => FabricCanvas;
  bringForward?: (obj: any) => FabricCanvas;
  bringToFront?: (obj: any) => FabricCanvas;
  getActiveObject?: () => any;
}

export interface PerformanceMetrics {
  fps: number;
  renderTime: number;
  objectCount: number;
  visibleObjectCount?: number;
  memoryUsage?: number;
}

export interface FloorPlanMetadata {
  level: number;
  name: string;
  created: string;
  updated: string;
  description?: string;
}

export enum PropertyStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  IN_REVIEW = 'in_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
  PENDING_REVIEW = 'pending_review',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

/**
 * Helper function to safely cast a Canvas to ExtendedFabricCanvas
 */
export function asExtendedCanvas(canvas: FabricCanvas): ExtendedFabricCanvas {
  return canvas as unknown as ExtendedFabricCanvas;
}

// For backwards compatibility
export type ExtendedCanvas = ExtendedFabricCanvas;

// Add missing type definitions
export interface DrawingState {
  isDrawing: boolean;
  startPoint?: { x: number; y: number };
  currentPoint?: { x: number; y: number };
  distance?: number;
  cursorPosition?: { x: number; y: number };
}

// Add canvas dimensions and debug info types
export interface CanvasDimensions {
  width: number;
  height: number;
  zoom: number;
}

export interface DebugInfoState {
  fps: number;
  objectCount: number;
  visibleCount: number;
  renderTime: number;
  canvasReady?: boolean;
}

// Add default canvas state
export const DEFAULT_CANVAS_STATE = {
  drawingMode: 'select',
  lineColor: '#000000',
  lineThickness: 2,
  fillColor: 'rgba(0,0,0,0.1)',
  zoom: 1,
};
