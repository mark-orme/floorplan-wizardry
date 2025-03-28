
/**
 * Types for canvas event handlers
 * @module canvas-events/types
 */
import type { MutableRefObject } from 'react';
import type { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import type { DrawingMode } from '@/constants/drawingModes';
import type { ZoomDirection } from '@/types/drawingTypes';

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
}
