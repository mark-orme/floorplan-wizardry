
/**
 * Custom hook for managing drawing history (undo/redo)
 * @module useDrawingHistory
 */
import { useCallback } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { toast } from "sonner";
import { MAX_HISTORY_STATES } from "@/utils/drawing";
import { clearCanvasObjects } from "@/utils/fabricHelpers";

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
  historyRef,
  clearDrawings,
  recalculateGIA
}: UseDrawingHistoryProps) => {
  /**
   * Undo the last drawing action
   */
  const handleUndo = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    
    if (historyRef.current.past.length > 1) {
      fabricCanvasRef.current.renderOnAddRemove = false;
      
      const currentState = fabricCanvasRef.current.getObjects().filter(obj => 
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
      
      // Clear canvas and add previous state objects
      clearDrawings();
      
      previousState.forEach(obj => fabricCanvasRef.current!.add(obj));
      
      recalculateGIA();
      
      fabricCanvasRef.current.renderOnAddRemove = true;
      fabricCanvasRef.current.renderAll();
      toast("Undo successful");
    } else {
      toast("Nothing to undo");
    }
  }, [fabricCanvasRef, historyRef, clearDrawings, recalculateGIA]);

  /**
   * Redo a previously undone action
   */
  const handleRedo = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    
    if (historyRef.current.future.length > 0) {
      fabricCanvasRef.current.renderOnAddRemove = false;
      
      const nextState = historyRef.current.future[0];
      
      historyRef.current.future.shift();
      historyRef.current.past.push([...nextState]);
      
      // Trim past history to prevent memory leaks
      if (historyRef.current.past.length > MAX_HISTORY_STATES) {
        historyRef.current.past = historyRef.current.past.slice(-MAX_HISTORY_STATES);
      }
      
      clearDrawings();
      
      nextState.forEach(obj => fabricCanvasRef.current!.add(obj));
      
      recalculateGIA();
      
      fabricCanvasRef.current.renderOnAddRemove = true;
      fabricCanvasRef.current.renderAll();
      toast("Redo successful");
    } else {
      toast("Nothing to redo");
    }
  }, [fabricCanvasRef, historyRef, clearDrawings, recalculateGIA]);

  return {
    handleUndo,
    handleRedo
  };
};
