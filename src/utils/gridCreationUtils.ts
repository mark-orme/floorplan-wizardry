
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
    
    const width = fabricCanvas.width || 800;
    const height = fabricCanvas.height || 600;
    
    // Create very basic grid lines directly
    for (let x = 0; x <= width; x += 100) {
      const line = new Line([x, 0, x, height], {
        stroke: '#CCDDEE',
        selectable: false,
        evented: false,
        strokeWidth: x % 500 === 0 ? 1.5 : 0.5
      });
      fabricCanvas.add(line);
      gridLayerRef.current.push(line);
    }
    
    for (let y = 0; y <= height; y += 100) {
      const line = new Line([0, y, width, y], {
        stroke: '#CCDDEE',
        selectable: false,
        evented: false,
        strokeWidth: y % 500 === 0 ? 1.5 : 0.5
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
  const delay = Math.min(Math.pow(1.3, attemptCount) * 100, 800);
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`Scheduling next grid attempt ${attemptCount + 1}/${maxAttempts} in ${delay}ms`);
  }
  
  setTimeout(() => {
    resetGridProgress();
    attemptFunction();
  }, delay);
};
