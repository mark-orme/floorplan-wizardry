
/**
 * Shared types for canvas event hooks
 * @module canvas-events/types
 */
import { Canvas as FabricCanvas } from "fabric";
import { DrawingTool } from "@/hooks/useCanvasState";

/**
 * Base props interface shared across all event handler hooks
 */
export interface BaseEventHandlerProps {
  /** Reference to the fabric canvas */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Current active drawing tool (optional) */
  tool?: DrawingTool;
}

/**
 * Standard result interface for event handler hooks
 */
export interface EventHandlerResult {
  /** Function to perform any necessary cleanup */
  cleanup: () => void;
}
