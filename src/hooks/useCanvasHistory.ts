
/**
 * Enhanced hook for managing drawing history (undo/redo)
 * With improved state serialization and restoration
 */
import { useCallback } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { captureCurrentState, pushToHistory, canUndo, canRedo, showHistoryToast } from "@/utils/historyUtils";
import { applyCanvasState } from "@/utils/canvasStateUtils";

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
   * Add current state to history before making changes
   */
  const saveCurrentState = useCallback(() => {
    const currentState = captureCurrentState(fabricCanvasRef.current, gridLayerRef);
    if (currentState.length > 0 || (historyRef.current.past.length === 0)) {
      pushToHistory(historyRef, currentState);
      console.log(`Saved state with ${currentState.length} objects to history`);
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
    historyRef.current.future.unshift(currentState);
    console.log(`Saved current state with ${currentState.length} objects for potential redo`);
    
    // Remove current state from past
    historyRef.current.past.pop();
    
    // Get previous state
    const previousState = historyRef.current.past[historyRef.current.past.length - 1] || [];
    console.log(`Restoring previous state with ${previousState.length} objects`);
    
    // Apply previous state
    applyCanvasState(fabricCanvasRef.current, previousState, gridLayerRef, recalculateGIA);
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
    historyRef.current.past.push(currentState);
    
    // Apply future state
    applyCanvasState(fabricCanvasRef.current, futureState, gridLayerRef, recalculateGIA);
    showHistoryToast('redo', true);
  }, [historyRef, fabricCanvasRef, gridLayerRef, recalculateGIA]);

  return {
    saveCurrentState,
    handleUndo,
    handleRedo
  };
};
