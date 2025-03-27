
import { Canvas as FabricCanvas } from "fabric";
import { Point } from "@/types/core/Point";
import { DrawingTool } from "@/constants/drawingModes";

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
