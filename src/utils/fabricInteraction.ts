
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
      if (e.e && e.e.touches && e.e.touches.length === 2) {
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
      if (e.e && e.e.touches && e.e.touches.length === 2 && initialDistance > 0) {
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
 * Enable hand tool panning functionality
 * @param {Canvas} canvas - The Fabric canvas instance
 * @param {boolean} isPanningMode - Whether panning mode is active
 */
export const enablePanning = (canvas: Canvas, isPanningMode: boolean) => {
  if (!canvas) {
    console.error("Cannot enable panning: canvas is null");
    return;
  }
  
  try {
    // Store the last coordinates to calculate the delta movement
    let lastPosX = 0;
    let lastPosY = 0;
    let isDragging = false;

    // Remove any existing event handlers to prevent duplicates
    canvas.off('mouse:down');
    canvas.off('mouse:move');
    canvas.off('mouse:up');
    
    // Set the cursor style based on the panning mode
    canvas.defaultCursor = isPanningMode ? 'grab' : 'default';
    
    canvas.on('mouse:down', (opt: any) => {
      const evt = opt.e;
      
      // If in panning mode, handle panning logic
      if (isPanningMode) {
        isDragging = true;
        canvas.selection = false; // Disable object selection while panning
        lastPosX = evt.clientX || 0;
        lastPosY = evt.clientY || 0;
        canvas.defaultCursor = 'grabbing'; // Change cursor to grabbing
        
        // For touch devices
        if (evt.touches && evt.touches[0]) {
          lastPosX = evt.touches[0].clientX;
          lastPosY = evt.touches[0].clientY;
        }
        
        evt.preventDefault(); // Prevent browser's default drag behavior
      }
      
      // Enable pointer events for all other tools
      canvas.selection = !isPanningMode;
    });
    
    canvas.on('mouse:move', (opt: any) => {
      if (isDragging && isPanningMode) {
        const evt = opt.e;
        let currentX = evt.clientX || 0;
        let currentY = evt.clientY || 0;
        
        // For touch devices
        if (evt.touches && evt.touches[0]) {
          currentX = evt.touches[0].clientX;
          currentY = evt.touches[0].clientY;
        }
        
        // Calculate how much the mouse/touch has moved
        const deltaX = currentX - lastPosX;
        const deltaY = currentY - lastPosY;
        
        // Update the last positions
        lastPosX = currentX;
        lastPosY = currentY;
        
        // Pan the canvas by applying the delta to the viewportTransform
        const vpt = canvas.viewportTransform;
        if (vpt) {
          vpt[4] += deltaX;
          vpt[5] += deltaY;
          canvas.requestRenderAll();
        }
        
        evt.preventDefault();
      }
    });
    
    canvas.on('mouse:up', () => {
      // Reset to default state when mouse/touch is released
      isDragging = false;
      canvas.defaultCursor = isPanningMode ? 'grab' : 'default';
      canvas.selection = !isPanningMode;
    });
    
    console.log(`Panning mode ${isPanningMode ? 'enabled' : 'disabled'}`);
  } catch (error) {
    console.error("Error setting up panning:", error);
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
