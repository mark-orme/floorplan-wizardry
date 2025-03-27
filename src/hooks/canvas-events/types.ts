
/**
 * Type definitions for canvas event handlers
 * Provides types for canvas events and handler properties
 * @module canvasEventTypes
 */
import { Canvas as FabricCanvas, Path as FabricPath, Object as FabricObject, IEvent, TPointerEventInfo, TPointerEvent } from "fabric";
import { DrawingTool } from "../useCanvasState";
import { Point } from "@/types/geometryTypes";

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
  /** Unique identifier for the object */
  id?: string;
  /** Additional metadata */
  metadata?: Record<string, unknown>;
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

/**
 * Mouse handler props
 * Properties for mouse event handlers
 * 
 * @interface MouseHandlerProps
 * @extends BaseEventHandlerProps
 */
export interface MouseHandlerProps extends BaseEventHandlerProps {
  /** Called when mouse down event occurs */
  onMouseDown?: (event: TargetEvent, pointer: Point) => void;
  /** Called when mouse move event occurs */
  onMouseMove?: (event: TargetEvent, pointer: Point) => void;
  /** Called when mouse up event occurs */
  onMouseUp?: (event: TargetEvent, pointer: Point) => void;
}

/**
 * Object handler props
 * Properties for object event handlers
 * 
 * @interface ObjectHandlerProps
 * @extends BaseEventHandlerProps
 */
export interface ObjectHandlerProps extends BaseEventHandlerProps {
  /** Called when an object is selected */
  onObjectSelected?: (object: FabricObject) => void;
  /** Called when an object is modified */
  onObjectModified?: (object: FabricObject) => void;
  /** Called when an object is added */
  onObjectAdded?: (object: FabricObject) => void;
  /** Called when an object is removed */
  onObjectRemoved?: (object: FabricObject) => void;
}

/**
 * Path handler props
 * Properties for path event handlers
 * 
 * @interface PathHandlerProps
 * @extends BaseEventHandlerProps
 */
export interface PathHandlerProps extends BaseEventHandlerProps {
  /** Called when a path is created */
  onPathCreated?: (event: PathCreatedEvent) => void;
}

/**
 * Keyboard handler props
 * Properties for keyboard event handlers
 * 
 * @interface KeyboardHandlerProps
 * @extends BaseEventHandlerProps
 */
export interface KeyboardHandlerProps extends BaseEventHandlerProps {
  /** Function to handle undo operation */
  handleUndo: () => void;
  /** Function to handle redo operation */
  handleRedo: () => void;
  /** Function to save current state */
  saveCurrentState: () => void;
  /** Function to delete selected objects */
  deleteSelectedObjects: () => void;
}

/**
 * Event registration result
 * Return type for event registration functions
 * 
 * @interface EventRegistrationResult
 */
export interface EventRegistrationResult {
  /** Function to clean up event listeners */
  cleanup: () => void;
}
