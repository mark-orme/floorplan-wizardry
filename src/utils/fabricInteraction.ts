
/**
 * Utilities for Fabric.js interaction handling (gestures, snapping)
 * @module fabricInteraction
 */
import { Canvas } from "fabric";

/**
 * Add pinch-to-zoom gesture support
 * @param {Canvas} canvas - The Fabric canvas instance
 * @param {Function} setZoomLevel - Function to update zoom level state
 */
export const addPinchToZoom = (canvas: Canvas, setZoomLevel: (zoom: number) => void) => {
  if (!canvas) {
    console.error("Cannot add pinch-to-zoom: canvas is null");
    return;
  }
  
  let initialDistance = 0;
  let initialZoom = 1;
  
  try {
    // Using standard mouse/pointer events with custom handling for touch
    canvas.on('mouse:down', (e: any) => {
      if (e.e.touches && e.e.touches.length === 2) {
        initialDistance = Math.hypot(
          e.e.touches[0].clientX - e.e.touches[1].clientX,
          e.e.touches[0].clientY - e.e.touches[1].clientY
        );
        initialZoom = canvas.getZoom();
        
        // Prevent default to avoid page scrolling
        e.e.preventDefault();
        console.log("Pinch-to-zoom gesture started");
      }
    });
    
    // Handle the pinch gesture during movement
    canvas.on('mouse:move', (e: any) => {
      if (e.e.touches && e.e.touches.length === 2 && initialDistance > 0) {
        const currentDistance = Math.hypot(
          e.e.touches[0].clientX - e.e.touches[1].clientX,
          e.e.touches[0].clientY - e.e.touches[1].clientY
        );
        
        const scaleFactor = currentDistance / initialDistance;
        const newZoom = Math.min(3, Math.max(0.5, initialZoom * scaleFactor));
        
        canvas.setZoom(newZoom);
        setZoomLevel(newZoom);
        
        // Prevent default to avoid page zooming
        e.e.preventDefault();
      }
    });
    
    // Reset the initial values when touch ends
    canvas.on('mouse:up', () => {
      initialDistance = 0;
    });
    
    console.log("Pinch-to-zoom gesture support added");
  } catch (error) {
    console.error("Error adding pinch-to-zoom:", error);
  }
};

/**
 * Add angle snapping to improve line straightening
 * @param {{ x: number, y: number }} start - Start point
 * @param {{ x: number, y: number }} end - End point
 * @returns {{ x: number, y: number }} Snapped end point
 */
export const snapToAngle = (start: { x: number, y: number }, end: { x: number, y: number }) => {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const angle = Math.atan2(dy, dx) * 180 / Math.PI;
  
  // Snap to 45° increments (0°, 45°, 90°, 135°, 180°, etc.)
  const snappedAngle = Math.round(angle / 45) * 45;
  const length = Math.hypot(dx, dy);
  
  // Convert back to radians for Math.cos/sin
  const radians = snappedAngle * Math.PI / 180;
  
  return {
    x: start.x + length * Math.cos(radians),
    y: start.y + length * Math.sin(radians)
  };
};
