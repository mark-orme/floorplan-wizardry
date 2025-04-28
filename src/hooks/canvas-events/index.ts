
/**
 * Canvas events exports
 * @module canvas-events
 */

// Export hooks
export { useKeyboardEvents } from './useKeyboardEvents';
export { useMouseEvents } from './useMouseEvents';
export { usePathEvents } from './usePathEvents';

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

// Create stubs for not yet implemented hooks
export const useCanvasHandlers = () => ({});
export const useObjectEvents = () => ({});
export const useZoomTracking = () => ({ zoom: 1, setZoom: () => {}, zoomIn: () => {}, zoomOut: () => {}, resetZoom: () => {} });
export const useBrushSettings = () => ({});
