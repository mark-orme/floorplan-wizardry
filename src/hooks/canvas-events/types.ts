
/**
 * Canvas event types
 * Type definitions for canvas event handlers
 * @module canvas-events/types
 */
import { Canvas as FabricCanvas, Object as FabricObject, Point as FabricPoint } from "fabric";
import { DrawingTool } from "@/constants/drawingModes";
import { ZOOM_LEVEL_CONSTANTS } from "@/constants/numerics";

/**
 * Result of an event handler registration
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
 * Props for useZoomTracking hook
 */
export interface UseZoomTrackingProps {
  /** Reference to fabric canvas */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Current drawing tool */
  tool: DrawingTool;
  /** Function to update zoom level */
  updateZoomLevel?: () => void;
}

/**
 * Result of useZoomTracking hook
 */
export interface UseZoomTrackingResult extends EventHandlerResult {
  /** Current zoom level */
  currentZoom: number;
  /** Alias for register for backward compatibility */
  registerZoomTracking: () => void;
}

/**
 * Props for usePathEvents hook
 */
export interface UsePathEventsProps {
  /** Reference to fabric canvas */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Current drawing tool */
  tool: DrawingTool;
  /** Function to handle created path */
  handlePathCreated?: (path: FabricObject) => void;
}

/**
 * Props for useObjectEvents hook
 */
export interface UseObjectEventsProps {
  /** Reference to fabric canvas */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Current drawing tool */
  tool: DrawingTool;
}

/**
 * Props for useBrushSettings hook
 */
export interface UseBrushSettingsProps {
  /** Reference to fabric canvas */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Current line thickness */
  lineThickness: number;
  /** Current line color */
  lineColor: string;
}

/**
 * Props for useKeyboardEvents hook
 */
export interface UseKeyboardEventsProps {
  /** Function to handle undo operation */
  handleUndo?: () => void;
  /** Function to handle redo operation */
  handleRedo?: () => void;
  /** Function to handle delete operation */
  handleDelete?: () => void;
  /** Function to handle escape key */
  handleEscape?: () => void;
  /** Function to delete selected objects */
  deleteSelectedObjects?: () => void;
}

/**
 * Zoom options
 */
export interface ZoomOptions {
  /** Point to zoom around */
  point?: FabricPoint;
}

/**
 * Zoom direction type
 */
export type ZoomDirection = 'in' | 'out';

/**
 * Canvas events map
 */
export interface CanvasEvents {
  /** Object added event */
  'object:added': any;
  /** Object removed event */
  'object:removed': any;
  /** Object modified event */
  'object:modified': any;
  /** Object selected event */
  'object:selected': any;
  /** Selection cleared event */
  'selection:cleared': any;
  /** Mouse down event */
  'mouse:down': any;
  /** Mouse move event */
  'mouse:move': any;
  /** Mouse up event */
  'mouse:up': any;
  /** Path created event */
  'path:created': any;
  /** Custom zoom changed event */
  'custom:zoom-changed': any;
}

/**
 * Event handler map
 */
export interface EventHandlerMap {
  /** Map of event names to handler functions */
  [eventName: string]: (event: any) => void;
}

/**
 * Base event handler props
 */
export interface BaseEventHandlerProps {
  /** Reference to fabric canvas */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Current drawing tool */
  tool: DrawingTool;
}

/**
 * Editable fabric object type
 */
export type EditableFabricObject = FabricObject & {
  /** Custom object type property */
  objectType?: string;
};

/**
 * Target event type
 */
export interface TargetEvent {
  /** Target object */
  target: EditableFabricObject;
}

/**
 * Mouse events props interface
 */
export interface UseMouseEventsProps extends BaseEventHandlerProps {
  /** Function to handle mouse down event */
  onMouseDown?: (point: { x: number, y: number }) => void;
  /** Function to handle mouse move event */
  onMouseMove?: (point: { x: number, y: number }) => void;
  /** Function to handle mouse up event */
  onMouseUp?: (point: { x: number, y: number }) => void;
}

/**
 * Canvas handlers props interface
 */
export interface UseCanvasHandlersProps extends BaseEventHandlerProps {
  /** Function to handle object selection */
  onObjectSelected?: (object: FabricObject) => void;
  /** Function to handle selection cleared */
  onSelectionCleared?: () => void;
  /** Function to handle path creation */
  onPathCreated?: (path: FabricObject) => void;
}

/**
 * Export ZOOM_LEVEL_CONSTANTS
 */
export { ZOOM_LEVEL_CONSTANTS };
