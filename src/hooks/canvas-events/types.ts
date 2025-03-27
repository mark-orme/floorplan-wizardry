
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
