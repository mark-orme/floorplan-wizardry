
/**
 * Unified Fabric.js type definitions
 * This file serves as the single source of truth for Fabric.js related types
 */
import { Canvas, Object as FabricObject, ILineOptions } from 'fabric';

/**
 * Extended Fabric Canvas with additional properties
 */
export interface ExtendedFabricCanvas extends Canvas {
  wrapperEl: HTMLElement;
  renderOnAddRemove: boolean;
  skipTargetFind?: boolean;
  allowTouchScrolling?: boolean;
  skipOffscreen?: boolean;
  viewportTransform?: number[];
  getActiveObject?: () => any;
  forEachObject?: (callback: (obj: FabricObject) => void) => void;
  zoomToPoint?: (point: { x: number, y: number }, value: number) => void;
  initialize: (element: string | HTMLCanvasElement, options?: any) => Canvas;
}

/**
 * Extended Fabric Object with additional properties
 */
export interface ExtendedFabricObject extends FabricObject {
  id?: string;
  objectType?: string;
  isGrid?: boolean;
  isLargeGrid?: boolean;
  visible?: boolean;
  evented?: boolean;
  set(options: Record<string, any>): FabricObject;
}

/**
 * Grid constants for consistent usage
 */
export const GRID_CONSTANTS = {
  SMALL_GRID_SIZE: 20,
  LARGE_GRID_SIZE: 100,
  SMALL_GRID_COLOR: '#e5e5e5',
  LARGE_GRID_COLOR: '#cccccc',
  SMALL_GRID_WIDTH: 0.5,
  LARGE_GRID_WIDTH: 1,
};

/**
 * Floor plan metadata interface
 */
export interface FloorPlanMetadata {
  createdAt: string;
  updatedAt: string;
  id?: string;
  name?: string;
  description?: string;
  updated?: string;
  modified?: string;
  paperSize?: string;
  level?: number;
  version?: string;
  author?: string;
  dateCreated?: string;
  lastModified?: string;
  notes?: string;
}

/**
 * Canvas state interface
 */
export interface CanvasState {
  objects: FabricObject[];
  background: string;
  width: number;
  height: number;
  zoom: number;
  zoomLevel: number;
  viewportTransform: number[];
  tool: string;
  gridVisible: boolean;
  snapToGrid: boolean;
  gridSize: number;
}

/**
 * Helper function to cast a normal canvas to extended canvas
 */
export function asExtendedCanvas(canvas: Canvas): ExtendedFabricCanvas {
  return canvas as unknown as ExtendedFabricCanvas;
}

/**
 * Helper function to cast a normal object to extended object
 */
export function asExtendedObject(obj: FabricObject): ExtendedFabricObject {
  return obj as unknown as ExtendedFabricObject;
}
