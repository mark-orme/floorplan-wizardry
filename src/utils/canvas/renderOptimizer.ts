
import { Canvas as FabricCanvas } from 'fabric';

/**
 * Optimize canvas performance by configuring rendering and caching settings
 * @param canvas Fabric canvas instance to optimize
 */
export const optimizeCanvasPerformance = (canvas: FabricCanvas): void => {
  if (!canvas) return;

  // Disable automatic rendering for better performance control
  canvas.renderOnAddRemove = false;

  // Enable object caching for improved rendering speed
  canvas.forEachObject(obj => {
    // Disable caching for path and group objects to prevent potential rendering issues
    obj.objectCaching = !['path', 'group'].includes(obj.type || '');
  });

  // Enable retina scaling for crisp rendering on high-DPI displays
  canvas.enableRetinaScaling = true;

  // Optimize selection and interaction performance
  canvas.skipTargetFind = false;
};

// Export existing functions from the previous renderOptimizer implementation
export * from './renderOptimizer';

