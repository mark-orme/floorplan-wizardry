
/**
 * Types for canvas event handlers
 * @module canvas-events/types
 */
import type { MutableRefObject } from 'react';
import type { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import type { DrawingMode } from '@/constants/drawingModes';
import type { ZoomDirection, ZoomOptions } from '@/types/drawingTypes';

/**
 * Zoom level constants
 */
export const ZOOM_LEVEL_CONSTANTS = {
  MIN_ZOOM: 0.1,
  MAX_ZOOM: 5.0,
  DEFAULT_ZOOM: 1.0,
  ZOOM_STEP: 0.1
};

/**
 * Base props interface for event handlers
 * @interface BaseEventProps
 */
export interface BaseEventProps {
  /** Reference to the Fabric canvas instance */
  fabricCanvasRef: MutableRefObject<FabricCanvas | null>;
  /** Current drawing tool */
  tool: DrawingMode;
}

/**
 * Result of event handler hooks
 * @interface EventHandlerResult
 */
export interface EventHandlerResult {
  /** Register all event handlers */
  register: () => void;
  /** Unregister all event handlers */
  unregister: () => void;
  /** Clean up resources */
  cleanup: () => void;
}

/**
 * Props for canvas event handlers
 * @interface UseCanvasHandlersProps
 */
export interface UseCanvasHandlersProps {
  /** Reference to the Fabric canvas instance */
  fabricCanvasRef: MutableRefObject<FabricCanvas | null>;
  /** Event handlers map */
  handlers: Record<string, (event?: unknown) => void>;
}

/**
 * Canvas events type
 */
export type CanvasEvents = 'object:added' | 'object:modified' | 'object:removed' | 'object:selected' | 'selection:cleared';

/**
 * Event handler map type
 */
export type EventHandlerMap = Record<string, (event?: unknown) => void>;

/**
 * Base event handler props
 */
export interface BaseEventHandlerProps {
  fabricCanvasRef: MutableRefObject<FabricCanvas | null>;
}

/**
 * Target event with target property
 */
export interface TargetEvent {
  target: FabricObject;
}

/**
 * Editable Fabric object
 */
export interface EditableFabricObject extends FabricObject {
  isEditing?: boolean;
}

/**
 * Props for object events
 * @interface UseObjectEventsProps
 */
export interface UseObjectEventsProps extends BaseEventProps {
  /** Save current state function */
  saveCurrentState: () => void;
}

/**
 * Props for brush settings
 * @interface UseBrushSettingsProps
 */
export interface UseBrushSettingsProps extends BaseEventProps {
  /** Line color */
  lineColor?: string;
  /** Line thickness */
  lineThickness?: number;
}

/**
 * Props for zoom events
 * @interface UseZoomEventsProps
 */
export interface UseZoomEventsProps extends BaseEventProps {
  /** Function to handle zoom changes */
  handleZoom: (direction: ZoomDirection) => void;
  /** Current zoom level */
  zoomLevel: number;
  /** Function to set zoom level */
  setZoomLevel: (level: number) => void;
}

/**
 * Props for mouse events
 * @interface UseMouseEventsProps
 */
export interface UseMouseEventsProps extends BaseEventProps {
  /** Function to save current state before changes */
  saveCurrentState: () => void;
  /** Grid layer objects reference */
  gridLayerRef?: MutableRefObject<FabricObject[]>;
  /** Line thickness */
  lineThickness?: number;
  /** Line color */
  lineColor?: string;
  /** Handle mouse down event */
  handleMouseDown?: (e: any) => void;
  /** Handle mouse move event */
  handleMouseMove?: (e: any) => void;
  /** Handle mouse up event */
  handleMouseUp?: (e: any) => void;
}

/**
 * Props for keyboard events
 * @interface UseKeyboardEventsProps
 */
export interface UseKeyboardEventsProps extends BaseEventProps {
  /** Function to handle undo operation */
  handleUndo: () => void;
  /** Function to handle redo operation */
  handleRedo: () => void;
  /** Function to delete selected objects */
  deleteSelectedObjects: () => void;
  /** Handle escape key press */
  handleEscape?: () => void;
  /** Handle delete key press */
  handleDelete?: () => void;
}

/**
 * Props for path events
 */
export interface UsePathEventsProps extends BaseEventProps {
  /** Function to save current state before changes */
  saveCurrentState: () => void;
}

/**
 * Props for zoom tracking
 */
export interface UseZoomTrackingProps {
  fabricCanvasRef: MutableRefObject<FabricCanvas | null>;
  zoomLevel: number;
  setZoomLevel: (level: number) => void;
}

/**
 * Result for zoom tracking
 */
export interface UseZoomTrackingResult {
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  setZoom: (level: number) => void;
}
