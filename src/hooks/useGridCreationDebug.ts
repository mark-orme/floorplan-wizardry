
/**
 * Grid creation debugging hook
 * Provides utilities for debugging grid creation issues
 * @module useGridCreationDebug
 */
import { useState, useCallback, useEffect, useRef } from 'react';
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
    width: number | null;
    height: number | null;
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
  const retryTimeoutRef = useRef<number | null>(null);
  const retryAttemptsRef = useRef(0);
  
  /**
   * Force grid creation
   * Bypasses normal creation flow
   */
  const forceGridCreation = useCallback(() => {
    if (!fabricCanvasRef.current) {
      console.error("Cannot force grid creation: Canvas is null");
      toast.error("Grid creation failed: Canvas is not initialized");
      return [];
    }
    
    resetGridProgress();
    console.log("🔄 Forcing grid creation");
    
    // Make sure we have a valid canvas with dimensions
    const canvas = fabricCanvasRef.current;
    const width = canvas.getWidth();
    const height = canvas.getHeight();
    
    if (!width || !height || width === 0 || height === 0) {
      console.error("Cannot create grid on zero-dimension canvas:", { width, height });
      toast.error("Grid creation failed: Canvas has invalid dimensions");
      return [];
    }
    
    try {
      // Create emergency grid
      const grid = createBasicEmergencyGrid(canvas, gridLayerRef);
      
      if (grid.length > 0) {
        console.log(`✅ Grid creation successful: ${grid.length} objects created`);
        retryAttemptsRef.current = 0; // Reset retry counter on success
        return grid;
      } else {
        console.error("Grid creation returned empty array");
        toast.error("Grid creation failed: No objects were created");
        
        // Schedule a retry if we haven't tried too many times
        if (retryAttemptsRef.current < 3) {
          scheduleGridRetry();
        }
        
        return [];
      }
    } catch (error) {
      console.error("Error during force grid creation:", error);
      toast.error(`Grid creation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      // Schedule a retry if we haven't tried too many times
      if (retryAttemptsRef.current < 3) {
        scheduleGridRetry();
      }
      
      return [];
    }
  }, [fabricCanvasRef, gridLayerRef]);
  
  /**
   * Schedule a retry for grid creation
   */
  const scheduleGridRetry = useCallback(() => {
    // Clear any existing timeout
    if (retryTimeoutRef.current !== null) {
      window.clearTimeout(retryTimeoutRef.current);
    }
    
    retryAttemptsRef.current++;
    const delay = Math.min(1000 * Math.pow(1.5, retryAttemptsRef.current), 5000);
    
    console.log(`Scheduling grid retry in ${delay}ms (attempt ${retryAttemptsRef.current})`);
    
    retryTimeoutRef.current = window.setTimeout(() => {
      forceGridCreation();
      retryTimeoutRef.current = null;
    }, delay);
  }, [forceGridCreation]);
  
  /**
   * Check grid health
   * Verifies if grid exists on canvas
   */
  const checkGridHealth = useCallback((): GridHealthCheckResult | false => {
    if (!fabricCanvasRef.current) {
      console.log("Cannot check grid health: Canvas is null");
      return false;
    }
    
    try {
      const canvas = fabricCanvasRef.current;
      const exists = verifyGridExists(canvas, gridLayerRef);
      const newGridSize = gridLayerRef.current.length;
      
      // Track grid size changes
      if (newGridSize !== lastGridSize) {
        console.log(`📊 Grid size changed: ${lastGridSize} -> ${newGridSize}`);
        setLastGridSize(newGridSize);
      }
      
      return {
        exists,
        size: newGridSize,
        objectsOnCanvas: canvas.getObjects().length,
        canvasDimensions: {
          width: canvas.getWidth?.() || null,
          height: canvas.getHeight?.() || null
        }
      };
    } catch (error) {
      console.error("Error checking grid health:", error);
      return false;
    }
  }, [fabricCanvasRef, gridLayerRef, lastGridSize]);
  
  /**
   * Fix grid issues
   * Attempts to repair grid problems
   */
  const fixGridIssues = useCallback(() => {
    const health = checkGridHealth();
    
    if (!health) {
      console.log("Cannot check grid health, trying force creation instead");
      return forceGridCreation();
    }
    
    if (!health.exists || health.size === 0) {
      toast.warning("Grid missing, attempting recovery");
      return forceGridCreation();
    }
    
    return gridLayerRef.current;
  }, [checkGridHealth, forceGridCreation, gridLayerRef]);
  
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
  
  // Clean up timeouts when unmounting
  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current !== null) {
        window.clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
    };
  }, []);
  
  return {
    debugMode,
    toggleDebugMode,
    forceGridCreation,
    checkGridHealth,
    fixGridIssues
  };
};
