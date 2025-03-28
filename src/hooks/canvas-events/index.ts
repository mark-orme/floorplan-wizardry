
/**
 * Canvas events module
 * @module canvas-events
 */

// Export all types from types.ts
export type {
  EventHandlerResult,
  UseZoomTrackingProps,
  UseZoomTrackingResult,
  UsePathEventsProps,
  UseObjectEventsProps,
  UseBrushSettingsProps,
  UseKeyboardEventsProps,
  ZoomDirection,
  ZoomOptions,
  CanvasEvents,
  EventHandlerMap,
  BaseEventHandlerProps,
  EditableFabricObject,
  TargetEvent,
  UseMouseEventsProps,
  UseCanvasHandlersProps
} from './types';

// Export constants
export { ZOOM_LEVEL_CONSTANTS } from './types';

// Export hooks
export { useCanvasHandlers } from './useCanvasHandlers';
export { useZoomTracking } from './useZoomTracking';
export { usePathEvents } from './usePathEvents';
export { useObjectEvents } from './useObjectEvents';
export { useBrushSettings } from './useBrushSettings';
export { useKeyboardEvents } from './useKeyboardEvents';
