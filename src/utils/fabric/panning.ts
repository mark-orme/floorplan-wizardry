
/**
 * Fabric panning utilities
 * Functions for enabling and managing canvas panning
 * @module fabric/panning
 */
import { Canvas as FabricCanvas, TPointerEventInfo, TPointerEvent } from "fabric";
import logger from "@/utils/logger";
import { isCanvasValid } from "./canvasValidation";

/**
 * Handler data for panning
 * @interface PanHandlers
 */
interface PanHandlers {
  /** Mouse down handler */
  mouseDown: (e: TPointerEventInfo<TPointerEvent>) => void;
  /** Mouse move handler */
  mouseMove: (e: TPointerEventInfo<TPointerEvent>) => void;
  /** Mouse up handler */
  mouseUp: () => void;
}

/**
 * Enable panning on a canvas
 * @param {FabricCanvas | null | undefined} canvas - Fabric canvas instance
 * @param {string} panKey - Key to hold for panning (e.g., "space")
 * @returns {boolean} Whether panning was successfully enabled
 */
export const enablePanning = (
  canvas: FabricCanvas | null | undefined,
  panKey: string = "space"
): boolean => {
  if (!isCanvasValid(canvas)) {
    return false;
  }
  
  try {
    // Check if panning is already enabled
    if ((canvas as any)._panningEnabled) {
      return true;
    }
    
    let isPanning = false;
    let lastPosX = 0;
    let lastPosY = 0;
    let isPanKeyDown = false;
    
    // Keyboard event handlers
    const keyDownHandler = (e: KeyboardEvent) => {
      if (e.key === panKey) {
        isPanKeyDown = true;
        canvas!.defaultCursor = 'grab';
      }
    };
    
    const keyUpHandler = (e: KeyboardEvent) => {
      if (e.key === panKey) {
        isPanKeyDown = false;
        canvas!.defaultCursor = 'default';
      }
    };
    
    // Mouse event handlers for panning
    const mouseDown = (e: TPointerEventInfo<TPointerEvent>) => {
      if (isPanKeyDown || canvas!.isDrawingMode === false) {
        isPanning = true;
        lastPosX = e.pointer!.x;
        lastPosY = e.pointer!.y;
        canvas!.defaultCursor = 'grabbing';
      }
    };
    
    const mouseMove = (e: TPointerEventInfo<TPointerEvent>) => {
      if (isPanning) {
        // Calculate how much to move the canvas
        const deltaX = e.pointer!.x - lastPosX;
        const deltaY = e.pointer!.y - lastPosY;
        
        // Update last position
        lastPosX = e.pointer!.x;
        lastPosY = e.pointer!.y;
        
        // Move the canvas
        const vpt = canvas!.viewportTransform;
        if (vpt) {
          vpt[4] += deltaX;
          vpt[5] += deltaY;
          canvas!.requestRenderAll();
          
          // Fire custom event for panning
          canvas!.fire('panning', { x: deltaX, y: deltaY });
        }
      }
    };
    
    const mouseUp = () => {
      isPanning = false;
      canvas!.defaultCursor = isPanKeyDown ? 'grab' : 'default';
    };
    
    // Add event listeners
    canvas!.on('mouse:down', mouseDown);
    canvas!.on('mouse:move', mouseMove);
    canvas!.on('mouse:up', mouseUp);
    
    // Add keyboard event listeners
    window.addEventListener('keydown', keyDownHandler);
    window.addEventListener('keyup', keyUpHandler);
    
    // Store handlers for cleanup
    (canvas as any)._panHandlers = {
      mouseDown,
      mouseMove,
      mouseUp,
      keyDown: keyDownHandler,
      keyUp: keyUpHandler
    };
    
    // Mark panning as enabled
    (canvas as any)._panningEnabled = true;
    
    logger.info("Panning enabled on canvas");
    return true;
  } catch (error) {
    logger.error("Error enabling panning:", error);
    return false;
  }
};

/**
 * Disable panning on a canvas
 * @param {FabricCanvas | null | undefined} canvas - Fabric canvas instance
 * @returns {boolean} Whether panning was successfully disabled
 */
export const disablePanning = (
  canvas: FabricCanvas | null | undefined
): boolean => {
  if (!isCanvasValid(canvas)) {
    return false;
  }
  
  try {
    // Check if panning is enabled
    if (!(canvas as any)._panningEnabled) {
      return true;
    }
    
    // Get handlers
    const handlers = (canvas as any)._panHandlers;
    
    if (handlers) {
      // Remove canvas event listeners
      canvas!.off('mouse:down', handlers.mouseDown);
      canvas!.off('mouse:move', handlers.mouseMove);
      canvas!.off('mouse:up', handlers.mouseUp);
      
      // Remove keyboard event listeners
      window.removeEventListener('keydown', handlers.keyDown);
      window.removeEventListener('keyup', handlers.keyUp);
      
      // Remove handler references
      delete (canvas as any)._panHandlers;
      
      // Mark panning as disabled
      (canvas as any)._panningEnabled = false;
      
      // Reset cursor
      canvas!.defaultCursor = 'default';
      
      logger.info("Panning disabled on canvas");
      return true;
    }
    
    return false;
  } catch (error) {
    logger.error("Error disabling panning:", error);
    return false;
  }
};

/**
 * Check if panning is enabled on a canvas
 * @param {FabricCanvas | null | undefined} canvas - Fabric canvas instance
 * @returns {boolean} Whether panning is enabled
 */
export const isPanningEnabled = (
  canvas: FabricCanvas | null | undefined
): boolean => {
  if (!isCanvasValid(canvas)) {
    return false;
  }
  
  return (canvas as any)._panningEnabled === true;
};
