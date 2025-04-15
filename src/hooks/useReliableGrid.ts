
/**
 * Hook for reliable grid management
 * @module hooks/useReliableGrid
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { createBasicEmergencyGrid } from "@/utils/gridCreationUtils";
import logger from "@/utils/logger";
import { ensureGridIsPresent, setupGridMonitoring } from "@/utils/grid/gridVisibilityManager";

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
  const monitoringCleanupRef = useRef<(() => void) | null>(null);
  
  // Set up grid monitoring when canvas is available
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Clean up any existing monitoring
    if (monitoringCleanupRef.current) {
      monitoringCleanupRef.current();
    }
    
    // Set up new monitoring
    monitoringCleanupRef.current = setupGridMonitoring(canvas, 5000);
    
    // Clean up when unmounting
    return () => {
      if (monitoringCleanupRef.current) {
        monitoringCleanupRef.current();
      }
    };
  }, [fabricCanvasRef.current]);
  
  /**
   * Create grid on canvas
   */
  const createGrid = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || isCreatingRef.current) return [];
    
    try {
      isCreatingRef.current = true;
      logger.info("Creating grid in useReliableGrid");
      
      // Use our robust grid visibility manager
      const result = ensureGridIsPresent(canvas);
      
      if (result.success) {
        gridLayerRef.current = result.gridObjects;
        setIsInitialized(true);
        logger.info(`Grid ${result.action === 'created' ? 'created' : 'managed'} with ${result.gridObjects.length} objects`);
      } else {
        logger.warn("Grid creation failed in ensureGridIsPresent");
        
        // Fallback to emergency grid
        const gridObjects = createBasicEmergencyGrid(canvas);
        gridLayerRef.current = gridObjects;
        setIsInitialized(gridObjects.length > 0);
      }
      
      return gridLayerRef.current;
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
      const result = ensureGridIsPresent(canvas);
      
      if (result.success && result.action !== 'none') {
        gridLayerRef.current = result.gridObjects;
        return true;
      }
      
      return false;
    } catch (error) {
      logger.error("Error ensuring grid visibility:", error);
      return false;
    }
  }, [fabricCanvasRef]);
  
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
