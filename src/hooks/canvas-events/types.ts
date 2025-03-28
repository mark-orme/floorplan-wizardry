
/**
 * Canvas event types
 * Type definitions for canvas event handlers
 * @module canvas-events/types
 */
import { Canvas as FabricCanvas, Object as FabricObject, Point as FabricPoint } from "fabric";
import { DrawingTool } from "@/constants/drawingModes";
import { ZOOM_CONSTRAINTS } from "@/constants/numerics";

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
  tool?: DrawingTool;
  /** Function to save current state */
  saveCurrentState: () => void;
  /** Function to handle created path */
  processCreatedPath: (path: FabricObject) => void;
  /** Function to handle mouse up event */
  handleMouseUp: (e?: any) => void;
}

/**
 * Props for useObjectEvents hook
 */
export interface UseObjectEventsProps {
  /** Reference to fabric canvas */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Current drawing tool */
  tool: DrawingTool;
  /** Function to save current state */
  saveCurrentState: () => void;
}

/**
 * Props for useBrushSettings hook
 */
export interface UseBrushSettingsProps {
  /** Reference to fabric canvas */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Current drawing tool */
  tool: DrawingTool;
  /** Line color */
  lineColor?: string;
  /** Line thickness */
  lineThickness?: number;
}

/**
 * Props for useKeyboardEvents hook
 */
export interface UseKeyboardEventsProps {
  /** Reference to fabric canvas */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Function to handle undo operation */
  handleUndo: () => void;
  /** Function to handle redo operation */
  handleRedo: () => void;
  /** Function to delete selected objects */
  deleteSelectedObjects: () => void;
}

/**
 * Zoom direction options
 */
export type ZoomDirection = 'in' | 'out';

/**
 * Zoom options configuration
 */
export interface ZoomOptions {
  /** Direction to zoom */
  direction: ZoomDirection;
  /** Zoom factor */
  factor?: number;
  /** Zoom center point */
  point?: { x: number; y: number };
}

/**
 * Canvas event types
 */
export interface CanvasEvents {
  'object:added': any;
  'object:removed': any;
  'object:modified': any;
  'object:selected': any;
  'selection:cleared': any;
  'mouse:down': any;
  'mouse:move': any;
  'mouse:up': any;
  'path:created': any;
  'zoom:updated': any;
}

/**
 * Map of event handlers
 */
export interface EventHandlerMap {
  [eventName: string]: (e: any) => void;
}

/**
 * Base properties for event handlers
 */
export interface BaseEventHandlerProps {
  /** Reference to fabric canvas */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
}

/**
 * Editable fabric object with additional properties
 */
export interface EditableFabricObject extends FabricObject {
  isEditing?: boolean;
}

/**
 * Event with target object
 */
export interface TargetEvent {
  target: FabricObject;
}

/**
 * Props for useMouseEvents hook
 */
export interface UseMouseEventsProps extends BaseEventHandlerProps {
  /** Current drawing tool */
  tool: DrawingTool;
  /** Function to handle mouse down event */
  handleMouseDown: (e: MouseEvent | TouchEvent) => void;
  /** Function to handle mouse move event */
  handleMouseMove: (e: MouseEvent | TouchEvent) => void;
  /** Function to handle mouse up event */
  handleMouseUp: (e?: MouseEvent | TouchEvent) => void;
}

/**
 * Props for useCanvasHandlers hook
 */
export interface UseCanvasHandlersProps extends BaseEventHandlerProps {
  /** Current drawing tool */
  tool: DrawingTool;
  /** Event handlers to register */
  handlers: EventHandlerMap;
}

// Export zoom level constants for backward compatibility
export const ZOOM_LEVEL_CONSTANTS = ZOOM_CONSTRAINTS;
