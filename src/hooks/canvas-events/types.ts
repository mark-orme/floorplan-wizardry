
/**
 * Type definitions for canvas event handlers
 * @module canvasEventTypes
 */
import { Canvas as FabricCanvas, Path as FabricPath, Object as FabricObject, TEvent, TPointerEvent, TPointerEventInfo } from "fabric";
import { DrawingTool } from "../useCanvasState";

/**
 * Type for Canvas Events with target object
 */
export interface TargetEvent extends TPointerEventInfo<TPointerEvent> {
  target: FabricObject | null;
}

/**
 * Type for Path Created Event
 */
export interface PathCreatedEvent {
  path: FabricPath;
}

/**
 * Extended FabricObject with editing properties
 */
export interface EditableFabricObject extends Omit<FabricObject, 'type'> {
  objectType?: string;
  isEditing?: boolean;
  type: string;
}

/**
 * Base props for event handler hooks
 */
export interface BaseEventHandlerProps {
  /** Reference to the Fabric canvas instance */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Current active drawing tool */
  tool: DrawingTool;
}
