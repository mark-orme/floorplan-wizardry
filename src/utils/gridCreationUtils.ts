/**
 * Grid creation utilities
 * Provides helper functions for grid creation and retry operations
 * @module gridCreationUtils
 */
import { Canvas as FabricCanvas, Line } from "fabric";
import { resetGridProgress } from "./gridManager";
import logger from "./logger";
import {
  MAX_RETRY_ATTEMPTS,
  DEFAULT_THROTTLE_DELAY,
  RETRY_BACKOFF_FACTOR,
  MAX_RETRY_DELAY,
  LARGE_GRID,
  SMALL_GRID
} from "@/constants/numerics";

// Constants for grid configuration
const GRID_LINE_COLORS = {
  STANDARD: '#CCDDEE',
  MAJOR: '#4090CC'  // Changed to a more visible blue
};

const GRID_LINE_WIDTHS = {
  STANDARD: 0.5,
  MAJOR: 1.5
};

const GRID_SPACING = {
  SMALL: SMALL_GRID,  // 10px between grid lines (0.1m)
  MAJOR: LARGE_GRID   // 100px for major grid lines (1m)
};

const RETRY_CONFIG = {
  MAX_ATTEMPTS: MAX_RETRY_ATTEMPTS,
  BASE_DELAY: DEFAULT_THROTTLE_DELAY,
  GROWTH_FACTOR: RETRY_BACKOFF_FACTOR,
  MAX_DELAY: MAX_RETRY_DELAY
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
  logger.debug("Creating basic emergency grid");
  
  try {
    // Ensure gridLayerRef is initialized
    if (!gridLayerRef.current) {
      gridLayerRef.current = [];
    }
    
    // Clear any existing grid objects first
    if (gridLayerRef.current.length > 0) {
      gridLayerRef.current.forEach(obj => {
        if (fabricCanvas.contains(obj)) {
          fabricCanvas.remove(obj);
        }
      });
      gridLayerRef.current = [];
    }
    
    const canvasWidth = fabricCanvas.width || 1000;
    const canvasHeight = fabricCanvas.height || 800;
    
    // Create an extended grid that goes beyond canvas boundaries
    const gridObjects: any[] = [];
    const extensionFactor = 3;
    const extendedWidth = canvasWidth * extensionFactor;
    const extendedHeight = canvasHeight * extensionFactor;
    
    // Calculate grid bounds
    const startX = -canvasWidth;
    const startY = -canvasHeight;
    const endX = canvasWidth * 2;
    const endY = canvasHeight * 2;
    
    // Draw major grid lines first (every 100px)
    for (let x = startX; x <= endX; x += GRID_SPACING.MAJOR) {
      const line = new Line([x, startY, x, endY], {
        stroke: GRID_LINE_COLORS.MAJOR,
        selectable: false,
        evented: false,
        strokeWidth: GRID_LINE_WIDTHS.MAJOR,
        objectCaching: true
      });
      fabricCanvas.add(line);
      gridObjects.push(line);
    }
    
    for (let y = startY; y <= endY; y += GRID_SPACING.MAJOR) {
      const line = new Line([startX, y, endX, y], {
        stroke: GRID_LINE_COLORS.MAJOR,
        selectable: false,
        evented: false,
        strokeWidth: GRID_LINE_WIDTHS.MAJOR,
        objectCaching: true
      });
      fabricCanvas.add(line);
      gridObjects.push(line);
    }
    
    // Draw minor grid lines (every 10px)
    for (let x = startX; x <= endX; x += GRID_SPACING.SMALL) {
      // Skip if this is also a major grid line
      if (x % GRID_SPACING.MAJOR === 0) continue;
      
      const line = new Line([x, startY, x, endY], {
        stroke: GRID_LINE_COLORS.STANDARD,
        selectable: false,
        evented: false,
        strokeWidth: GRID_LINE_WIDTHS.STANDARD,
        objectCaching: true
      });
      fabricCanvas.add(line);
      gridObjects.push(line);
    }
    
    for (let y = startY; y <= endY; y += GRID_SPACING.SMALL) {
      // Skip if this is also a major grid line
      if (y % GRID_SPACING.MAJOR === 0) continue;
      
      const line = new Line([startX, y, endX, y], {
        stroke: GRID_LINE_COLORS.STANDARD,
        selectable: false,
        evented: false,
        strokeWidth: GRID_LINE_WIDTHS.STANDARD,
        objectCaching: true
      });
      fabricCanvas.add(line);
      gridObjects.push(line);
    }
    
    // Force a render
    fabricCanvas.requestRenderAll();
    
    // Update the gridLayerRef
    gridLayerRef.current = gridObjects;
    
    logger.debug(`Created emergency grid with ${gridObjects.length} lines`);
    
    return gridObjects;
  } catch (err) {
    logger.error("Error creating emergency grid:", err);
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
  
  logger.debug(`Scheduling next grid attempt ${attemptCount + 1}/${maxAttempts} in ${delayMs}ms`);
  
  setTimeout(() => {
    resetGridProgress();
    attemptFunction();
  }, delayMs);
};
