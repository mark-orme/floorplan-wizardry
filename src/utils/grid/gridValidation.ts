
/**
 * Grid validation module
 * Provides validation functions for grid creation
 * @module gridValidation
 */
import { Canvas } from "fabric";
import { ObjectId } from "@/types/fabricTypes";
import { gridManager, shouldThrottleCreation } from "../gridManager";
import logger from "../logger";

/**
 * Type-safe validation result interface
 */
export interface ValidationResult {
  valid: boolean;
  message?: string;
  details?: Record<string, unknown>;
}

/**
 * Validates the canvas and dimensions for grid creation
 * Ensures all required parameters are valid before proceeding
 * 
 * @param {Canvas | null} canvas - The Fabric canvas instance
 * @param {React.MutableRefObject<any[]> | null} gridLayerRef - Reference to store grid objects
 * @param {{ width: number, height: number }} canvasDimensions - Current canvas dimensions
 * @returns {ValidationResult} Validation result with status and message
 */
export const validateCanvasForGrid = (
  canvas: Canvas | null,
  gridLayerRef: React.MutableRefObject<any[]> | null,
  canvasDimensions: { width: number, height: number }
): ValidationResult => {
  // Basic validation
  if (!canvas) {
    return { 
      valid: false, 
      message: "Canvas is null in grid validation"
    };
  }
  
  if (!gridLayerRef) {
    return { 
      valid: false, 
      message: "Grid layer reference is null in grid validation"
    };
  }

  // Ensure valid dimensions
  if (!canvasDimensions.width || !canvasDimensions.height || 
      canvasDimensions.width <= 0 || canvasDimensions.height <= 0) {
    return { 
      valid: false, 
      message: "Invalid dimensions in grid validation",
      details: canvasDimensions
    };
  }
  
  // Check if we should throttle
  if (shouldThrottleCreation()) {
    return { 
      valid: false, 
      message: "Throttling grid creation due to too many recent attempts"
    };
  }
  
  return { valid: true };
};

/**
 * Check if the current grid creation state allows proceeding
 * Verifies that creation is not in progress and throttling is not active
 * 
 * @returns {ValidationResult} Whether grid creation can proceed
 */
export const canProceedWithGridCreation = (): ValidationResult => {
  // Check if creation is already in progress
  if (gridManager.creationInProgress) {
    return {
      valid: false,
      message: "Grid creation already in progress, cannot proceed"
    };
  }
  
  // Check if we need to throttle
  if (shouldThrottleCreation()) {
    return {
      valid: false,
      message: "Grid creation throttled, cannot proceed", 
      details: {
        lastAttemptTime: gridManager.lastAttemptTime,
        throttleInterval: gridManager.throttleInterval,
        currentTime: Date.now()
      }
    };
  }
  
  return { valid: true };
};

/**
 * Type-safe function to check if an object is a grid element
 * @param {unknown} obj - Object to check
 * @param {ObjectId[]} gridIds - Array of grid element IDs
 * @returns {boolean} Whether the object is a grid element
 */
export const isGridElement = (obj: unknown, gridIds: ObjectId[]): boolean => {
  if (!obj || typeof obj !== 'object') {
    return false;
  }
  
  // Type-safe approach to check for id property
  if (!('id' in obj)) {
    return false;
  }
  
  const objId = (obj as { id?: unknown }).id;
  if (objId === undefined || objId === null) {
    return false;
  }
  
  return gridIds.includes(objId as ObjectId);
};
