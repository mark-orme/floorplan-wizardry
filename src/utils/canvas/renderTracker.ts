
/**
 * Canvas render tracking utility
 * Provides tracking of canvas render counts that the Canvas type doesn't offer natively
 */
import { Canvas as FabricCanvas } from 'fabric';

const renderCountMap = new WeakMap<FabricCanvas, number>();

/**
 * Tracks render counts for a Fabric canvas
 * @param canvas The fabric canvas instance to track
 * @returns Enhanced canvas with render tracking
 */
export function setupRenderTracking(canvas: FabricCanvas): FabricCanvas {
  if (!canvas) return canvas;
  
  // Initialize render count
  renderCountMap.set(canvas, 0);
  
  // Override requestRenderAll to track render counts
  const originalRequestRenderAll = canvas.requestRenderAll.bind(canvas);
  
  canvas.requestRenderAll = function() {
    const currentCount = renderCountMap.get(this) || 0;
    renderCountMap.set(this, currentCount + 1);
    console.log(`Canvas render requested (total: ${currentCount + 1})`);
    
    // Add a render count property to the canvas for easier access
    (canvas as any).renderCount = currentCount + 1;
    
    return originalRequestRenderAll();
  };
  
  return canvas;
}

/**
 * Gets the current render count for a canvas
 * @param canvas The fabric canvas instance
 * @returns The number of renders tracked
 */
export function getRenderCount(canvas: FabricCanvas): number {
  return renderCountMap.get(canvas) || 0;
}

/**
 * Resets the render count for a canvas
 * @param canvas The fabric canvas instance
 */
export function resetRenderCount(canvas: FabricCanvas): void {
  renderCountMap.set(canvas, 0);
  (canvas as any).renderCount = 0;
}
