
/**
 * Types for canvas event handlers
 * @module canvas-events/types
 */
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { DrawingMode } from '@/constants/drawingModes';

/**
 * Base event props interface
 */
export interface BaseEventProps {
  /** Reference to fabric canvas */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Current drawing tool */
  tool: DrawingMode;
}

/**
 * Keyboard event props
 */
export interface UseKeyboardEventsProps extends BaseEventProps {
  /** Handle undo operation */
  handleUndo: () => void;
  /** Handle redo operation */
  handleRedo: () => void;
  /** Delete selected objects */
  deleteSelectedObjects: () => void;
  /** Handle escape key */
  handleEscape?: () => void;
  /** Handle delete key */
  handleDelete?: () => void;
}

/**
 * Mouse event props
 */
export interface UseMouseEventsProps extends BaseEventProps {
  /** Handle mouse down event */
  handleMouseDown?: (e: MouseEvent | TouchEvent) => void;
  /** Handle mouse move event */
  handleMouseMove?: (e: MouseEvent | TouchEvent) => void;
  /** Handle mouse up event */
  handleMouseUp?: (e?: MouseEvent | TouchEvent) => void;
}

/**
 * Path events props
 */
export interface UsePathEventsProps extends BaseEventProps {
  /** Save current canvas state */
  saveCurrentState: () => void;
  /** Process a newly created path */
  processCreatedPath?: (path: FabricObject) => void;
  /** Handle mouse up event */
  handleMouseUp?: (e?: MouseEvent | TouchEvent) => void;
}

/**
 * Brush settings props
 */
export interface UseBrushSettingsProps extends BaseEventProps {
  /** Current line color */
  lineColor: string;
  /** Current line thickness */
  lineThickness: number;
}

/**
 * Canvas handlers props
 */
export interface UseCanvasHandlersProps extends BaseEventProps {
  /** List of event types to register */
  eventTypes: string[];
  /** Map of event handlers */
  handlers: EventHandlerMap;
}

/**
 * Zoom tracking props
 */
export interface UseZoomTrackingProps extends BaseEventProps {
  /** Update zoom level callback */
  updateZoomLevel?: () => void;
}

/**
 * Zoom tracking results
 */
export interface UseZoomTrackingResult extends EventHandlerResult {
  /** Zoom in function */
  zoomIn: () => void;
  /** Zoom out function */
  zoomOut: () => void;
  /** Reset zoom function */
  resetZoom: () => void;
  /** Set zoom to specific level */
  setZoom: (level: number) => void;
  /** Current zoom level */
  currentZoom: number;
}

/**
 * Object events props
 */
export interface UseObjectEventsProps extends BaseEventProps {
  /** Save current canvas state */
  saveCurrentState: () => void;
}

/**
 * Generic event handler result
 */
export interface EventHandlerResult {
  /** Register event handlers */
  register: () => void;
  /** Unregister event handlers */
  unregister: () => void;
  /** Clean up resources */
  cleanup: () => void;
}

/**
 * Zoom level constants
 */
export const ZOOM_LEVEL_CONSTANTS = {
  /** Default zoom level */
  DEFAULT_ZOOM: 1,
  /** Minimum zoom level */
  MIN_ZOOM: 0.1,
  /** Maximum zoom level */
  MAX_ZOOM: 5,
  /** Zoom step */
  ZOOM_STEP: 0.1
};

/**
 * Zoom direction type
 */
export type ZoomDirection = 'in' | 'out';

/**
 * Zoom options interface
 */
export interface ZoomOptions {
  /** Zoom level */
  level: number;
  /** Center X coordinate */
  centerX?: number;
  /** Center Y coordinate */
  centerY?: number;
  /** Skip rendering */
  skipRender?: boolean;
}

/**
 * Canvas events enum
 */
export enum CanvasEvents {
  /** Object added event */
  OBJECT_ADDED = 'object:added',
  /** Object modified event */
  OBJECT_MODIFIED = 'object:modified',
  /** Object removed event */
  OBJECT_REMOVED = 'object:removed',
  /** Selection created event */
  SELECTION_CREATED = 'selection:created',
  /** Selection cleared event */
  SELECTION_CLEARED = 'selection:cleared',
  /** Path created event */
  PATH_CREATED = 'path:created'
}

/**
 * Event handler map type
 */
export type EventHandlerMap = Record<string, (e: any) => void>;

/**
 * Editable fabric object interface
 */
export interface EditableFabricObject extends FabricObject {
  /** Whether the object is being edited */
  isEditing?: boolean;
}

/**
 * Target event interface
 */
export interface TargetEvent {
  /** Target object */
  target: FabricObject;
}
