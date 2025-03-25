
/**
 * Enhanced hook for managing drawing history (undo/redo)
 * With improved state serialization and restoration
 */
import { useCallback, useRef } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { toast } from "sonner";
import { captureCurrentState, pushToHistory, canUndo, canRedo, showHistoryToast, areStatesDifferent, serializeObject } from "@/utils/historyUtils";
import { applyCanvasState, removeLastDrawnObject, addObjectToCanvas } from "@/utils/canvasStateUtils";
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
  // Store the last removed object for redo
  const lastRemovedObjectRef = useRef<any | null>(null);

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
   * Undo the last drawing action - only removes the last item
   */
  const handleUndo = useCallback(() => {
    if (!canUndo(historyRef)) {
      showHistoryToast('undo', false);
      return;
    }
    
    logger.info("Performing undo operation - removing last drawn object");
    
    // Remove the last drawn object from canvas
    const removedObject = removeLastDrawnObject(fabricCanvasRef.current, gridLayerRef);
    
    if (removedObject) {
      // Serialize the removed object for potential redo
      const serializedObject = serializeObject(removedObject);
      
      if (serializedObject) {
        // Store the removed object for redo
        lastRemovedObjectRef.current = serializedObject;
        
        // Add to future history for redo
        historyRef.current.future.unshift([serializedObject]);
        logger.info(`Saved removed object of type ${serializedObject.type} for potential redo`);
        
        // Get current state after removal
        const currentState = captureCurrentState(fabricCanvasRef.current, gridLayerRef);
        
        // Update history with current state
        historyRef.current.past.push([...currentState]);
        
        // Update last captured state
        lastCapturedStateRef.current = [...currentState];
        
        // Recalculate GIA after state change
        recalculateGIA();
        
        showHistoryToast('undo', true);
      }
    } else {
      logger.warn("No object was removed during undo");
      showHistoryToast('undo', false);
    }
  }, [historyRef, fabricCanvasRef, gridLayerRef, recalculateGIA]);

  /**
   * Redo the last undone drawing action - only adds back the last removed item
   */
  const handleRedo = useCallback(() => {
    if (!canRedo(historyRef)) {
      showHistoryToast('redo', false);
      return;
    }
    
    logger.info("Performing redo operation - restoring last removed object");
    
    // Get future state (contains the single object that was removed)
    const futureState = historyRef.current.future.shift();
    
    if (futureState && futureState.length > 0) {
      // Get the single object to restore
      const objectToAdd = futureState[0];
      logger.info(`Restoring object of type ${objectToAdd.type}`);
      
      // Add the object back to the canvas
      const addedObject = addObjectToCanvas(fabricCanvasRef.current, objectToAdd);
      
      if (addedObject) {
        // Get current state after addition
        const currentState = captureCurrentState(fabricCanvasRef.current, gridLayerRef);
        
        // Update history with current state
        historyRef.current.past.push([...currentState]);
        
        // Update last captured state
        lastCapturedStateRef.current = [...currentState];
        
        // Recalculate GIA after state change
        recalculateGIA();
        
        showHistoryToast('redo', true);
      } else {
        logger.warn("Failed to add object during redo");
        showHistoryToast('redo', false);
      }
    } else {
      logger.warn("No object to restore during redo");
      showHistoryToast('redo', false);
    }
  }, [historyRef, fabricCanvasRef, gridLayerRef, recalculateGIA]);

  return {
    saveCurrentState,
    handleUndo,
    handleRedo
  };
};
