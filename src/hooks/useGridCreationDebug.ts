
/**
 * Grid creation debug hook
 * Provides utilities for debugging and fixing grid issues
 * @module useGridCreationDebug
 */
import { useCallback, useState, useRef } from 'react';
import { Canvas, Object as FabricObject } from 'fabric';
import { createBasicEmergencyGrid, verifyGridExists } from '@/utils/gridCreationUtils';
import { forceCreateGrid, dumpGridState, attemptGridRecovery } from '@/utils/grid/gridDebugUtils';
import { toast } from 'sonner';

/**
 * Hook for debugging grid creation issues
 * 
 * @param {React.MutableRefObject<Canvas | null>} fabricCanvasRef - Reference to fabric canvas
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 * @returns {Object} Debug utilities
 */
export const useGridCreationDebug = (
  fabricCanvasRef: React.MutableRefObject<Canvas | null>,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
) => {
  const [debugMode, setDebugMode] = useState(true);
  const canvasCheckAttemptsRef = useRef(0);
  
  /**
   * Check if we're waiting for canvas to initialize
   * @returns {boolean} True if waiting for canvas
   */
  const isWaitingForCanvas = useCallback((): boolean => {
    return !fabricCanvasRef.current && canvasCheckAttemptsRef.current < 10;
  }, [fabricCanvasRef]);
  
  /**
   * Toggle debug mode
   */
  const toggleDebugMode = useCallback(() => {
    setDebugMode(prev => !prev);
  }, []);
  
  /**
   * Check grid health
   * @returns {Object | false} Grid health information or false if unavailable
   */
  const checkGridHealth = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    
    if (!canvas) {
      canvasCheckAttemptsRef.current++;
      console.log(`Canvas not ready, attempt ${canvasCheckAttemptsRef.current}/10`);
      return false;
    }
    
    // Reset attempts counter when canvas is available
    canvasCheckAttemptsRef.current = 0;
    
    try {
      const gridObjects = gridLayerRef.current;
      const exists = gridObjects.length > 0;
      const objectsOnCanvas = gridObjects.filter(obj => canvas.contains(obj)).length;
      
      return {
        exists,
        size: gridObjects.length,
        objectsOnCanvas,
        percentage: exists ? (objectsOnCanvas / gridObjects.length) * 100 : 0
      };
    } catch (error) {
      console.error("Error checking grid health:", error);
      return false;
    }
  }, [fabricCanvasRef, gridLayerRef]);
  
  /**
   * Force grid creation
   * @returns {FabricObject[] | false} Created grid objects or false if canvas not available
   */
  const forceGridCreation = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    
    if (!canvas) {
      canvasCheckAttemptsRef.current++;
      console.log(`Canvas not ready for grid creation, attempt ${canvasCheckAttemptsRef.current}/10`);
      return false;
    }
    
    // Reset attempts counter
    canvasCheckAttemptsRef.current = 0;
    
    console.log("Forcing grid creation...");
    
    try {
      // Use the specialized force create function
      const grid = forceCreateGrid(canvas, gridLayerRef);
      
      if (grid.length > 0) {
        console.log(`Grid created with ${grid.length} objects`);
        dumpGridState(canvas, gridLayerRef);
        return grid;
      } else {
        // If that fails, try emergency grid directly
        console.log("Force create failed, trying emergency grid directly");
        return createBasicEmergencyGrid(canvas, gridLayerRef);
      }
    } catch (error) {
      console.error("Error during force grid creation:", error);
      
      // Last resort - try emergency grid directly
      try {
        console.log("Error in force creation, trying emergency grid as last resort");
        return createBasicEmergencyGrid(canvas, gridLayerRef);
      } catch (emergencyError) {
        console.error("Even emergency grid creation failed:", emergencyError);
        return false;
      }
    }
  }, [fabricCanvasRef, gridLayerRef]);
  
  /**
   * Fix grid issues
   * @returns {FabricObject[] | false} Fixed grid objects or false if canvas not available
   */
  const fixGridIssues = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    
    if (!canvas) {
      canvasCheckAttemptsRef.current++;
      console.log(`Canvas not ready for grid fixes, attempt ${canvasCheckAttemptsRef.current}/10`);
      return false;
    }
    
    // Reset attempts counter
    canvasCheckAttemptsRef.current = 0;
    
    console.log("Attempting to fix grid issues...");
    
    try {
      // Check if grid exists first
      const gridExists = verifyGridExists(canvas, gridLayerRef);
      
      if (gridExists) {
        console.log("Grid exists and is valid");
        toast.success("Grid is already valid");
        return gridLayerRef.current;
      }
      
      // Try recovery first
      const recoverySuccess = attemptGridRecovery(canvas, gridLayerRef, null);
      
      if (recoverySuccess) {
        console.log("Grid issues fixed with recovery");
        return gridLayerRef.current;
      }
      
      // If recovery fails, try creating from scratch
      console.log("Recovery failed, forcing grid creation");
      return forceGridCreation();
    } catch (error) {
      console.error("Error fixing grid issues:", error);
      return false;
    }
  }, [fabricCanvasRef, gridLayerRef, forceGridCreation]);
  
  return {
    debugMode,
    toggleDebugMode,
    checkGridHealth,
    forceGridCreation,
    fixGridIssues,
    isWaitingForCanvas
  };
};
