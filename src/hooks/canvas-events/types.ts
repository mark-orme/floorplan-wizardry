
/**
 * Type definitions for canvas event handlers
 * Provides types for canvas events and handler properties
 * @module canvasEventTypes
 */
import { Canvas as FabricCanvas, Path as FabricPath, Object as FabricObject, TEvent, TPointerEvent, TPointerEventInfo } from "fabric";
import { DrawingTool } from "../useCanvasState";

/**
 * Type for Canvas Events with target object
 * Extends Fabric's pointer event with target information
 * 
 * @interface TargetEvent
 * @extends TPointerEventInfo<TPointerEvent>
 */
export interface TargetEvent extends TPointerEventInfo<TPointerEvent> {
  /** The target object of the event, if any */
  target: FabricObject | null;
}

/**
 * Type for Path Created Event
 * Used when a new path is created in the canvas
 * 
 * @interface PathCreatedEvent
 */
export interface PathCreatedEvent {
  /** The newly created path object */
  path: FabricPath;
}

/**
 * Extended FabricObject with editing properties
 * Adds editing state and object type information
 * 
 * @interface EditableFabricObject
 * @extends Omit<FabricObject, 'type'>
 */
export interface EditableFabricObject extends Omit<FabricObject, 'type'> {
  /** Custom object type identifier */
  objectType?: string;
  /** Whether the object is currently being edited */
  isEditing?: boolean;
  /** Object type (from Fabric.js) */
  type: string;
}

/**
 * Base props for event handler hooks
 * Common properties used by canvas event handler hooks
 * 
 * @interface BaseEventHandlerProps
 */
export interface BaseEventHandlerProps {
  /** Reference to the Fabric canvas instance */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Current active drawing tool */
  tool: DrawingTool;
}
