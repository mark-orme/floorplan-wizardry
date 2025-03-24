
/**
 * Re-exports all Fabric.js utilities
 * @module fabric
 */

// Export from fabricBrush
export { initializeDrawingBrush, addPressureSensitivity } from './fabricBrush';

// Export from fabricCanvas
export { 
  setCanvasDimensions,
  disposeCanvas,
  clearCanvasObjects
} from './fabricCanvas';

// Export from fabricInteraction
export {
  addPinchToZoom,
  snapToAngle
} from './fabricInteraction';
