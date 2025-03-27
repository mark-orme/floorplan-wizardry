
/**
 * Shared types for canvas event hooks
 * @module canvas-events/types
 */
import { Canvas as FabricCanvas, Object as FabricObject, TPointerEvent, TEvent } from "fabric";
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

/**
 * Target event from Fabric.js with target object
 */
export interface TargetEvent extends TEvent<TPointerEvent> {
  /** The target object that was interacted with */
  target?: FabricObject | null;
}

/**
 * Extended Fabric object with editing state
 */
export interface EditableFabricObject extends FabricObject {
  /** Whether the object is currently being edited */
  isEditing?: boolean;
  /** Type of the object for specialized handling */
  objectType?: string;
}
