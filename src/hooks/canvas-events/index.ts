
/**
 * Canvas events exports
 * @module canvas-events
 */

// Export hooks
export { useKeyboardEvents } from './useKeyboardEvents';
export { useMouseEvents } from './useMouseEvents';
export { usePathEvents } from './usePathEvents';
export { useCanvasHandlers } from './useCanvasHandlers';
export { useObjectEvents } from './useObjectEvents';
export { useZoomTracking } from './useZoomTracking';
export { useBrushSettings } from './useBrushSettings';

// Export types
export type {
  BaseEventProps,
  UseKeyboardEventsProps,
  UseMouseEventsProps,
  UsePathEventsProps,
  EventHandlerResult,
  DrawingPathState,
  UseObjectEventsProps,
  UseBrushSettingsProps,
  UseCanvasHandlersProps,
  UseZoomTrackingProps,
  UseZoomTrackingResult,
  ZoomDirection,
  ZoomOptions,
  CanvasEvents,
  EventHandlerMap,
  EditableFabricObject,
  TargetEvent,
} from './types';

// Export constants
export { ZOOM_LEVEL_CONSTANTS } from './types';
