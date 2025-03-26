
/**
 * Export all canvas event handlers from a central location
 * Provides unified access to all canvas event handling hooks
 * @module canvasEvents
 */

/**
 * Export all canvas event types and handlers
 * This allows importing all event-related functionality from a single location
 * Improves code organization and maintainability
 * 
 * @example
 * import { 
 *   useMouseEvents, 
 *   useObjectEvents, 
 *   useKeyboardEvents 
 * } from '@/hooks/canvas-events';
 */
export * from './types';
export * from './usePathEvents';
export * from './useObjectEvents';
export * from './useMouseEvents';
export * from './useKeyboardEvents';
export * from './useZoomTracking';
export * from './useBrushSettings';
export * from './useCanvasHandlers';
