
import { Canvas, PencilBrush, Object as FabricObject } from "fabric";

/**
 * Initialize a drawing brush for a Fabric canvas
 * @param canvas The Fabric canvas instance
 * @returns The initialized brush
 */
export const initializeDrawingBrush = (canvas: Canvas) => {
  if (!canvas) return null;
  
  try {
    const brush = new PencilBrush(canvas);
    brush.color = "#000000";
    brush.width = 2;
    return brush;
  } catch (error) {
    console.error("Failed to initialize drawing brush:", error);
    return null;
  }
};

/**
 * Safely sets canvas dimensions and refreshes the canvas
 * @param canvas The Fabric canvas instance
 * @param width Width to set
 * @param height Height to set
 */
export const setCanvasDimensions = (canvas: Canvas, width: number, height: number) => {
  if (!canvas) return;
  
  try {
    canvas.setDimensions({ width, height });
    canvas.renderAll();
  } catch (error) {
    console.error("Failed to set canvas dimensions:", error);
  }
};

/**
 * Properly dispose the canvas instance to prevent memory leaks
 * @param canvas The Fabric canvas instance to dispose
 */
export const disposeCanvas = (canvas: Canvas | null) => {
  if (!canvas) return;
  
  try {
    // Remove all event listeners
    canvas.off();
    
    // Clear all objects
    canvas.clear();
    
    // Dispose the canvas
    canvas.dispose();
    
    console.log("Canvas disposed successfully");
  } catch (error) {
    console.error("Error disposing canvas:", error);
  }
};

/**
 * Clear objects from canvas while preserving grid
 * @param canvas The Fabric canvas instance
 * @param gridObjects Grid objects to preserve
 */
export const clearCanvasObjects = (canvas: Canvas, gridObjects: any[]) => {
  if (!canvas) return;
  
  try {
    // Get all objects that are not grid
    const objectsToRemove = canvas.getObjects().filter(obj => 
      !gridObjects.includes(obj)
    );
    
    // Remove them
    objectsToRemove.forEach(obj => {
      canvas.remove(obj);
    });
    
    canvas.renderAll();
  } catch (error) {
    console.error("Error clearing canvas objects:", error);
  }
};

/**
 * Add Pressure sensitivity for Apple Pencil
 * @param canvas The Fabric canvas instance
 */
export const addPressureSensitivity = (canvas: Canvas) => {
  if (!canvas) return;
  
  try {
    canvas.on('mouse:down', (e) => {
      if (e.e instanceof TouchEvent && 'force' in e.e.touches[0]) {
        const force = e.e.touches[0].force || 1;
        if (canvas.freeDrawingBrush) {
          // Scale force to a reasonable brush width range (1-5)
          canvas.freeDrawingBrush.width = Math.max(1, Math.min(5, force * 5));
        }
      }
    });
    
    console.log("Apple Pencil pressure sensitivity added");
  } catch (error) {
    console.error("Error adding pressure sensitivity:", error);
  }
};

/**
 * Add pinch-to-zoom gesture support
 * @param canvas The Fabric canvas instance
 * @param setZoomLevel Function to update zoom level state
 */
export const addPinchToZoom = (canvas: Canvas, setZoomLevel: (zoom: number) => void) => {
  if (!canvas) return;
  
  let initialDistance = 0;
  let initialZoom = 1;
  
  try {
    // Track touch start to calculate initial distance between fingers
    canvas.on('touch:start', (e) => {
      if (e.e.touches && e.e.touches.length === 2) {
        initialDistance = Math.hypot(
          e.e.touches[0].clientX - e.e.touches[1].clientX,
          e.e.touches[0].clientY - e.e.touches[1].clientY
        );
        initialZoom = canvas.getZoom();
      }
    });
    
    // Handle pinch gesture
    canvas.on('touch:move', (e) => {
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
    
    // Reset initial values when touch ends
    canvas.on('touch:end', () => {
      initialDistance = 0;
    });
    
    console.log("Pinch-to-zoom gesture support added");
  } catch (error) {
    console.error("Error adding pinch-to-zoom:", error);
  }
};

/**
 * Add angle snapping to improve line straightening
 * @param start Start point
 * @param end End point
 * @returns Snapped end point
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
