
/**
 * Canvas event handling hooks index
 * Re-exports all canvas event hooks for easier imports
 * @module canvas-events
 */

// Import and re-export types
export type { 
  EventHandlerResult,
  UseZoomTrackingProps,
  UseZoomTrackingResult,
  UsePathEventsProps,
  UseObjectEventsProps,
  UseBrushSettingsProps,
  UseKeyboardEventsProps,
  ZoomOptions,
  ZoomDirection,
  CanvasEvents,
  EventHandlerMap,
  BaseEventHandlerProps,
  EditableFabricObject,
  TargetEvent,
  UseMouseEventsProps,
  UseCanvasHandlersProps
} from './types';

// Import all event hooks
import { useBrushSettings } from './useBrushSettings';
import { useCanvasHandlers } from './useCanvasHandlers';
import { useKeyboardEvents } from './useKeyboardEvents';
import { useMouseEvents } from './useMouseEvents';
import { useObjectEvents } from './useObjectEvents';
import { usePathEvents } from './usePathEvents';
import { useZoomTracking } from './useZoomTracking';

// Re-export all hooks
export {
  useBrushSettings,
  useCanvasHandlers,
  useKeyboardEvents,
  useMouseEvents,
  useObjectEvents,
  usePathEvents,
  useZoomTracking
};

// Constants from the types module
export { ZOOM_LEVEL_CONSTANTS } from './types';
