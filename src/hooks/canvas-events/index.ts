
/**
 * Canvas event handling hooks index
 * Re-exports all canvas event hooks for easier imports
 * @module canvas-events
 */

// Import and re-export types
export type { 
  EditableFabricObject,
  TargetEvent,
  CanvasEvents,
  ZoomDirection,
  EventHandlerMap,
  BaseEventHandlerProps,
  EventHandlerResult,
  // Re-export but with alias to avoid name conflicts
  UseZoomTrackingProps as ZoomTrackingProps,
  UseZoomTrackingResult as ZoomTrackingResult,
  UsePathEventsProps,
  UseObjectEventsProps,
  UseMouseEventsProps,
  UseKeyboardEventsProps,
  UseBrushSettingsProps,
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

// Original types from the specific modules
export { ZOOM_LEVEL_CONSTANTS } from './types';
