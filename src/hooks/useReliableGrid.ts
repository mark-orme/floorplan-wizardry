
/**
 * Hook for reliable grid management
 * @module hooks/useReliableGrid
 */
import { useCallback, useRef, useState } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { createSimpleGrid, clearGrid } from "@/utils/grid/gridBasics";
import { ensureGridVisibility } from "@/utils/grid/simpleGridCreator";
import logger from "@/utils/logger";

/**
 * Props for the useReliableGrid hook
 */
interface UseReliableGridProps {
  /** Reference to the fabric canvas */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
}

/**
 * Hook that provides reliable grid management
 * 
 * @param {UseReliableGridProps} props - Hook properties
 * @returns Grid management functions and state
 */
export const useReliableGrid = ({ 
  fabricCanvasRef 
}: UseReliableGridProps) => {
  const gridLayerRef = useRef<FabricObject[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const isCreatingRef = useRef(false);
  
  /**
   * Create grid on canvas
   */
  const createGrid = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || isCreatingRef.current) return [];
    
    try {
      isCreatingRef.current = true;
      logger.info("Creating grid in useReliableGrid");
      
      // Clear any existing grid first
      if (gridLayerRef.current.length > 0) {
        clearGrid(canvas, gridLayerRef.current);
        gridLayerRef.current = [];
      }
      
      // Create new grid
      const gridObjects = createSimpleGrid(canvas);
      
      if (gridObjects.length > 0) {
        gridLayerRef.current = gridObjects;
        setIsInitialized(true);
        logger.info(`Grid created with ${gridObjects.length} objects`);
      } else {
        logger.warn("No grid objects created");
        setIsInitialized(false);
      }
      
      return gridObjects;
    } catch (error) {
      logger.error("Error creating grid:", error);
      setIsInitialized(false);
      return [];
    } finally {
      isCreatingRef.current = false;
    }
  }, [fabricCanvasRef]);
  
  /**
   * Ensure grid visibility
   */
  const ensureVisibility = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return false;
    
    try {
      return ensureGridVisibility(canvas, gridLayerRef.current);
    } catch (error) {
      logger.error("Error ensuring grid visibility:", error);
      return false;
    }
  }, [fabricCanvasRef, gridLayerRef]);
  
  /**
   * Clear grid from canvas
   */
  const clearGridFromCanvas = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    try {
      clearGrid(canvas, gridLayerRef.current);
      gridLayerRef.current = [];
      setIsInitialized(false);
    } catch (error) {
      logger.error("Error clearing grid:", error);
    }
  }, [fabricCanvasRef]);
  
  return {
    gridLayerRef,
    createGrid,
    ensureVisibility,
    isInitialized,
    clearGrid: clearGridFromCanvas
  };
};
