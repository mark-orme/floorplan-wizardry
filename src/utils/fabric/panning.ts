/**
 * Panning utilities for Fabric.js canvas
 * Handles canvas panning with mouse and touch interactions
 * @module fabric/panning
 */
import { Canvas as FabricCanvas } from "fabric";
import logger from "@/utils/logger";

/**
 * Enable panning on a canvas
 * @param canvas - Canvas to enable panning on
 */
export const enableCanvasPanning = (canvas: FabricCanvas): void => {
  if (!canvas) {
    logger.error("Cannot enable panning on null canvas");
    return;
  }
  
  try {
    const panState = {
      isPanning: false,
      lastPosX: 0,
      lastPosY: 0,
      panningEnabled: true
    };
    
    // Store the state on the canvas object for access in event handlers
    (canvas as any).panState = panState;
    
    // Mouse down event - start panning
    canvas.on('mouse:down', (opt) => {
      const evt = opt.e;
      if (!panState.panningEnabled) return;
      
      // Only pan with middle mouse button or when 'alt' key is held
      const isMiddleButton = evt.button === 1;
      const isAltKey = evt.altKey;
      const isSpaceKey = isSpaceKeyPressed();
      
      if (isMiddleButton || isAltKey || isSpaceKey) {
        panState.isPanning = true;
        canvas.selection = false;
        canvas.setCursor('grab');
        
        // Save starting positions
        panState.lastPosX = evt.clientX || 0;
        panState.lastPosY = evt.clientY || 0;
        
        // Prevent default to avoid selecting text while panning
        evt.preventDefault();
      }
    });
    
    // Mouse move event - update canvas position while panning
    canvas.on('mouse:move', (opt) => {
      const evt = opt.e;
      if (!panState.isPanning) return;
      
      // Calculate how much the mouse has moved
      const currentClientX = evt.clientX || 0;
      const currentClientY = evt.clientY || 0;
      
      const deltaX = currentClientX - panState.lastPosX;
      const deltaY = currentClientY - panState.lastPosY;
      
      // Update the last position
      panState.lastPosX = currentClientX;
      panState.lastPosY = currentClientY;
      
      // Apply the delta to the viewport transform
      const vpt = canvas.viewportTransform!;
      vpt[4] += deltaX;
      vpt[5] += deltaY;
      
      // Render changes
      canvas.requestRenderAll();
      
      // Prevent default to avoid selecting text while panning
      evt.preventDefault();
    });
    
    // Mouse up event - stop panning
    canvas.on('mouse:up', () => {
      panState.isPanning = false;
      canvas.selection = true;
      canvas.setCursor('default');
    });
    
    logger.info("Canvas panning enabled");
  } catch (error) {
    logger.error("Error enabling canvas panning:", error);
  }
};

/**
 * Disable panning on a canvas
 * @param canvas - Canvas to disable panning on
 */
export const disableCanvasPanning = (canvas: FabricCanvas): void => {
  if (!canvas) return;
  
  try {
    const panState = (canvas as any).panState;
    if (panState) {
      panState.panningEnabled = false;
    }
    
    logger.info("Canvas panning disabled");
  } catch (error) {
    logger.error("Error disabling canvas panning:", error);
  }
};

/**
 * Check if the space key is currently pressed
 */
const isSpaceKeyPressed = (): boolean => {
  // We can't reliably track key state across events,
  // but we keep this function for future improvements
  return false;
};
