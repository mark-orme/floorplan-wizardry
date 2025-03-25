
/**
 * Grid creation utilities
 * Provides helper functions for grid creation and retry operations
 * @module gridCreationUtils
 */
import { Canvas as FabricCanvas, Line } from "fabric";
import { resetGridProgress } from "./gridManager";

// Constants for grid configuration
const GRID_LINE_COLORS = {
  STANDARD: '#CCDDEE',
  MAJOR: '#CCDDEE'
};

const GRID_LINE_WIDTHS = {
  STANDARD: 0.5,
  MAJOR: 1.5
};

const GRID_SPACING = {
  SMALL: 100,  // 100px between grid lines
  MAJOR: 500   // 500px for major grid lines
};

const RETRY_CONFIG = {
  MAX_ATTEMPTS: 12,
  BASE_DELAY: 100,  // Base delay in ms
  GROWTH_FACTOR: 1.3,  // Exponential growth factor
  MAX_DELAY: 800  // Maximum delay cap in ms
};

/**
 * Create basic grid lines directly on the canvas
 * Used as emergency fallback when regular grid creation fails
 * 
 * @param {FabricCanvas} fabricCanvas - The Fabric canvas instance
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
    for (let xPosition = 0; xPosition <= canvasWidth; xPosition += GRID_SPACING.SMALL) {
      const line = new Line([xPosition, 0, xPosition, canvasHeight], {
        stroke: GRID_LINE_COLORS.STANDARD,
        selectable: false,
        evented: false,
        strokeWidth: xPosition % GRID_SPACING.MAJOR === 0 ? GRID_LINE_WIDTHS.MAJOR : GRID_LINE_WIDTHS.STANDARD
      });
      fabricCanvas.add(line);
      gridLayerRef.current.push(line);
    }
    
    for (let yPosition = 0; yPosition <= canvasHeight; yPosition += GRID_SPACING.SMALL) {
      const line = new Line([0, yPosition, canvasWidth, yPosition], {
        stroke: GRID_LINE_COLORS.STANDARD,
        selectable: false,
        evented: false,
        strokeWidth: yPosition % GRID_SPACING.MAJOR === 0 ? GRID_LINE_WIDTHS.MAJOR : GRID_LINE_WIDTHS.STANDARD
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
  maxAttempts: number = RETRY_CONFIG.MAX_ATTEMPTS
): void => {
  if (attemptCount >= maxAttempts) return;
  
  // Calculate delay with exponential backoff, but capped at maximum delay
  const delayMs = Math.min(
    Math.pow(RETRY_CONFIG.GROWTH_FACTOR, attemptCount) * RETRY_CONFIG.BASE_DELAY, 
    RETRY_CONFIG.MAX_DELAY
  );
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`Scheduling next grid attempt ${attemptCount + 1}/${maxAttempts} in ${delayMs}ms`);
  }
  
  setTimeout(() => {
    resetGridProgress();
    attemptFunction();
  }, delayMs);
};
