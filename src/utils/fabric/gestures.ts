
/**
 * Fabric.js gesture handling utilities
 * Provides functions for touch gestures and angle snapping
 * @module fabric/gestures
 */
import { Canvas as FabricCanvas, Point } from "fabric";
import logger from "../logger";

/**
 * Add pinch-to-zoom gesture support
 * Enables touch-based zooming on the canvas
 * 
 * @param {FabricCanvas} canvas - The Fabric canvas instance
 */
export const addPinchToZoom = (canvas: FabricCanvas): void => {
  // Cast to any to avoid TypeScript issues with custom properties
  const extendedCanvas = canvas as any;
  
  // Initialize touch state
  extendedCanvas.touchState = {
    scale: 1,
    startDistance: 0,
    currentZoom: canvas.getZoom()
  };
  
  // Add touch start event handler
  canvas.on('touch:start', (e: any) => {
    if (e.touches && e.touches.length === 2) {
      // Store initial touch positions for pinch gesture
      const p1 = e.touches[0];
      const p2 = e.touches[1];
      
      // Calculate initial distance between touch points
      const dx = p1.x - p2.x;
      const dy = p1.y - p2.y;
      extendedCanvas.touchState.startDistance = Math.sqrt(dx * dx + dy * dy);
      extendedCanvas.touchState.currentZoom = canvas.getZoom();
      logger.debug("Pinch gesture started, distance:", extendedCanvas.touchState.startDistance);
    }
  });
  
  // Add touch move event handler
  canvas.on('touch:move', (e: any) => {
    if (e.touches && e.touches.length === 2) {
      // Get current touch positions
      const p1 = e.touches[0];
      const p2 = e.touches[1];
      
      // Calculate current distance between touch points
      const dx = p1.x - p2.x;
      const dy = p1.y - p2.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Calculate zoom scale based on pinch gesture
      extendedCanvas.touchState.scale = distance / extendedCanvas.touchState.startDistance;
      
      // Apply zoom with limits
      const newZoom = extendedCanvas.touchState.currentZoom * extendedCanvas.touchState.scale;
      const limitedZoom = Math.min(Math.max(newZoom, 0.5), 5);
      
      // Apply the zoom - create a proper Point instance
      const zoomPoint = new Point((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
      canvas.zoomToPoint(zoomPoint, limitedZoom);
      canvas.fire('zoom:changed' as any);
      
      // Prevent default touch behavior to avoid browser gestures
      e.e.preventDefault();
      e.e.stopPropagation();
    }
  });
  
  logger.info("Pinch-to-zoom gesture support added");
};

/**
 * Snap angle to nearest 45° increment
 * Helps with creating aligned walls and shapes
 * 
 * @param {number} angle - The original angle in degrees
 * @returns {number} The snapped angle in degrees
 */
export const snapToAngle = (angle: number): number => {
  // Convert to positive angle between 0-360
  angle = (angle % 360 + 360) % 360;
  
  // Snap to nearest 45 degree increment
  const increment = 45;
  return Math.round(angle / increment) * increment;
};
