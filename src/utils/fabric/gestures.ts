
/**
 * Fabric gesture utilities
 * Functions for handling touch gestures
 * @module fabric/gestures
 */
import { Canvas as FabricCanvas } from "fabric";
import logger from "@/utils/logger";
import { isCanvasValid } from "./canvasValidation";

/**
 * Add pinch-to-zoom functionality to canvas
 * @param {FabricCanvas | null | undefined} canvas - Fabric canvas instance
 * @returns {boolean} Whether the operation was successful
 */
export const addPinchToZoom = (
  canvas: FabricCanvas | null | undefined
): boolean => {
  if (!isCanvasValid(canvas)) {
    return false;
  }
  
  try {
    let initialDistance = 0;
    let initialZoom = 1;
    
    // Touch start handler
    const touchStartHandler = (e: TouchEvent) => {
      if (e.touches && e.touches.length === 2) {
        // Calculate initial distance between touch points
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        initialDistance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) +
          Math.pow(touch2.clientY - touch1.clientY, 2)
        );
        
        // Store initial zoom
        initialZoom = canvas!.getZoom();
        
        // Prevent default to avoid unwanted behavior
        e.preventDefault();
      }
    };
    
    // Touch move handler
    const touchMoveHandler = (e: TouchEvent) => {
      if (e.touches && e.touches.length === 2) {
        // Calculate current distance
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const currentDistance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) +
          Math.pow(touch2.clientY - touch1.clientY, 2)
        );
        
        // Calculate zoom ratio
        const zoomRatio = currentDistance / initialDistance;
        const newZoom = initialZoom * zoomRatio;
        
        // Apply zoom, clamped to reasonable limits
        const clampedZoom = Math.min(Math.max(newZoom, 0.5), 10);
        
        // Calculate center point
        const centerX = (touch1.clientX + touch2.clientX) / 2;
        const centerY = (touch1.clientY + touch2.clientY) / 2;
        
        // Zoom to point
        const point = {
          x: centerX,
          y: centerY
        };
        
        // Get position of point on canvas
        const canvasElement = canvas!.getElement() as HTMLCanvasElement;
        const rect = canvasElement.getBoundingClientRect();
        const canvasPoint = {
          x: (point.x - rect.left) / canvas!.getZoom(),
          y: (point.y - rect.top) / canvas!.getZoom()
        };
        
        // Set zoom
        canvas!.zoomToPoint(canvasPoint, clampedZoom);
        
        // Prevent default to avoid unwanted behavior
        e.preventDefault();
      }
    };
    
    // Get canvas element
    const canvasElement = canvas!.getElement() as HTMLCanvasElement;
    
    // Add event listeners
    canvasElement.addEventListener('touchstart', touchStartHandler);
    canvasElement.addEventListener('touchmove', touchMoveHandler);
    
    // Store references to handlers for potential cleanup
    (canvas as any)._pinchHandlers = {
      touchStart: touchStartHandler,
      touchMove: touchMoveHandler
    };
    
    logger.info("Pinch-to-zoom functionality added to canvas");
    return true;
  } catch (error) {
    logger.error("Error adding pinch-to-zoom:", error);
    return false;
  }
};

/**
 * Remove pinch-to-zoom functionality
 * @param {FabricCanvas | null | undefined} canvas - Fabric canvas instance
 * @returns {boolean} Whether the operation was successful
 */
export const removePinchToZoom = (
  canvas: FabricCanvas | null | undefined
): boolean => {
  if (!isCanvasValid(canvas)) {
    return false;
  }
  
  try {
    // Get handlers
    const handlers = (canvas as any)._pinchHandlers;
    
    if (handlers) {
      // Get canvas element
      const canvasElement = canvas!.getElement() as HTMLCanvasElement;
      
      // Remove event listeners
      canvasElement.removeEventListener('touchstart', handlers.touchStart);
      canvasElement.removeEventListener('touchmove', handlers.touchMove);
      
      // Remove handler references
      delete (canvas as any)._pinchHandlers;
      
      logger.info("Pinch-to-zoom functionality removed from canvas");
      return true;
    }
    
    return false;
  } catch (error) {
    logger.error("Error removing pinch-to-zoom:", error);
    return false;
  }
};
