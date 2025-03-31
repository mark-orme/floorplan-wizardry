
/**
 * Hook for reliable grid management
 * @module hooks/useReliableGrid
 */
import { useCallback, useRef, useState } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { createBasicEmergencyGrid } from "@/utils/gridCreationUtils";
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
        gridLayerRef.current.forEach(obj => {
          if (canvas.contains(obj)) {
            canvas.remove(obj);
          }
        });
        gridLayerRef.current = [];
      }
      
      // Create new grid
      const gridObjects = createBasicEmergencyGrid(canvas);
      
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
      let fixesApplied = false;
      
      gridLayerRef.current.forEach(obj => {
        // Re-add if not on canvas
        if (!canvas.contains(obj)) {
          canvas.add(obj);
          canvas.sendToBack(obj);
          fixesApplied = true;
        }
        
        // Ensure visibility property is set
        if (!obj.visible) {
          obj.visible = true;
          fixesApplied = true;
        }
      });
      
      if (fixesApplied) {
        canvas.requestRenderAll();
      }
      
      return fixesApplied;
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
      gridLayerRef.current.forEach(obj => {
        if (canvas.contains(obj)) {
          canvas.remove(obj);
        }
      });
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
