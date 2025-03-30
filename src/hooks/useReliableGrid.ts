
/**
 * Reliable grid hook
 * Provides utilities for creating and maintaining a reliable grid
 * @module hooks/useReliableGrid
 */
import { useCallback, useEffect, useRef } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { createReliableGrid, ensureGridVisibility } from '@/utils/grid/simpleGridCreator';
import logger from '@/utils/logger';

/**
 * Props for useReliableGrid hook
 */
interface UseReliableGridProps {
  /** Reference to the fabric canvas */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Current zoom level */
  zoomLevel?: number;
  /** Whether to create grid immediately */
  createImmediately?: boolean;
  /** Whether to auto-fix grid issues */
  autoFix?: boolean;
  /** Interval for checking grid in ms */
  checkInterval?: number;
}

/**
 * Hook for managing a reliable grid on canvas
 * 
 * @param {UseReliableGridProps} props - Hook properties
 * @returns Grid management utilities
 */
export const useReliableGrid = ({
  fabricCanvasRef,
  zoomLevel = 1,
  createImmediately = true,
  autoFix = true,
  checkInterval = 5000
}: UseReliableGridProps) => {
  // Reference to store grid objects
  const gridLayerRef = useRef<FabricObject[]>([]);
  
  // Track if grid is initialized
  const gridInitializedRef = useRef(false);
  
  // Create grid function
  const createGrid = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) {
      logger.warn('Cannot create grid: Canvas is null');
      return [];
    }
    
    try {
      const gridObjects = createReliableGrid(canvas, gridLayerRef);
      
      if (gridObjects.length > 0) {
        gridInitializedRef.current = true;
        logger.info(`Grid created with ${gridObjects.length} objects`);
      } else {
        logger.warn('Failed to create grid, no objects returned');
      }
      
      return gridObjects;
    } catch (error) {
      logger.error('Error creating grid:', error);
      return [];
    }
  }, [fabricCanvasRef]);
  
  // Ensure grid visibility
  const ensureVisibility = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return false;
    
    return ensureGridVisibility(canvas, gridLayerRef);
  }, [fabricCanvasRef]);
  
  // Setup auto-fix interval
  useEffect(() => {
    if (!autoFix) return;
    
    const intervalId = setInterval(() => {
      if (gridInitializedRef.current && fabricCanvasRef.current) {
        ensureVisibility();
      }
    }, checkInterval);
    
    return () => clearInterval(intervalId);
  }, [autoFix, checkInterval, ensureVisibility, fabricCanvasRef]);
  
  // Create grid immediately if requested
  useEffect(() => {
    if (createImmediately && fabricCanvasRef.current && !gridInitializedRef.current) {
      // Small delay to ensure canvas is ready
      const timeoutId = setTimeout(() => {
        createGrid();
      }, 200);
      
      return () => clearTimeout(timeoutId);
    }
  }, [createImmediately, createGrid, fabricCanvasRef]);
  
  // Recreate grid when zoom changes significantly
  useEffect(() => {
    if (gridInitializedRef.current && fabricCanvasRef.current) {
      // Only recreate grid on significant zoom changes
      if (zoomLevel <= 0.5 || zoomLevel >= 2) {
        createGrid();
      }
    }
  }, [zoomLevel, createGrid, fabricCanvasRef]);
  
  return {
    gridLayerRef,
    createGrid,
    ensureVisibility,
    isInitialized: gridInitializedRef.current,
    clearGrid: useCallback(() => {
      const canvas = fabricCanvasRef.current;
      if (!canvas) return;
      
      gridLayerRef.current.forEach(obj => {
        if (canvas.contains(obj)) {
          canvas.remove(obj);
        }
      });
      
      gridLayerRef.current = [];
      gridInitializedRef.current = false;
      canvas.requestRenderAll();
    }, [fabricCanvasRef])
  };
};
