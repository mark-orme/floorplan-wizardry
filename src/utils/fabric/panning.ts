
/**
 * Fabric.js panning utilities
 * Provides functions for panning the canvas viewport
 * @module fabric/panning
 */
import { Canvas as FabricCanvas } from "fabric";
import { getClientX, getClientY } from "./events";
import logger from "../logger";

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
    
    // Increase the viewport boundaries for panning beyond visible area
    // This will allow users to pan beyond the initial viewport
    if (!extendedCanvas.originalViewportTransform) {
      extendedCanvas.originalViewportTransform = [...canvas.viewportTransform];
    }
    
    // Add enhanced panning mouse down handler
    canvas.on('mouse:down', function(opt) {
      if (!extendedCanvas.isPanning) return;
      
      const evt = opt.e as MouseEvent | TouchEvent;
      extendedCanvas.isDragging = true;
      extendedCanvas.lastPosX = getClientX(evt, 0);
      extendedCanvas.lastPosY = getClientY(evt, 0);
      
      // Change cursor to indicate active panning
      canvas.defaultCursor = 'grabbing';
      canvas.hoverCursor = 'grabbing';
      canvas.requestRenderAll();
    });
    
    // Add enhanced panning mouse move handler
    canvas.on('mouse:move', function(opt) {
      if (!extendedCanvas.isDragging || !extendedCanvas.isPanning) return;
      
      const evt = opt.e as MouseEvent | TouchEvent;
      const vpt = canvas.viewportTransform;
      
      // Get current position, handling both mouse and touch events
      const currentX = getClientX(evt, extendedCanvas.lastPosX);
      const currentY = getClientY(evt, extendedCanvas.lastPosY);
      
      // Calculate new position with enhanced panning range
      // The multiplier (1.5) allows for faster panning
      vpt[4] += (currentX - extendedCanvas.lastPosX) * 1.5;
      vpt[5] += (currentY - extendedCanvas.lastPosY) * 1.5;
      
      // Allow panning further than the default boundaries
      // This is key to exploring the "unlimited" grid
      const maxPanDistance = Math.max(canvas.width, canvas.height) * 5;
      
      // Don't restrict panning too much - allow exploring beyond visible area
      vpt[4] = Math.min(Math.max(vpt[4], -maxPanDistance), maxPanDistance);
      vpt[5] = Math.min(Math.max(vpt[5], -maxPanDistance), maxPanDistance);
      
      extendedCanvas.lastPosX = currentX;
      extendedCanvas.lastPosY = currentY;
      
      canvas.requestRenderAll();
      canvas.fire('viewport:transform');
    });
    
    // Add enhanced panning mouse up handler
    canvas.on('mouse:up', function() {
      if (!extendedCanvas.isPanning) return;
      
      extendedCanvas.isDragging = false;
      
      // Reset cursor back to grab (not grabbing)
      canvas.defaultCursor = 'grab';
      canvas.hoverCursor = 'grab';
      canvas.requestRenderAll();
    });
    
    logger.info("Enhanced panning mode enabled with extended boundaries");
  } else if (extendedCanvas.originalState) {
    // Restore original interaction modes
    canvas.selection = extendedCanvas.originalState.selection;
    canvas.defaultCursor = extendedCanvas.originalState.defaultCursor;
    canvas.hoverCursor = extendedCanvas.originalState.hoverCursor;
    canvas.isDrawingMode = extendedCanvas.originalState.isDrawingMode;
    
    // Remove panning event handlers
    canvas.off('mouse:down');
    canvas.off('mouse:move');
    canvas.off('mouse:up');
    
    // Clear reference to original state and dragging state
    delete extendedCanvas.originalState;
    delete extendedCanvas.isDragging;
    delete extendedCanvas.lastPosX;
    delete extendedCanvas.lastPosY;
    
    logger.info("Panning mode disabled");
  }
  
  canvas.requestRenderAll();
};
