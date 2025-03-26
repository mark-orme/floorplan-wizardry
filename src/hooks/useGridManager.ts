
/**
 * Hook for managing canvas grid with reliability enhancements
 * @module useGridManager
 */
import { useEffect, useRef, useCallback } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { arrangeGridElementsWithRetry } from '@/utils/useCanvasLayerOrdering';
import logger from '@/utils/logger';

/**
 * Hook for reliable grid management 
 * @param fabricCanvasRef - Reference to the Fabric.js canvas
 * @param gridLayerRef - Reference to grid objects
 * @param createGrid - Function to create grid objects
 * @returns Grid management utilities
 */
export const useGridManager = (
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>,
  gridLayerRef: React.MutableRefObject<FabricObject[]>,
  createGrid: (canvas: FabricCanvas) => FabricObject[]
) => {
  const hasInitializedRef = useRef(false);
  const retryCountRef = useRef(0);
  const maxRetries = 5;
  
  /**
   * Initialize the grid with retry mechanism
   */
  const initializeGrid = useCallback(() => {
    if (!fabricCanvasRef.current) {
      if (retryCountRef.current < maxRetries) {
        logger.debug(`Grid initialization retry ${retryCountRef.current + 1}/${maxRetries}`);
        retryCountRef.current++;
        setTimeout(initializeGrid, 300);
      }
      return;
    }
    
    if (gridLayerRef.current.length === 0) {
      logger.debug('Creating new grid elements');
      const gridElements = createGrid(fabricCanvasRef.current);
      gridLayerRef.current = gridElements;
    }
    
    // Ensure grid elements are added and correctly arranged
    arrangeGridElementsWithRetry(fabricCanvasRef.current, gridLayerRef);
    hasInitializedRef.current = true;
  }, [fabricCanvasRef, gridLayerRef, createGrid]);
  
  /**
   * Refresh the grid's visibility
   */
  const refreshGrid = useCallback(() => {
    if (fabricCanvasRef.current && gridLayerRef.current.length > 0) {
      arrangeGridElementsWithRetry(fabricCanvasRef.current, gridLayerRef);
    } else if (fabricCanvasRef.current) {
      // If no grid exists but canvas does, create and initialize grid
      initializeGrid();
    }
  }, [fabricCanvasRef, gridLayerRef, initializeGrid]);
  
  // Initialize grid when component mounts
  useEffect(() => {
    if (!hasInitializedRef.current) {
      initializeGrid();
    }
    
    // Function to check and refresh grid periodically for robustness
    const intervalId = setInterval(() => {
      // Only run periodic check if not already initialized
      if (!hasInitializedRef.current) {
        initializeGrid();
      }
    }, 1000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [initializeGrid]);
  
  return {
    initializeGrid,
    refreshGrid,
    isInitialized: hasInitializedRef.current
  };
};

export default useGridManager;
