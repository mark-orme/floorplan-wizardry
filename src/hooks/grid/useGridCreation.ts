
/**
 * Hook for managing grid creation
 * @module hooks/grid/useGridCreation
 */

import { useCallback, useRef, useState } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { 
  createBasicGrid, 
  ensureGridVisibility 
} from "@/utils/grid/simpleGridCreator";
import logger from "@/utils/logger";

/**
 * Props for the useGridCreation hook
 */
interface UseGridCreationProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
}

/**
 * Hook for managing grid creation and visibility
 * 
 * @param props - Hook properties
 * @returns Grid creation methods and state
 */
export const useGridCreation = ({ fabricCanvasRef }: UseGridCreationProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const gridLayerRef = useRef<FabricObject[]>([]);
  
  // Create grid
  const createGrid = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) {
      setError("Canvas is not available");
      return [];
    }
    
    setIsCreating(true);
    setError(null);
    
    try {
      const gridObjects = createBasicGrid(canvas);
      gridLayerRef.current = gridObjects;
      logger.info(`Grid created with ${gridObjects.length} objects`);
      return gridObjects;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      logger.error("Error creating grid:", err);
      return [];
    } finally {
      setIsCreating(false);
    }
  }, [fabricCanvasRef]);
  
  // Ensure grid visibility
  const ensureVisibility = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !gridLayerRef.current.length) {
      return false;
    }
    
    try {
      const result = ensureGridVisibility(canvas, gridLayerRef.current);
      return result;
    } catch (err) {
      logger.error("Error ensuring grid visibility:", err);
      return false;
    }
  }, [fabricCanvasRef]);
  
  return {
    createGrid,
    ensureVisibility,
    isCreating,
    error,
    gridLayerRef
  };
};
