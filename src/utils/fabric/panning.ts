
/**
 * Panning utilities for fabric.js canvas
 * Enables canvas panning/dragging with mouse
 * @module fabric/panning
 */
import { Canvas as FabricCanvas } from 'fabric';
import logger from '@/utils/logger';

/**
 * Enable panning/dragging on canvas
 * @param canvas - Canvas to enable panning on
 */
export const enableCanvasPanning = (canvas: FabricCanvas): void => {
  if (!canvas) {
    logger.error("Cannot enable panning on null canvas");
    return;
  }
  
  try {
    // Variables to track panning state
    let isPanning = false;
    let lastPosX = 0;
    let lastPosY = 0;
    
    // Disable selection to prevent interference with panning
    canvas.selection = false;
    
    // Setup mouse down event to start panning
    canvas.on('mouse:down', function(opt) {
      const evt = opt.e as MouseEvent;
      
      // Middle mouse button or holding space key
      if (evt.button === 1 || (evt.button === 0 && canvas.wrapperEl?.classList.contains('panning-mode'))) {
        isPanning = true;
        
        // Remember position
        lastPosX = evt.clientX;
        lastPosY = evt.clientY;
        
        // Change cursor
        canvas.defaultCursor = 'grabbing';
      }
    });
    
    // Setup mouse move event to perform panning
    canvas.on('mouse:move', function(opt) {
      if (isPanning) {
        const evt = opt.e as MouseEvent;
        
        // Get delta movement
        const deltaX = evt.clientX - lastPosX;
        const deltaY = evt.clientY - lastPosY;
        
        // Update last position
        lastPosX = evt.clientX;
        lastPosY = evt.clientY;
        
        // Move the canvas
        const vpt = canvas.viewportTransform!;
        vpt[4] += deltaX;
        vpt[5] += deltaY;
        
        // Render the change
        canvas.requestRenderAll();
      }
    });
    
    // Setup mouse up event to stop panning
    canvas.on('mouse:up', function() {
      isPanning = false;
      canvas.defaultCursor = 'default';
    });
    
    // Allow mouse wheel to work even when panning
    canvas.on('mouse:wheel', function(opt) {
      opt.e.preventDefault();
      opt.e.stopPropagation();
    });
    
    logger.info("Canvas panning enabled");
  } catch (error) {
    logger.error("Error enabling canvas panning:", error);
  }
};

/**
 * Disable panning/dragging on canvas
 * @param canvas - Canvas to disable panning on
 */
export const disableCanvasPanning = (canvas: FabricCanvas): void => {
  if (!canvas) {
    logger.error("Cannot disable panning on null canvas");
    return;
  }
  
  try {
    // Restore default canvas behavior
    canvas.selection = true;
    canvas.defaultCursor = 'default';
    
    // Remove event listeners
    canvas.off('mouse:down');
    canvas.off('mouse:move');
    canvas.off('mouse:up');
    
    logger.info("Canvas panning disabled");
  } catch (error) {
    logger.error("Error disabling canvas panning:", error);
  }
};
