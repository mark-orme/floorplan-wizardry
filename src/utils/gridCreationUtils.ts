
/**
 * Grid creation utilities
 * Provides helper functions for grid creation and retry operations
 * @module gridCreationUtils
 */
import { Canvas as FabricCanvas, Line } from "fabric";
import { resetGridProgress } from "./gridManager";

/**
 * Create basic grid lines directly on the canvas
 * Used as emergency fallback when regular grid creation fails
 * 
 * @param {FabricCanvas} canvas - The Fabric canvas instance
 * @param {React.MutableRefObject<any[]>} gridLayerRef - Reference to store grid objects
 * @returns {any[]} Created grid objects
 */
export const createBasicEmergencyGrid = (
  fabricCanvas: FabricCanvas,
  gridLayerRef: React.MutableRefObject<any[]>
): any[] => {
  if (process.env.NODE_ENV === 'development') {
    console.log("Creating basic emergency grid");
  }
  
  try {
    // Ensure gridLayerRef is initialized
    if (!gridLayerRef.current) {
      gridLayerRef.current = [];
    }
    
    const canvasWidth = fabricCanvas.width || 800;
    const canvasHeight = fabricCanvas.height || 600;
    
    // Create very basic grid lines directly
    for (let xPosition = 0; xPosition <= canvasWidth; xPosition += 100) {
      const line = new Line([xPosition, 0, xPosition, canvasHeight], {
        stroke: '#CCDDEE',
        selectable: false,
        evented: false,
        strokeWidth: xPosition % 500 === 0 ? 1.5 : 0.5
      });
      fabricCanvas.add(line);
      gridLayerRef.current.push(line);
    }
    
    for (let yPosition = 0; yPosition <= canvasHeight; yPosition += 100) {
      const line = new Line([0, yPosition, canvasWidth, yPosition], {
        stroke: '#CCDDEE',
        selectable: false,
        evented: false,
        strokeWidth: yPosition % 500 === 0 ? 1.5 : 0.5
      });
      fabricCanvas.add(line);
      gridLayerRef.current.push(line);
    }
    
    fabricCanvas.requestRenderAll();
    
    if (process.env.NODE_ENV === 'development') {
      console.log("Created basic emergency grid");
    }
    
    return gridLayerRef.current;
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Even emergency grid creation failed:", err);
    }
    return [];
  }
};

/**
 * Retry grid creation with exponential backoff
 * 
 * @param {Function} attemptFunction - The function to retry
 * @param {number} attemptCount - Current attempt count
 * @param {number} maxAttempts - Maximum number of attempts
 */
export const retryWithBackoff = (
  attemptFunction: () => void,
  attemptCount: number,
  maxAttempts: number = 12
): void => {
  if (attemptCount >= maxAttempts) return;
  
  // Calculate delay with exponential backoff, but capped at 800ms
  const delayMs = Math.min(Math.pow(1.3, attemptCount) * 100, 800);
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`Scheduling next grid attempt ${attemptCount + 1}/${maxAttempts} in ${delayMs}ms`);
  }
  
  setTimeout(() => {
    resetGridProgress();
    attemptFunction();
  }, delayMs);
};
