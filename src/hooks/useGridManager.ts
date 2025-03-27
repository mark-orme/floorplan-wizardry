
/**
 * Hook for managing canvas grid with reliability enhancements
 * @module useGridManager
 */
import { useEffect, useRef, useCallback, useState } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { arrangeGridElementsWithRetry } from '@/utils/useCanvasLayerOrdering';
import logger from '@/utils/logger';
import { throttle } from '@/utils/throttleUtils';

// Constants for grid management
const GRID_REFRESH_INTERVAL = 1000; // Minimum time between grid refreshes in ms
const MAX_RETRIES = 5;
const RETRY_DELAY = 300;

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
  const lastRefreshTimeRef = useRef(0);
  const [isInitialized, setIsInitialized] = useState(false);
  
  /**
   * Throttled grid refresh function
   * Prevents excessive grid recalculations
   */
  const throttledRefreshGrid = useCallback(
    throttle(() => {
      if (fabricCanvasRef.current && gridLayerRef.current.length > 0) {
        arrangeGridElementsWithRetry(fabricCanvasRef.current, gridLayerRef);
        lastRefreshTimeRef.current = Date.now();
        logger.debug('Grid refreshed (throttled)');
      } else if (fabricCanvasRef.current) {
        // If no grid exists but canvas does, create and initialize grid
        initializeGrid();
        lastRefreshTimeRef.current = Date.now();
      }
    }, GRID_REFRESH_INTERVAL),
    [fabricCanvasRef, gridLayerRef]
  );
  
  /**
   * Initialize the grid with retry mechanism
   */
  const initializeGrid = useCallback(() => {
    if (!fabricCanvasRef.current) {
      if (retryCountRef.current < MAX_RETRIES) {
        logger.debug(`Grid initialization retry ${retryCountRef.current + 1}/${MAX_RETRIES}`);
        retryCountRef.current++;
        setTimeout(initializeGrid, RETRY_DELAY);
      }
      return;
    }
    
    // Skip initialization if already done recently
    const now = Date.now();
    if (now - lastRefreshTimeRef.current < GRID_REFRESH_INTERVAL && gridLayerRef.current.length > 0) {
      logger.debug('Skipping grid initialization - too soon after last refresh');
      return;
    }
    
    if (gridLayerRef.current.length === 0) {
      logger.debug('Creating new grid elements');
      try {
        const gridElements = createGrid(fabricCanvasRef.current);
        gridLayerRef.current = gridElements;
        lastRefreshTimeRef.current = now;
      } catch (error) {
        logger.error('Error creating grid elements:', error);
        if (retryCountRef.current < MAX_RETRIES) {
          retryCountRef.current++;
          setTimeout(initializeGrid, RETRY_DELAY);
          return;
        }
      }
    }
    
    // Ensure grid elements are added and correctly arranged
    arrangeGridElementsWithRetry(fabricCanvasRef.current, gridLayerRef);
    hasInitializedRef.current = true;
    setIsInitialized(true);
  }, [fabricCanvasRef, gridLayerRef, createGrid]);
  
  /**
   * Refresh the grid's visibility with throttling
   */
  const refreshGrid = useCallback(() => {
    throttledRefreshGrid();
  }, [throttledRefreshGrid]);
  
  // Initialize grid when component mounts
  useEffect(() => {
    if (!hasInitializedRef.current) {
      initializeGrid();
    }
    
    // Function to check and refresh grid periodically for robustness
    // but with reduced frequency to avoid performance issues
    const intervalId = setInterval(() => {
      // Only run periodic check if not already initialized
      if (!hasInitializedRef.current) {
        initializeGrid();
      }
    }, 2000); // Longer interval for periodic checks
    
    return () => {
      clearInterval(intervalId);
    };
  }, [initializeGrid]);
  
  // Cleanup function for grid elements
  const cleanupGrid = useCallback(() => {
    if (fabricCanvasRef.current && gridLayerRef.current.length > 0) {
      logger.debug(`Cleaning up ${gridLayerRef.current.length} grid elements`);
      
      // Remove all grid elements from canvas
      gridLayerRef.current.forEach(obj => {
        if (fabricCanvasRef.current?.contains(obj)) {
          fabricCanvasRef.current.remove(obj);
        }
      });
      
      // Clear the grid layer reference
      gridLayerRef.current = [];
      hasInitializedRef.current = false;
      setIsInitialized(false);
    }
  }, [fabricCanvasRef, gridLayerRef]);
  
  return {
    initializeGrid,
    refreshGrid,
    cleanupGrid,
    isInitialized
  };
};

export default useGridManager;
