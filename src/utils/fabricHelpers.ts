
import { Canvas, PencilBrush, Object as FabricObject } from "fabric";

/**
 * Initialize a drawing brush for a Fabric canvas
 * @param canvas The Fabric canvas instance
 * @returns The initialized brush or null if initialization fails
 */
export const initializeDrawingBrush = (canvas: Canvas) => {
  if (!canvas) {
    console.error("Cannot initialize brush: canvas is null");
    return null;
  }
  
  try {
    const brush = new PencilBrush(canvas);
    brush.color = "#000000";
    brush.width = 2;
    console.log("Drawing brush initialized successfully");
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
export const setCanvasDimensions = (
  canvas: Canvas, 
  width: number, 
  height: number
) => {
  if (!canvas) {
    console.error("Cannot set dimensions: canvas is null");
    return;
  }
  
  try {
    console.log(`Setting canvas dimensions to ${width}x${height}`);
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
  if (!canvas) {
    console.log("No canvas to dispose");
    return;
  }
  
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
  if (!canvas) {
    console.error("Cannot clear canvas: canvas is null");
    return;
  }
  
  try {
    console.log(`Clearing canvas objects while preserving ${gridObjects.length} grid objects`);
    
    // Get all objects that are not grid
    const objectsToRemove = canvas.getObjects().filter(obj => 
      !gridObjects.includes(obj)
    );
    
    console.log(`Found ${objectsToRemove.length} objects to remove`);
    
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
  if (!canvas) {
    console.error("Cannot add pressure sensitivity: canvas is null");
    return;
  }
  
  try {
    canvas.on('mouse:down', (e: any) => {
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
