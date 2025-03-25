
/**
 * Enhanced hook for managing drawing history (undo/redo)
 * With improved state serialization and restoration
 */
import { useCallback } from "react";
import { Canvas as FabricCanvas, Object as FabricObject, Polyline, Path, util } from "fabric";
import { toast } from "sonner";
import { MAX_HISTORY_STATES } from "@/utils/drawing";

interface UseCanvasHistoryProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  gridLayerRef: React.MutableRefObject<any[]>;
  historyRef: React.MutableRefObject<{past: any[][], future: any[][]}>;
  recalculateGIA: () => void;
}

/**
 * Enhanced hook for managing undo/redo functionality
 */
export const useCanvasHistory = ({
  fabricCanvasRef,
  gridLayerRef,
  historyRef,
  recalculateGIA
}: UseCanvasHistoryProps) => {
  /**
   * Check if an object is a grid object
   */
  const isGridObject = useCallback((obj: FabricObject) => {
    return gridLayerRef.current.some(gridObj => gridObj === obj);
  }, [gridLayerRef]);

  /**
   * Capture current canvas state (excluding grid)
   */
  const captureCurrentState = useCallback(() => {
    console.log("Capturing current canvas state");
    if (!fabricCanvasRef.current) return [];
    
    // Get current non-grid objects 
    const currentObjects = fabricCanvasRef.current.getObjects().filter(obj => 
      !isGridObject(obj) && (obj.type === 'polyline' || obj.type === 'path')
    );
    
    console.log(`Found ${currentObjects.length} objects to capture`);
    
    // Serialize current objects
    return currentObjects.map(obj => {
      if (obj && typeof obj.toObject === 'function') {
        const serialized = obj.toObject();
        return serialized;
      }
      return null;
    }).filter(Boolean);
  }, [fabricCanvasRef, isGridObject]);

  /**
   * Apply a state from history to the canvas
   */
  const applyState = useCallback((state: any[]) => {
    console.log(`Applying state with ${state.length} objects`);
    if (!fabricCanvasRef.current) return;
    
    const fabricCanvas = fabricCanvasRef.current;
    
    // Remove existing non-grid objects
    const existingObjects = fabricCanvas.getObjects().filter(obj => 
      !isGridObject(obj) && (obj.type === 'polyline' || obj.type === 'path')
    );
    
    console.log(`Removing ${existingObjects.length} existing objects`);
    existingObjects.forEach(obj => {
      try {
        fabricCanvas.remove(obj);
      } catch (err) {
        console.warn("Error removing object:", err);
      }
    });
    
    // Create and add new objects from state
    if (state.length > 0) {
      console.log(`Restoring ${state.length} objects`);
      state.forEach(objData => {
        try {
          let obj: FabricObject | null = null;
          
          if (objData.type === 'polyline') {
            obj = new Polyline(objData.points, {
              ...objData,
              selectable: false
            });
          } else if (objData.type === 'path') {
            obj = new Path(objData.path, {
              ...objData,
              selectable: false
            });
          }
          
          if (obj) {
            fabricCanvas.add(obj);
          }
        } catch (err) {
          console.error("Error adding object from history:", err);
        }
      });
    }
    
    // Ensure grid remains in background
    gridLayerRef.current.forEach(gridObj => {
      if (fabricCanvas.contains(gridObj)) {
        fabricCanvas.sendObjectToBack(gridObj);
      }
    });
    
    fabricCanvas.requestRenderAll();
    recalculateGIA();
  }, [fabricCanvasRef, isGridObject, gridLayerRef, recalculateGIA]);

  /**
   * Push a new state to history
   */
  const pushToHistory = useCallback((state: any[]) => {
    if (!historyRef.current) return;
    
    // Add state to past and clear future
    historyRef.current.past.push(state);
    historyRef.current.future = [];
    
    // Limit history size
    if (historyRef.current.past.length > MAX_HISTORY_STATES) {
      historyRef.current.past.splice(0, historyRef.current.past.length - MAX_HISTORY_STATES);
    }
    
    console.log(`History updated: ${historyRef.current.past.length} states in past, ${historyRef.current.future.length} in future`);
  }, [historyRef]);

  /**
   * Add current state to history before making changes
   */
  const saveCurrentState = useCallback(() => {
    const currentState = captureCurrentState();
    if (currentState.length > 0 || (historyRef.current.past.length === 0)) {
      pushToHistory(currentState);
      console.log(`Saved state with ${currentState.length} objects to history`);
    }
  }, [captureCurrentState, pushToHistory, historyRef]);

  /**
   * Undo the last drawing action
   */
  const handleUndo = useCallback(() => {
    if (!historyRef.current || historyRef.current.past.length <= 1) {
      toast.info("Nothing to undo");
      return;
    }
    
    console.log("Performing undo operation");
    
    // Get current state for redo
    const currentState = captureCurrentState();
    historyRef.current.future.unshift(currentState);
    console.log(`Saved current state with ${currentState.length} objects for potential redo`);
    
    // Remove current state from past
    historyRef.current.past.pop();
    
    // Get previous state
    const previousState = historyRef.current.past[historyRef.current.past.length - 1] || [];
    console.log(`Restoring previous state with ${previousState.length} objects`);
    
    // Apply previous state
    applyState(previousState);
    toast.success("Undo successful");
  }, [historyRef, captureCurrentState, applyState]);

  /**
   * Redo the last undone drawing action
   */
  const handleRedo = useCallback(() => {
    if (!historyRef.current || historyRef.current.future.length === 0) {
      toast.info("Nothing to redo");
      return;
    }
    
    console.log("Performing redo operation");
    
    // Get future state
    const futureState = historyRef.current.future.shift() || [];
    console.log(`Restoring future state with ${futureState.length} objects`);
    
    // Save current state to past
    const currentState = captureCurrentState();
    historyRef.current.past.push(currentState);
    
    // Apply future state
    applyState(futureState);
    toast.success("Redo successful");
  }, [historyRef, captureCurrentState, applyState]);

  return {
    saveCurrentState,
    handleUndo,
    handleRedo
  };
};
