
/**
 * Type definitions for canvas event hooks
 * Centralizes event handler types for consistent reuse
 * @module canvas-events/types
 */
import { Canvas as FabricCanvas, Object as FabricObject, Path as FabricPath } from "fabric";
import { DrawingTool } from "@/constants/drawingModes";
import { Point } from "@/types/core/Point";

/**
 * Basic event handler result interface
 * Common pattern for all event handlers
 */
export interface EventHandlerResult {
  /** Register event handlers */
  register: () => void;
  /** Unregister event handlers */
  unregister: () => void;
  /** Clean up all handlers and resources */
  cleanup: () => void;
}

/**
 * Props for the usePathEvents hook
 */
export interface UsePathEventsProps {
  /** Reference to the fabric canvas */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Function to save current state before changes */
  saveCurrentState: () => void;
  /** Function to process created paths */
  processCreatedPath: (path: FabricPath) => void;
  /** Function to handle mouse up events */
  handleMouseUp: (e?: MouseEvent | TouchEvent) => void;
  /** Current active drawing tool (optional) */
  tool?: DrawingTool;
}

/**
 * Props for the useObjectEvents hook
 */
export interface UseObjectEventsProps {
  /** Reference to the fabric canvas */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Current active drawing tool */
  tool: DrawingTool;
  /** Function to save current state before changes */
  saveCurrentState: () => void;
}

/**
 * Props for the useBrushSettings hook
 */
export interface UseBrushSettingsProps {
  /** Reference to the fabric canvas */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Current active drawing tool */
  tool: DrawingTool;
  /** Line color for drawing */
  lineColor: string;
  /** Line thickness for drawing */
  lineThickness: number;
}

/**
 * Props for the useZoomTracking hook
 */
export interface UseZoomTrackingProps {
  /** Reference to the fabric canvas */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Function to update zoom level */
  updateZoomLevel?: () => void;
  /** Current active drawing tool */
  tool: DrawingTool;
}

/**
 * Result type for useZoomTracking hook
 */
export interface UseZoomTrackingResult extends EventHandlerResult {
  /** Current zoom level */
  currentZoom: number;
  /** Register zoom tracking (alias for register) */
  registerZoomTracking?: () => void;
}

/**
 * Props for the useKeyboardEvents hook
 */
export interface UseKeyboardEventsProps {
  /** Function to handle undo */
  handleUndo: () => void;
  /** Function to handle redo */
  handleRedo: () => void;
  /** Function to delete selected objects */
  deleteSelectedObjects: () => void;
  /** Reference to the fabric canvas (optional) */
  fabricCanvasRef?: React.MutableRefObject<FabricCanvas | null>;
}

/**
 * Result type for keyboard events hook
 */
export interface UseKeyboardEventsResult extends EventHandlerResult {
  /** Whether there is a key currently pressed */
  isKeyPressed: boolean;
}

/**
 * Canvas zoom options
 */
export interface ZoomOptions {
  /** Zoom point (center of zoom) */
  point?: Point;
  /** X coordinate for zoom center */
  x?: number;
  /** Y coordinate for zoom center */
  y?: number;
  /** Zoom amount */
  zoom?: number;
}

/**
 * Zoom direction type
 */
export type ZoomDirection = 'in' | 'out';

/**
 * Canvas events map for type-safe event handling
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
 * Event handler map type
 */
export interface EventHandlerMap {
  [key: string]: (e: any) => void;
}

/**
 * Base event handler props
 */
export interface BaseEventHandlerProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
}

/**
 * Editable fabric object type
 */
export interface EditableFabricObject extends FabricObject {
  isEditing?: boolean;
  editingBorderColor?: string;
  editingBackgroundColor?: string;
}

/**
 * Target event type
 */
export interface TargetEvent {
  target: FabricObject | null;
}

/**
 * Props for the useMouseEvents hook
 */
export interface UseMouseEventsProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  tool: DrawingTool;
  saveCurrentState: () => void;
}

/**
 * Props for the useCanvasHandlers hook
 */
export interface UseCanvasHandlersProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  tool: DrawingTool;
}

/**
 * Zoom level constants
 */
export const ZOOM_LEVEL_CONSTANTS = {
  MIN_ZOOM: 0.1,
  MAX_ZOOM: 10,
  DEFAULT_ZOOM: 1,
  ZOOM_STEP: 0.1
};
