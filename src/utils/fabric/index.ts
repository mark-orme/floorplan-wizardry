
/**
 * Fabric interaction utilities index
 * Central export point for all fabric interaction modules
 * @module fabric/index
 */

// Export from selection management
export {
  enableSelection,
  disableSelection
} from './selection';

// Export from gesture support
export {
  addPinchToZoom,
  snapToAngle
} from './gestures';

// Export from panning
export {
  enablePanning
} from './panning';

// Export from events (common helpers)
export {
  isTouchEvent,
  getClientX,
  getClientY
} from './events';
