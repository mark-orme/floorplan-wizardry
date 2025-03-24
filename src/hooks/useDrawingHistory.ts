
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
 * Hook for managing drawing history operations (undo/redo)
 * @param {UseDrawingHistoryProps} props - Hook properties
 * @returns {Object} History management operations
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
    if (!fabricCanvasRef.current) {
      console.error("Cannot undo: fabric canvas is null");
      return;
    }
    
    // Ensure there's something to undo
    if (historyRef.current.past.length > 1) {
      console.log("Performing undo operation");
      const canvas = fabricCanvasRef.current;
      canvas.renderOnAddRemove = false;
      
      // Capture current state before undo
      const currentState = canvas.getObjects().filter(obj => 
        obj.type === 'path' || obj.type === 'polyline'
      );
      
      // Add current state to future history
      historyRef.current.future.unshift([...currentState]);
      
      // Trim future history to prevent memory leaks
      if (historyRef.current.future.length > MAX_HISTORY_STATES) {
        historyRef.current.future = historyRef.current.future.slice(0, MAX_HISTORY_STATES);
      }
      
      // Remove current state from past history
      historyRef.current.past.pop();
      
      // Get previous state
      const previousState = historyRef.current.past[historyRef.current.past.length - 1];
      
      // Clear only the drawing objects, keep the grid
      const pathsAndPolylines = canvas.getObjects().filter(obj => 
        obj.type === 'path' || obj.type === 'polyline'
      );
      
      pathsAndPolylines.forEach(obj => canvas.remove(obj));
      
      // Add previous state objects
      if (previousState && previousState.length) {
        previousState.forEach(obj => {
          // Make a clone of the object to avoid reference issues
          const clone = fabric.util.object.clone(obj);
          canvas.add(clone);
        });
      }
      
      // Update GIA calculation
      recalculateGIA();
      
      canvas.renderOnAddRemove = true;
      canvas.requestRenderAll();
      toast.success("Undo successful");
      console.log("Undo completed successfully");
    } else {
      console.log("Nothing to undo");
      toast.info("Nothing to undo");
    }
  }, [fabricCanvasRef, historyRef, recalculateGIA]);

  /**
   * Redo a previously undone action
   */
  const handleRedo = useCallback(() => {
    if (!fabricCanvasRef.current) {
      console.error("Cannot redo: fabric canvas is null");
      return;
    }
    
    if (historyRef.current.future.length > 0) {
      console.log("Performing redo operation");
      const canvas = fabricCanvasRef.current;
      canvas.renderOnAddRemove = false;
      
      // Get next state from future history
      const nextState = historyRef.current.future[0];
      
      // Remove it from future and add to past
      historyRef.current.future.shift();
      historyRef.current.past.push([...nextState]);
      
      // Trim past history to prevent memory leaks
      if (historyRef.current.past.length > MAX_HISTORY_STATES) {
        historyRef.current.past = historyRef.current.past.slice(-MAX_HISTORY_STATES);
      }
      
      // Clear only the drawing objects, keep the grid
      const pathsAndPolylines = canvas.getObjects().filter(obj => 
        obj.type === 'path' || obj.type === 'polyline'
      );
      
      pathsAndPolylines.forEach(obj => canvas.remove(obj));
      
      // Add next state objects
      if (nextState && nextState.length) {
        nextState.forEach(obj => {
          // Make a clone of the object to avoid reference issues
          const clone = fabric.util.object.clone(obj);
          canvas.add(clone);
        });
      }
      
      // Update GIA calculation
      recalculateGIA();
      
      canvas.renderOnAddRemove = true;
      canvas.requestRenderAll();
      toast.success("Redo successful");
      console.log("Redo completed successfully");
    } else {
      console.log("Nothing to redo");
      toast.info("Nothing to redo");
    }
  }, [fabricCanvasRef, historyRef, recalculateGIA]);

  return {
    handleUndo,
    handleRedo
  };
};
