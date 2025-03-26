
/**
 * Fabric.js interaction utilities
 * Provides functions for enhancing canvas interaction
 * @module fabricInteraction
 */
import { Canvas as FabricCanvas, Object as FabricObject, Point } from "fabric";
import logger from "./logger";

/**
 * Disable selection mode for objects on the canvas
 * Makes objects non-selectable for drawing modes
 * 
 * @param {FabricCanvas} canvas - The Fabric canvas instance
 */
export const disableSelection = (canvas: FabricCanvas): void => {
  canvas.selection = false;
  canvas.defaultCursor = 'crosshair';
  canvas.hoverCursor = 'crosshair';
  
  // Make objects non-selectable
  canvas.getObjects().forEach(obj => {
    obj.selectable = false;
    (obj as any).hoverCursor = 'crosshair';
  });
  
  // Clear any active selections
  canvas.discardActiveObject();
  canvas.requestRenderAll();
  logger.info("Selection mode disabled");
};

/**
 * Enable selection mode for objects on the canvas
 * Makes objects selectable for selection mode
 * 
 * @param {FabricCanvas} canvas - The Fabric canvas instance
 */
export const enableSelection = (canvas: FabricCanvas): void => {
  canvas.selection = true;
  canvas.defaultCursor = 'default';
  canvas.hoverCursor = 'move';
  
  // Make objects selectable
  canvas.getObjects().forEach(obj => {
    // Skip grid elements
    const objectType = (obj as any).objectType;
    if (!objectType || !objectType.includes('grid')) {
      obj.selectable = true;
      (obj as any).hoverCursor = 'pointer';
    }
  });
  
  canvas.requestRenderAll();
  logger.info("Selection mode enabled");
};

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

/**
 * Enable panning mode for the canvas
 * Allows dragging the canvas viewport with the mouse
 * 
 * @param {FabricCanvas} canvas - The Fabric canvas instance
 * @param {boolean} enable - Whether to enable or disable panning
 */
export const enablePanning = (canvas: FabricCanvas, enable: boolean): void => {
  // Cast to any to access and modify custom properties
  const extendedCanvas = canvas as any;
  
  // Set panning mode
  extendedCanvas.isPanning = enable;
  
  if (enable) {
    // Store original interaction modes
    extendedCanvas.originalState = {
      selection: canvas.selection,
      defaultCursor: canvas.defaultCursor,
      hoverCursor: canvas.hoverCursor,
      isDrawingMode: canvas.isDrawingMode
    };
    
    // Configure canvas for panning
    canvas.selection = false;
    canvas.defaultCursor = 'grab';
    canvas.hoverCursor = 'grab';
    canvas.isDrawingMode = false;
    
    // Clear any active selection
    canvas.discardActiveObject();
    
    // Make objects non-selectable during panning
    canvas.getObjects().forEach(obj => {
      obj.selectable = false;
      (obj as any).hoverCursor = 'grab';
    });
    
    logger.info("Panning mode enabled");
  } else if (extendedCanvas.originalState) {
    // Restore original interaction modes
    canvas.selection = extendedCanvas.originalState.selection;
    canvas.defaultCursor = extendedCanvas.originalState.defaultCursor;
    canvas.hoverCursor = extendedCanvas.originalState.hoverCursor;
    canvas.isDrawingMode = extendedCanvas.originalState.isDrawingMode;
    
    // Clear reference to original state
    delete extendedCanvas.originalState;
    
    logger.info("Panning mode disabled");
  }
  
  canvas.requestRenderAll();
};
