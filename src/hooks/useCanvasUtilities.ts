
/**
 * Canvas utilities hook
 * Provides reusable functions for canvas operations
 * @module useCanvasUtilities
 */
import { useCallback } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import logger from '@/utils/logger';
import { toast } from 'sonner';

/**
 * Hook that provides utility functions for canvas operations
 * @returns Collection of canvas utility functions
 */
export const useCanvasUtilities = () => {
  /**
   * Safely get all objects from canvas excluding grid elements
   * @param {FabricCanvas | null} canvas - The fabric canvas
   * @param {FabricObject[]} gridElements - Grid elements to exclude
   * @returns {FabricObject[]} Canvas objects excluding grid
   */
  const getCanvasObjectsExcludingGrid = useCallback(
    (canvas: FabricCanvas | null, gridElements: FabricObject[]): FabricObject[] => {
      if (!canvas) return [];
      
      const allObjects = canvas.getObjects();
      
      // Create a Set of grid object IDs for efficient lookups
      const gridIds = new Set(gridElements.map(obj => obj.id));
      
      // Filter out grid elements
      return allObjects.filter(obj => !gridIds.has(obj.id));
    },
    []
  );
  
  /**
   * Safely execute a canvas operation with error handling
   * @param {FabricCanvas | null} canvas - The fabric canvas
   * @param {() => void} operation - The operation to execute
   * @param {string} errorMessage - Error message if operation fails
   * @returns {boolean} Whether the operation was successful
   */
  const safeCanvasOperation = useCallback(
    (canvas: FabricCanvas | null, operation: () => void, errorMessage: string): boolean => {
      if (!canvas) {
        logger.warn(`Cannot perform canvas operation: ${errorMessage}`);
        return false;
      }
      
      try {
        operation();
        return true;
      } catch (error) {
        logger.error(`${errorMessage}:`, error);
        toast.error(`Error: ${errorMessage}`);
        return false;
      }
    },
    []
  );
  
  /**
   * Safely get canvas dimensions
   * @param {FabricCanvas | null} canvas - The fabric canvas
   * @returns {{ width: number, height: number }} Canvas dimensions
   */
  const getCanvasDimensions = useCallback(
    (canvas: FabricCanvas | null): { width: number, height: number } => {
      if (!canvas) return { width: 0, height: 0 };
      
      return {
        width: canvas.getWidth() || 0,
        height: canvas.getHeight() || 0
      };
    },
    []
  );
  
  /**
   * Check if canvas is valid and ready
   * @param {FabricCanvas | null} canvas - The fabric canvas
   * @returns {boolean} Whether the canvas is valid and ready
   */
  const isCanvasReady = useCallback(
    (canvas: FabricCanvas | null): boolean => {
      if (!canvas) return false;
      
      // Check if key canvas properties exist
      return (
        typeof canvas.getWidth === 'function' &&
        typeof canvas.getHeight === 'function' &&
        typeof canvas.getObjects === 'function' &&
        canvas.getWidth() > 0 &&
        canvas.getHeight() > 0
      );
    },
    []
  );
  
  return {
    getCanvasObjectsExcludingGrid,
    safeCanvasOperation,
    getCanvasDimensions,
    isCanvasReady
  };
};
