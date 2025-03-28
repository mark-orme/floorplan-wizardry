
/**
 * Canvas events exports
 * @module canvas-events
 */

// Export hooks
export { useCanvasHandlers } from './useCanvasHandlers';
export { useKeyboardEvents } from './useKeyboardEvents';
export { useMouseEvents } from './useMouseEvents';
export { useObjectEvents } from './useObjectEvents';
export { usePathEvents } from './usePathEvents';
export { useZoomTracking } from './useZoomTracking';
export { useBrushSettings } from './useBrushSettings';

// Export types
export type {
  BaseEventProps,
  UseKeyboardEventsProps,
  UseMouseEventsProps,
  UsePathEventsProps,
  UseZoomTrackingProps,
  UseZoomTrackingResult,
  EventHandlerResult,
  ZoomDirection,
  ZoomOptions,
  CanvasEvents,
  EventHandlerMap,
  EditableFabricObject,
  TargetEvent
} from './types';

// Export constants
export { ZOOM_LEVEL_CONSTANTS } from './types';
