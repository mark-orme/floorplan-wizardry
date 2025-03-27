
/**
 * Canvas event handling type definitions
 * @module canvas-events/types
 */
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { DrawingMode } from "@/types/drawingTypes";

/**
 * Canvas operation types
 */
export type CanvasOperation = 'draw' | 'erase' | 'select' | 'move' | 'zoom' | 'measure' | 'text';

/**
 * Extended fabric object with additional properties
 */
export interface EditableFabricObject extends FabricObject {
  id?: string;
  objectType?: string;
}

/**
 * Canvas event with target typing
 */
export interface TargetEvent {
  target: EditableFabricObject | null;
  e: Event;
}

/**
 * Canvas events map for event handlers
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
 * Zoom direction type
 */
export type ZoomDirection = 'in' | 'out';

/**
 * Zoom level constants
 */
export const ZOOM_LEVEL_CONSTANTS = {
  /** Minimum zoom level */
  MIN_ZOOM: 0.1,
  
  /** Maximum zoom level */
  MAX_ZOOM: 10.0,
  
  /** Default zoom level */
  DEFAULT_ZOOM: 1.0,
  
  /** Zoom increment */
  ZOOM_INCREMENT: 0.1
};

/**
 * Handler types for canvas event systems
 */
export type EventHandlerMap = {
  [K in keyof CanvasEvents]: (e: CanvasEvents[K], canvas: FabricCanvas) => void;
};

/**
 * Base props for all event handlers
 */
export interface BaseEventHandlerProps {
  /** Reference to the fabric canvas instance */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Current tool selected */
  tool?: DrawingMode;
}

/**
 * Result interface for event handlers
 */
export interface EventHandlerResult {
  /** Register event handlers */
  register: () => void;
  /** Remove event handlers */
  unregister: () => void;
  /** Clean up resources */
  cleanup: () => void;
}

/**
 * Props for useZoomTracking hook
 */
export interface UseZoomTrackingProps extends BaseEventHandlerProps {
  /** Function to update zoom level in state */
  updateZoomLevel: (zoomLevel: number) => void;
}

/**
 * Result from useZoomTracking hook
 */
export interface UseZoomTrackingResult extends EventHandlerResult {
  /** Current zoom level */
  currentZoom: number;
  /** Register zoom tracking specifically */
  registerZoomTracking: () => void;
}

/**
 * Props for usePathEvents hook
 */
export interface UsePathEventsProps extends BaseEventHandlerProps {}

/**
 * Props for useObjectEvents hook
 */
export interface UseObjectEventsProps extends BaseEventHandlerProps {}

/**
 * Props for useMouseEvents hook
 */
export interface UseMouseEventsProps extends BaseEventHandlerProps {}

/**
 * Props for useKeyboardEvents hook
 */
export interface UseKeyboardEventsProps extends BaseEventHandlerProps {}

/**
 * Props for useBrushSettings hook
 */
export interface UseBrushSettingsProps extends BaseEventHandlerProps {}

/**
 * Props for useCanvasHandlers hook
 */
export interface UseCanvasHandlersProps extends BaseEventHandlerProps {}
