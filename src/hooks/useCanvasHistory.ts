
/**
 * Enhanced hook for managing drawing history (undo/redo)
 * With improved state serialization and restoration
 */
import { useCallback, useRef } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { toast } from "sonner";
import { captureCurrentState, pushToHistory, canUndo, canRedo, showHistoryToast, areStatesDifferent } from "@/utils/historyUtils";
import { applyCanvasState } from "@/utils/canvasStateUtils";

interface UseCanvasHistoryProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
  historyRef: React.MutableRefObject<{past: FabricObject[][], future: FabricObject[][]}>;
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
  // Track the last captured state to prevent duplicate history entries
  const lastCapturedStateRef = useRef<FabricObject[]>([]);

  /**
   * Add current state to history before making changes
   * Only saves if the state is different from the last one
   */
  const saveCurrentState = useCallback(() => {
    const currentState = captureCurrentState(fabricCanvasRef.current, gridLayerRef);
    
    // Check if state is different from the last saved one
    const shouldSave = 
      currentState.length > 0 || 
      historyRef.current.past.length === 0 ||
      areStatesDifferent(lastCapturedStateRef.current, currentState);
    
    if (shouldSave) {
      pushToHistory(historyRef, currentState);
      // Update the last captured state
      lastCapturedStateRef.current = [...currentState];
      console.log(`Saved state with ${currentState.length} objects to history`);
    } else {
      console.log('State unchanged, skipping history update');
    }
  }, [fabricCanvasRef, gridLayerRef, historyRef]);

  /**
   * Undo the last drawing action
   */
  const handleUndo = useCallback(() => {
    if (!canUndo(historyRef)) {
      showHistoryToast('undo', false);
      return;
    }
    
    console.log("Performing undo operation");
    
    // Get current state for redo
    const currentState = captureCurrentState(fabricCanvasRef.current, gridLayerRef);
    
    // Only add to future if different from last past state (prevents no-op redo)
    if (historyRef.current.past.length > 0 && 
        areStatesDifferent(historyRef.current.past[historyRef.current.past.length - 1], currentState)) {
      historyRef.current.future.unshift(currentState);
      console.log(`Saved current state with ${currentState.length} objects for potential redo`);
    }
    
    // Remove current state from past
    historyRef.current.past.pop();
    
    // Get previous state
    const previousState = historyRef.current.past[historyRef.current.past.length - 1] || [];
    console.log(`Restoring previous state with ${previousState.length} objects`);
    
    // Apply previous state
    applyCanvasState(fabricCanvasRef.current, previousState, gridLayerRef, recalculateGIA);
    
    // Update last captured state to match what's now on canvas
    lastCapturedStateRef.current = [...previousState];
    
    showHistoryToast('undo', true);
  }, [historyRef, fabricCanvasRef, gridLayerRef, recalculateGIA]);

  /**
   * Redo the last undone drawing action
   */
  const handleRedo = useCallback(() => {
    if (!canRedo(historyRef)) {
      showHistoryToast('redo', false);
      return;
    }
    
    console.log("Performing redo operation");
    
    // Get future state
    const futureState = historyRef.current.future.shift() || [];
    console.log(`Restoring future state with ${futureState.length} objects`);
    
    // Save current state to past
    const currentState = captureCurrentState(fabricCanvasRef.current, gridLayerRef);
    
    // Only add to past if different from current last past state
    if (historyRef.current.past.length === 0 || 
        areStatesDifferent(historyRef.current.past[historyRef.current.past.length - 1], currentState)) {
      historyRef.current.past.push(currentState);
    }
    
    // Apply future state
    applyCanvasState(fabricCanvasRef.current, futureState, gridLayerRef, recalculateGIA);
    
    // Update last captured state to match what's now on canvas
    lastCapturedStateRef.current = [...futureState];
    
    showHistoryToast('redo', true);
  }, [historyRef, fabricCanvasRef, gridLayerRef, recalculateGIA]);

  return {
    saveCurrentState,
    handleUndo,
    handleRedo
  };
};
