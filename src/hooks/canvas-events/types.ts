
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { Point } from "@/types/core/Point";
import { DrawingTool } from "@/constants/drawingModes";

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
  'zoom:change': any;
  'viewport:scaled': any;
  'zoom:updated': any;
}

/**
 * Zoom direction type
 */
export type ZoomDirection = 'in' | 'out';

/**
 * Event handler map type
 */
export interface EventHandlerMap {
  [eventName: string]: (e: any) => void;
}

/**
 * Editable Fabric object
 */
export type EditableFabricObject = FabricObject & {
  isEditing?: boolean;
};

/**
 * Target event type
 */
export interface TargetEvent {
  target: FabricObject | null;
}

/**
 * Base props for event handler hooks
 */
export interface BaseEventHandlerProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
}

/**
 * Zoom tracking constants
 */
export const ZOOM_LEVEL_CONSTANTS = {
  MIN: 0.1,
  MAX: 10,
  DEFAULT: 1,
  STEP: 0.1
};

/**
 * Result interface for event handler hooks
 * Provides registration and cleanup methods
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
  /** Reference to the fabric canvas */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Function to update zoom level */
  updateZoomLevel?: (zoomLevel: number) => void;
  /** Current active tool */
  tool?: DrawingTool;
}

/**
 * Result type for useZoomTracking hook
 */
export interface UseZoomTrackingResult extends EventHandlerResult {
  /** Current zoom level */
  currentZoom: number;
}

/**
 * Props for useBrushSettings hook
 */
export interface UseBrushSettingsProps {
  /** Reference to the fabric canvas */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Current active tool */
  tool: DrawingTool;
  /** Line color */
  lineColor: string;
  /** Line thickness */
  lineThickness: number;
}

/**
 * Props for useCanvasHandlers hook
 */
export interface UseCanvasHandlersProps {
  /** Reference to the fabric canvas */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Current active tool */
  tool: DrawingTool;
}

/**
 * Props for usePathEvents hook
 */
export interface UsePathEventsProps {
  /** Reference to the fabric canvas */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Function to save current state */
  saveCurrentState: () => void;
  /** Function to process path */
  processCreatedPath: (path: FabricObject) => void;
  /** Function to handle mouse up event */
  handleMouseUp: (e?: MouseEvent | TouchEvent) => void;
}

/**
 * Props for useObjectEvents hook
 */
export interface UseObjectEventsProps {
  /** Reference to the fabric canvas */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Current active tool */
  tool: DrawingTool;
  /** Function to save current state */
  saveCurrentState: () => void;
}

/**
 * Props for useMouseEvents hook
 */
export interface UseMouseEventsProps {
  /** Reference to the fabric canvas */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Current active tool */
  tool: DrawingTool;
  /** Function to handle mouse down event */
  handleMouseDown: (e: MouseEvent | TouchEvent) => void;
  /** Function to handle mouse move event */
  handleMouseMove: (e: MouseEvent | TouchEvent) => void;
  /** Function to handle mouse up event */
  handleMouseUp: (e?: MouseEvent | TouchEvent) => void;
}

/**
 * Props for useKeyboardEvents hook
 */
export interface UseKeyboardEventsProps {
  /** Function to handle undo */
  handleUndo: () => void;
  /** Function to handle redo */
  handleRedo: () => void;
  /** Function to delete selected objects */
  deleteSelectedObjects: () => void;
}
