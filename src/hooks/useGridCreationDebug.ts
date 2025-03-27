
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
import { dumpGridState, attemptGridRecovery, forceCreateGrid } from '@/utils/grid/gridDebugUtils';

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
  const lastAttemptTimeRef = useRef<number>(0);
  const canvasInitCheckTimerRef = useRef<number | null>(null);
  const waitForCanvasTimeoutRef = useRef<number | null>(null);
  const [isWaitingForCanvas, setIsWaitingForCanvas] = useState(false);
  
  /**
   * Wait for canvas to initialize before trying to create grid
   */
  const waitForCanvasInitialization = useCallback((callback: () => void, maxWaitTime = 8000) => {
    console.log("Waiting for canvas initialization...");
    setIsWaitingForCanvas(true);
    
    // Clear any existing timers
    if (waitForCanvasTimeoutRef.current !== null) {
      window.clearTimeout(waitForCanvasTimeoutRef.current);
    }
    
    let waitStart = Date.now();
    let checkInterval = 250; // Start with checking every 250ms
    let maxChecks = Math.ceil(maxWaitTime / checkInterval);
    let checkCount = 0;
    
    // Function to check if canvas is ready
    const checkCanvasReady = () => {
      checkCount++;
      
      // If we have a canvas reference and it has dimensions, it's ready
      if (fabricCanvasRef.current && 
          fabricCanvasRef.current.width && 
          fabricCanvasRef.current.height) {
        console.log(`Canvas is ready after ${checkCount} checks (${Date.now() - waitStart}ms)`);
        setIsWaitingForCanvas(false);
        // Execute the callback
        callback();
        return;
      }
      
      // Check if we've waited too long
      if (Date.now() - waitStart > maxWaitTime) {
        console.warn(`Canvas initialization timed out after ${maxWaitTime}ms`);
        setIsWaitingForCanvas(false);
        toast.error("Canvas initialization timed out");
        return;
      }
      
      // Increase check interval over time for exponential backoff
      if (checkCount > 5) {
        checkInterval = Math.min(checkInterval * 1.5, 1000);
      }
      
      // Schedule next check
      waitForCanvasTimeoutRef.current = window.setTimeout(checkCanvasReady, checkInterval);
    };
    
    // Start checking
    checkCanvasReady();
    
  }, [fabricCanvasRef]);
  
  /**
   * Force grid creation
   * Bypasses normal creation flow
   */
  const forceGridCreation = useCallback(() => {
    if (!fabricCanvasRef.current) {
      console.error("Cannot force grid creation: Canvas is null");
      
      // Wait for canvas to initialize
      waitForCanvasInitialization(() => {
        console.log("Canvas is now ready, attempting force grid creation");
        if (fabricCanvasRef.current) {
          // Now the canvas should be ready
          forceCreateGrid(fabricCanvasRef.current, gridLayerRef);
        } else {
          toast.error("Grid creation failed: Canvas is still not initialized");
        }
      });
      
      return [];
    }
    
    // Throttle attempts to avoid spamming
    const now = Date.now();
    if (now - lastAttemptTimeRef.current < 500) {
      console.log("Throttling grid creation attempts");
      toast.warning("Please wait before trying again");
      return [];
    }
    lastAttemptTimeRef.current = now;
    
    resetGridProgress();
    console.log("🔄 Forcing grid creation");
    dumpGridState(fabricCanvasRef.current, gridLayerRef);
    
    // Get canvas details for logging
    const canvas = fabricCanvasRef.current;
    const width = canvas.getWidth?.() || canvas.width || 0;
    const height = canvas.getHeight?.() || canvas.height || 0;
    
    if (width === 0 || height === 0) {
      console.error("Cannot create grid on zero-dimension canvas:", { width, height });
      
      // Try to force set dimensions
      try {
        console.log("Attempting to force set canvas dimensions to 800x600");
        canvas.setWidth(800);
        canvas.setHeight(600);
        
        // Verify dimensions were set
        const newWidth = canvas.getWidth?.() || canvas.width || 0;
        const newHeight = canvas.getHeight?.() || canvas.height || 0;
        
        if (newWidth === 0 || newHeight === 0) {
          console.error("Failed to set canvas dimensions");
          toast.error("Grid creation failed: Cannot set canvas dimensions");
          return [];
        } else {
          console.log(`Successfully set canvas dimensions to ${newWidth}x${newHeight}`);
        }
      } catch (error) {
        console.error("Error setting canvas dimensions:", error);
        toast.error("Grid creation failed: Canvas has invalid dimensions");
        return [];
      }
    }
    
    try {
      // Use our enhanced force grid creation utility
      const success = forceCreateGrid(canvas, gridLayerRef);
      
      if (success) {
        console.log(`✅ Grid creation successful: ${gridLayerRef.current.length} objects created`);
        retryAttemptsRef.current = 0; // Reset retry counter on success
        return gridLayerRef.current;
      } else {
        console.error("Grid creation failed: forceCreateGrid returned false");
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
  }, [fabricCanvasRef, gridLayerRef, waitForCanvasInitialization]);
  
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
      let exists = false;
      
      // More thorough existence check
      if (gridLayerRef.current.length > 0) {
        exists = gridLayerRef.current.some(obj => canvas.contains(obj));
      } else {
        exists = false;
      }
      
      const newGridSize = gridLayerRef.current.length;
      const objectsOnCanvas = gridLayerRef.current.filter(obj => canvas.contains(obj)).length;
      
      // Track grid size changes
      if (newGridSize !== lastGridSize) {
        console.log(`📊 Grid size changed: ${lastGridSize} -> ${newGridSize}`);
        setLastGridSize(newGridSize);
      }
      
      return {
        exists,
        size: newGridSize,
        objectsOnCanvas,
        canvasDimensions: {
          width: canvas.getWidth?.() || canvas.width,
          height: canvas.getHeight?.() || canvas.height
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
    if (!fabricCanvasRef.current) {
      console.log("Cannot fix grid issues: Canvas is null");
      
      // Wait for canvas to initialize
      waitForCanvasInitialization(() => {
        console.log("Canvas is now ready, attempting to fix grid issues");
        if (fabricCanvasRef.current) {
          // Now the canvas should be ready
          attemptGridRecovery(fabricCanvasRef.current, gridLayerRef);
        } else {
          toast.error("Grid fix failed: Canvas is still not initialized");
        }
      });
      
      return [];
    }
    
    const health = checkGridHealth();
    
    if (!health) {
      console.log("Cannot check grid health, trying force creation instead");
      return forceGridCreation();
    }
    
    console.log("Current grid health:", health);
    
    if (!health.exists || health.size === 0 || health.objectsOnCanvas === 0) {
      toast.warning("Grid missing, attempting recovery");
      return forceGridCreation();
    }
    
    // If grid exists but some objects are missing from canvas
    if (health.objectsOnCanvas < health.size) {
      console.log(`Grid partial issue: ${health.objectsOnCanvas}/${health.size} objects on canvas`);
      toast.info(`Fixing partial grid (${health.objectsOnCanvas}/${health.size} objects on canvas)`);
      
      // Attempt recovery with existing grid objects
      const success = attemptGridRecovery(fabricCanvasRef.current, gridLayerRef);
      
      if (success) {
        return gridLayerRef.current;
      } else {
        // If recovery failed, try force creation
        return forceGridCreation();
      }
    }
    
    // Grid appears to be fine
    toast.success("Grid is already working correctly");
    return gridLayerRef.current;
  }, [checkGridHealth, forceGridCreation, fabricCanvasRef, gridLayerRef, waitForCanvasInitialization]);
  
  /**
   * Toggle debug mode
   */
  const toggleDebugMode = useCallback(() => {
    setDebugMode(prev => !prev);
    if (!debugMode) {
      console.log("🔍 Grid debug mode enabled");
      const health = checkGridHealth();
      console.log("Grid health:", health);
      
      if (fabricCanvasRef.current) {
        dumpGridState(fabricCanvasRef.current, gridLayerRef);
      }
    }
  }, [debugMode, checkGridHealth, fabricCanvasRef, gridLayerRef]);
  
  // Check canvas initialization status periodically
  useEffect(() => {
    // Set up a timer to check if the canvas becomes available
    canvasInitCheckTimerRef.current = window.setInterval(() => {
      if (!fabricCanvasRef.current) {
        return; // Still not available
      }
      
      const canvas = fabricCanvasRef.current;
      const width = canvas.getWidth?.() || canvas.width || 0;
      const height = canvas.getHeight?.() || canvas.height || 0;
      
      if (width > 0 && height > 0) {
        console.log("Canvas initialized with dimensions:", { width, height });
        // If grid is empty, try creating it
        if (gridLayerRef.current.length === 0) {
          console.log("Grid is empty after canvas initialization, attempting to create");
          forceGridCreation();
        }
        
        // Clear the interval as we don't need to check anymore
        if (canvasInitCheckTimerRef.current !== null) {
          window.clearInterval(canvasInitCheckTimerRef.current);
          canvasInitCheckTimerRef.current = null;
        }
      }
    }, 1000);
    
    return () => {
      if (canvasInitCheckTimerRef.current !== null) {
        window.clearInterval(canvasInitCheckTimerRef.current);
        canvasInitCheckTimerRef.current = null;
      }
    };
  }, [fabricCanvasRef, gridLayerRef, forceGridCreation]);
  
  // Auto check if grid needs to be created on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      const health = checkGridHealth();
      if (health && !health.exists && health.size === 0) {
        console.log("Grid missing on initial health check, auto-attempting creation");
        forceGridCreation();
      }
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [checkGridHealth, forceGridCreation]);
  
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
      
      if (waitForCanvasTimeoutRef.current !== null) {
        window.clearTimeout(waitForCanvasTimeoutRef.current);
        waitForCanvasTimeoutRef.current = null;
      }
      
      if (canvasInitCheckTimerRef.current !== null) {
        window.clearInterval(canvasInitCheckTimerRef.current);
        canvasInitCheckTimerRef.current = null;
      }
    };
  }, []);
  
  return {
    debugMode,
    toggleDebugMode,
    forceGridCreation,
    checkGridHealth,
    fixGridIssues,
    isWaitingForCanvas
  };
};
