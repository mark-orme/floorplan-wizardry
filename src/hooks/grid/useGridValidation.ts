
/**
 * Hook for grid validation operations
 * Provides utilities to validate grid creation parameters and results
 * @module useGridValidation
 */
import { useCallback } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import logger from "@/utils/logger";

/**
 * Hook for grid validation operations
 * Ensures grid parameters and creations are valid
 * 
 * @returns Object containing validation utility functions
 */
export const useGridValidation = () => {
  /**
   * Validate grid creation parameters
   * Ensures required parameters for grid creation are valid
   * 
   * @param {FabricCanvas | null} canvas - The Fabric canvas instance
   * @param {number} gridSpacing - Grid spacing in pixels
   * @param {number} canvasWidth - Canvas width in pixels
   * @param {number} canvasHeight - Canvas height in pixels
   * @returns {boolean} True if parameters are valid, false otherwise
   */
  const validateGridParameters = useCallback((
    canvas: FabricCanvas | null,
    gridSpacing: number,
    canvasWidth: number,
    canvasHeight: number
  ): boolean => {
    // Check if canvas is available
    if (!canvas) {
      logger.warn("Cannot validate grid parameters: Canvas is null");
      return false;
    }
    
    // Check if grid spacing is valid
    if (gridSpacing <= 0) {
      logger.warn(`Invalid grid spacing: ${gridSpacing}`);
      return false;
    }
    
    // Check if canvas dimensions are valid
    if (canvasWidth <= 0 || canvasHeight <= 0) {
      logger.warn(`Invalid canvas dimensions: ${canvasWidth}x${canvasHeight}`);
      return false;
    }
    
    return true;
  }, []);
  
  /**
   * Validate grid creation result
   * Ensures grid was created successfully and contains the expected objects
   * 
   * @param {FabricObject[]} gridObjects - Grid objects created
   * @param {number} expectedCount - Expected number of grid objects
   * @returns {boolean} True if grid creation was successful, false otherwise
   */
  const validateGridCreation = useCallback((
    gridObjects: FabricObject[],
    expectedCount: number = 0
  ): boolean => {
    // Check if grid objects array exists
    if (!Array.isArray(gridObjects)) {
      logger.warn("Grid objects is not an array");
      return false;
    }
    
    // If expectedCount is provided, check if the grid has the expected number of objects
    if (expectedCount > 0 && gridObjects.length !== expectedCount) {
      logger.warn(`Expected ${expectedCount} grid objects, but got ${gridObjects.length}`);
      return false;
    }
    
    // Ensure grid has at least some objects
    if (gridObjects.length === 0) {
      logger.warn("Grid contains no objects");
      return false;
    }
    
    return true;
  }, []);

  /**
   * Validate grid components
   * Ensures all necessary grid components are available
   * 
   * @returns {boolean} True if grid components are valid
   */
  const validateGridComponents = useCallback((): boolean => {
    // In a real implementation, this would validate grid components
    // For now, just returning true as a placeholder
    return true;
  }, []);

  /**
   * Ensure grid layer is initialized
   * Checks if the grid layer reference is properly initialized
   * 
   * @param {any} gridLayerRef - Reference to grid layer
   * @returns {boolean} True if grid layer is initialized
   */
  const ensureGridLayerInitialized = useCallback((gridLayerRef: any): boolean => {
    return !!gridLayerRef && Array.isArray(gridLayerRef.current);
  }, []);

  return {
    validateGridParameters,
    validateGridCreation,
    validateGridComponents,
    ensureGridLayerInitialized
  };
};
