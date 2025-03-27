
/**
 * Type definitions for canvas event handlers
 * @module canvas-events/types
 */
import { Canvas as FabricCanvas, Path as FabricPath, Object as FabricObject, TEvent } from "fabric";
import { DrawingTool } from "../useCanvasState";

/** Event interface with path created */
export interface PathCreatedEvent extends TEvent {
  path: FabricPath;
}

/** Event interface with target object */
export interface TargetEvent extends TEvent {
  target: FabricObject;
}

/** Object with optional editing state */
export interface EditableFabricObject extends FabricObject {
  isEditing?: boolean;
  objectType?: string;
}

/** Base props for all event handler hooks */
export interface BaseEventHandlerProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  tool: DrawingTool;
}

/** Standard return type for event handler hooks */
export interface EventHandlerResult {
  cleanup: () => void;
}
