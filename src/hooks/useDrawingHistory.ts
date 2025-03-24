
/**
 * Custom hook for managing drawing history (undo/redo)
 * @module useDrawingHistory
 */
import { useCallback } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { toast } from "sonner";
import { MAX_HISTORY_STATES } from "@/utils/drawing";

interface UseDrawingHistoryProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  gridLayerRef: React.MutableRefObject<any[]>;
  historyRef: React.MutableRefObject<{past: any[][], future: any[][]}>;
  clearDrawings: () => void;
  recalculateGIA: () => void;
}

/**
 * Hook for managing undo/redo functionality
 * @param {UseDrawingHistoryProps} props - Hook properties
 * @returns {Object} Undo and redo handler functions
 */
export const useDrawingHistory = ({
  fabricCanvasRef,
  gridLayerRef,
  historyRef,
  clearDrawings,
  recalculateGIA
}: UseDrawingHistoryProps) => {
  /**
   * Undo the last drawing action
   */
  const handleUndo = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    
    const { past, future } = historyRef.current;
    
    if (past.length === 0) {
      toast.info("Nothing to undo");
      return;
    }
    
    const fabricCanvas = fabricCanvasRef.current;
    
    try {
      // Get the current state before making changes (for redo)
      const currentState = fabricCanvas.getObjects().filter(obj => 
        obj.type === 'polyline' || obj.type === 'path'
      );
      
      // Add current state to future
      future.unshift([...currentState]);
      
      // Remove the last state from past
      const previousState = past.pop();
      
      // Clear all objects except grid
      clearDrawings();
      
      // If we have a previous state, restore it
      if (previousState && previousState.length > 0) {
        // Clone and add each object from the previous state
        previousState.forEach(obj => {
          // Skip objects that don't have clone method or are not valid
          if (obj && typeof obj.clone === 'function') {
            try {
              const clonedObj = obj.clone();
              fabricCanvas.add(clonedObj);
            } catch (err) {
              console.error("Error cloning object:", err);
            }
          }
        });
      }
      
      // Ensure grid stays in background
      gridLayerRef.current.forEach(gridObj => {
        if (fabricCanvas.contains(gridObj)) {
          fabricCanvas.sendObjectToBack(gridObj);
        }
      });
      
      fabricCanvas.requestRenderAll();
      recalculateGIA();
      toast.success("Undo successful");
      
    } catch (error) {
      console.error("Error during undo:", error);
      toast.error("Failed to undo");
    }
  }, [fabricCanvasRef, historyRef, clearDrawings, gridLayerRef, recalculateGIA]);
  
  /**
   * Redo the last undone drawing action
   */
  const handleRedo = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    
    const { past, future } = historyRef.current;
    
    if (future.length === 0) {
      toast.info("Nothing to redo");
      return;
    }
    
    const fabricCanvas = fabricCanvasRef.current;
    
    try {
      // Get the current state before making changes (for undo)
      const currentState = fabricCanvas.getObjects().filter(obj => 
        obj.type === 'polyline' || obj.type === 'path'
      );
      
      // Add current state to past
      past.push([...currentState]);
      
      // Get the most recent future state
      const futureState = future.shift();
      
      // Clear all objects except grid
      clearDrawings();
      
      // If we have a future state, restore it
      if (futureState && futureState.length > 0) {
        // Clone and add each object from the future state
        futureState.forEach(obj => {
          // Skip objects that don't have clone method or are not valid
          if (obj && typeof obj.clone === 'function') {
            try {
              const clonedObj = obj.clone();
              fabricCanvas.add(clonedObj);
            } catch (err) {
              console.error("Error cloning object:", err);
            }
          }
        });
      }
      
      // Ensure grid stays in background
      gridLayerRef.current.forEach(gridObj => {
        if (fabricCanvas.contains(gridObj)) {
          fabricCanvas.sendObjectToBack(gridObj);
        }
      });
      
      fabricCanvas.requestRenderAll();
      recalculateGIA();
      toast.success("Redo successful");
      
    } catch (error) {
      console.error("Error during redo:", error);
      toast.error("Failed to redo");
    }
    
    // Trim history if it gets too large
    if (past.length > MAX_HISTORY_STATES) {
      past.splice(0, past.length - MAX_HISTORY_STATES);
    }
    if (future.length > MAX_HISTORY_STATES) {
      future.splice(MAX_HISTORY_STATES, future.length - MAX_HISTORY_STATES);
    }
  }, [fabricCanvasRef, historyRef, clearDrawings, gridLayerRef, recalculateGIA]);
  
  return {
    handleUndo,
    handleRedo
  };
};
