
/**
 * Enhanced hook for managing drawing history (undo/redo)
 * With improved state serialization and restoration
 */
import { useCallback, useRef } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { toast } from "sonner";
import { captureCurrentState, pushToHistory, canUndo, canRedo, showHistoryToast, areStatesDifferent } from "@/utils/historyUtils";
import { applyCanvasState } from "@/utils/canvasStateUtils";
import logger from "@/utils/logger";

interface UseCanvasHistoryProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
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
  // Track the last captured state to prevent duplicate history entries
  const lastCapturedStateRef = useRef<any[]>([]);

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
      logger.info(`Saved state with ${currentState.length} objects to history`);
    } else {
      logger.info('State unchanged, skipping history update');
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
    
    logger.info("Performing undo operation");
    
    // Get current state for redo
    const currentState = captureCurrentState(fabricCanvasRef.current, gridLayerRef);
    
    // Add to future if different from last past state
    historyRef.current.future.unshift([...currentState]);
    logger.info(`Saved current state with ${currentState.length} objects for potential redo`);
    
    // Remove current state from past
    historyRef.current.past.pop();
    
    // Get previous state (the one we want to restore)
    const previousState = historyRef.current.past[historyRef.current.past.length - 1] || [];
    logger.info(`Restoring previous state with ${previousState.length} objects`);
    
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
    
    logger.info("Performing redo operation");
    
    // Get future state
    const futureState = historyRef.current.future.shift() || [];
    logger.info(`Restoring future state with ${futureState.length} objects`);
    
    // Save current state to past
    const currentState = captureCurrentState(fabricCanvasRef.current, gridLayerRef);
    historyRef.current.past.push([...currentState]);
    
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
