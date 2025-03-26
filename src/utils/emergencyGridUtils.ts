
/**
 * Emergency grid utilities for handling grid failure recovery
 * @module emergencyGridUtils
 */
import { Canvas as FabricCanvas, Object as FabricObject, Line } from "fabric";
import logger from "./logger";
import { GridCreationState } from "@/types/gridTypes";

// Typings for grid creation parameters
interface EmergencyGridOptions {
  width: number;
  height: number;
  smallGridSize: number;
  largeGridSize: number;
  smallGridColor: string;
  largeGridColor: string;
  smallGridOpacity: number;
  largeGridOpacity: number;
}

/**
 * Create a fallback grid when the primary grid creation fails
 * Uses a simplified approach to ensure at least basic grid appears
 * 
 * @param {FabricCanvas} canvas - The fabric canvas instance
 * @param {EmergencyGridOptions} options - Grid creation options
 * @returns {FabricObject[]} Created grid objects
 */
export const createEmergencyGrid = (
  canvas: FabricCanvas, 
  options: Partial<EmergencyGridOptions> = {}
): FabricObject[] => {
  if (!canvas) {
    logger.error("Emergency grid creation failed: Canvas is null");
    return [];
  }

  try {
    logger.warn("Using emergency grid creation as fallback");
    
    // Default options
    const {
      width = 2000,
      height = 2000,
      smallGridSize = 10,
      largeGridSize = 100,
      smallGridColor = "rgba(200,200,200,0.3)",
      largeGridColor = "rgba(150,150,150,0.5)",
      smallGridOpacity = 0.3,
      largeGridOpacity = 0.5
    } = options;
    
    const gridObjects: FabricObject[] = [];
    
    // Create minimal grid with just large grid lines for performance
    for (let i = 0; i <= width; i += largeGridSize) {
      const line = new Line([i, 0, i, height], {
        stroke: largeGridColor,
        selectable: false,
        evented: false,
        opacity: largeGridOpacity,
        strokeWidth: 1
      });
      gridObjects.push(line);
      canvas.add(line);
    }
    
    for (let i = 0; i <= height; i += largeGridSize) {
      const line = new Line([0, i, width, i], {
        stroke: largeGridColor,
        selectable: false,
        evented: false,
        opacity: largeGridOpacity,
        strokeWidth: 1
      });
      gridObjects.push(line);
      canvas.add(line);
    }
    
    logger.info(`Emergency grid created with ${gridObjects.length} lines`);
    canvas.requestRenderAll();
    
    return gridObjects;
  } catch (error) {
    logger.error("Emergency grid creation failed with error:", error);
    return [];
  }
};

/**
 * Reset grid creation state after failures
 * @param {GridCreationState} gridCreationState - Current grid creation state
 * @returns {GridCreationState} Reset grid creation state
 */
export const resetGridCreationState = (
  gridCreationState: GridCreationState
): GridCreationState => {
  return {
    ...gridCreationState,
    creationInProgress: false,
    lastAttemptTime: Date.now(),
    consecutiveResets: gridCreationState.consecutiveResets + 1,
    safetyTimeout: null
  };
};

/**
 * Determine if emergency grid creation should be triggered
 * @param {GridCreationState} gridCreationState - Current grid creation state
 * @returns {boolean} Whether emergency grid should be used
 */
export const shouldUseEmergencyGrid = (
  gridCreationState: GridCreationState
): boolean => {
  return (
    !gridCreationState.exists &&
    gridCreationState.consecutiveResets >= gridCreationState.maxConsecutiveResets
  );
};
