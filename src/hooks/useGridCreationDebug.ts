
/**
 * Grid creation debugging hook
 * Provides utilities for debugging grid creation issues
 * @module useGridCreationDebug
 */
import { useState, useCallback, useEffect } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { toast } from 'sonner';
import logger from '@/utils/logger';
import { resetGridProgress } from '@/utils/gridManager';
import { createBasicEmergencyGrid, verifyGridExists } from '@/utils/gridCreationUtils';

interface GridHealthCheckResult {
  exists: boolean;
  size: number;
  objectsOnCanvas: number;
  canvasDimensions: {
    width: number;
    height: number;
  };
}

/**
 * Hook for debugging and recovering from grid creation issues
 * 
 * @param fabricCanvasRef - Reference to the fabric canvas
 * @param gridLayerRef - Reference to grid objects
 * @returns Debugging and recovery functions
 */
export const useGridCreationDebug = (
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
) => {
  const [debugMode, setDebugMode] = useState(false);
  const [lastGridSize, setLastGridSize] = useState(0);
  
  /**
   * Force grid creation
   * Bypasses normal creation flow
   */
  const forceGridCreation = useCallback(() => {
    if (!fabricCanvasRef.current) {
      console.error("Cannot force grid creation: Canvas is null");
      return false;
    }
    
    resetGridProgress();
    console.log("🔄 Forcing grid creation");
    
    const grid = createBasicEmergencyGrid(fabricCanvasRef.current, gridLayerRef);
    return grid;
  }, [fabricCanvasRef, gridLayerRef]);
  
  /**
   * Check grid health
   * Verifies if grid exists on canvas
   */
  const checkGridHealth = useCallback((): GridHealthCheckResult | false => {
    if (!fabricCanvasRef.current) return false;
    
    const exists = verifyGridExists(fabricCanvasRef.current, gridLayerRef);
    const newGridSize = gridLayerRef.current.length;
    
    // Track grid size changes
    if (newGridSize !== lastGridSize) {
      console.log(`📊 Grid size changed: ${lastGridSize} -> ${newGridSize}`);
      setLastGridSize(newGridSize);
    }
    
    return {
      exists,
      size: newGridSize,
      objectsOnCanvas: fabricCanvasRef.current.getObjects().length,
      canvasDimensions: {
        width: fabricCanvasRef.current.getWidth(),
        height: fabricCanvasRef.current.getHeight()
      }
    };
  }, [fabricCanvasRef, gridLayerRef, lastGridSize]);
  
  /**
   * Fix grid issues
   * Attempts to repair grid problems
   */
  const fixGridIssues = useCallback(() => {
    const health = checkGridHealth();
    
    if (health && (!health.exists || health.size === 0)) {
      toast.warning("Grid missing, attempting recovery");
      return forceGridCreation();
    }
    
    return true;
  }, [checkGridHealth, forceGridCreation]);
  
  /**
   * Toggle debug mode
   */
  const toggleDebugMode = useCallback(() => {
    setDebugMode(prev => !prev);
    if (!debugMode) {
      console.log("🔍 Grid debug mode enabled");
      const health = checkGridHealth();
      console.log("Grid health:", health);
    }
  }, [debugMode, checkGridHealth]);
  
  // Monitor grid health in debug mode
  useEffect(() => {
    if (!debugMode) return;
    
    const interval = setInterval(() => {
      const health = checkGridHealth();
      if (health && !health.exists && health.size === 0) {
        logger.warn("Grid missing during health check");
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [debugMode, checkGridHealth]);
  
  return {
    debugMode,
    toggleDebugMode,
    forceGridCreation,
    checkGridHealth,
    fixGridIssues
  };
};
