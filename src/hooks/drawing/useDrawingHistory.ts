
/**
 * Hook for managing drawing history (undo/redo)
 * @module hooks/drawing/useDrawingHistory
 */
import { useCallback } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";

/**
 * Props for the useDrawingHistory hook
 */
interface UseDrawingHistoryProps {
  /** Reference to the fabric canvas */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Reference to the history stack */
  historyRef: React.MutableRefObject<{
    past: FabricObject[][];
    future: FabricObject[][];
  }>;
}

/**
 * Hook for managing drawing history (undo/redo)
 * 
 * @param {UseDrawingHistoryProps} props - Hook properties
 * @returns Drawing history management functions
 */
export const useDrawingHistory = ({
  fabricCanvasRef,
  historyRef
}: UseDrawingHistoryProps) => {
  
  /**
   * Save current canvas state for undo/redo functionality
   */
  const saveCurrentState = useCallback(() => {
    if (!fabricCanvasRef.current) return;

    try {
      const canvas = fabricCanvasRef.current;
      const currentState = canvas.getObjects().filter(obj => !(obj as any).isGrid);
      
      // Save a deep copy of the current state
      historyRef.current.past.push(
        currentState.map(obj => obj)
      );
      
      // Clear future history when a new action is performed
      historyRef.current.future = [];
      
    } catch (error) {
      console.error('Error saving canvas state:', error);
    }
  }, [fabricCanvasRef, historyRef]);
  
  /**
   * Undo last action
   */
  const undo = useCallback(() => {
    if (!fabricCanvasRef.current || !historyRef.current.past.length) return;
    
    const canvas = fabricCanvasRef.current;
    
    // Save the current state to the future stack
    const currentState = canvas.getObjects().filter(obj => !(obj as any).isGrid);
    historyRef.current.future.push(currentState.map(obj => obj));
    
    // Get the previous state
    const prevState = historyRef.current.past.pop();
    
    // Remove all non-grid objects
    canvas.getObjects().forEach(obj => {
      if (!(obj as any).isGrid) {
        canvas.remove(obj);
      }
    });
    
    // Add the objects from the previous state
    if (prevState) {
      prevState.forEach(obj => {
        canvas.add(obj);
      });
    }
    
    canvas.renderAll();
    
  }, [fabricCanvasRef, historyRef]);
  
  /**
   * Redo previously undone action
   */
  const redo = useCallback(() => {
    if (!fabricCanvasRef.current || !historyRef.current.future.length) return;
    
    const canvas = fabricCanvasRef.current;
    
    // Save the current state to the past stack
    const currentState = canvas.getObjects().filter(obj => !(obj as any).isGrid);
    historyRef.current.past.push(currentState.map(obj => obj));
    
    // Get the future state
    const futureState = historyRef.current.future.pop();
    
    // Remove all non-grid objects
    canvas.getObjects().forEach(obj => {
      if (!(obj as any).isGrid) {
        canvas.remove(obj);
      }
    });
    
    // Add the objects from the future state
    if (futureState) {
      futureState.forEach(obj => {
        canvas.add(obj);
      });
    }
    
    canvas.renderAll();
    
  }, [fabricCanvasRef, historyRef]);
  
  return {
    saveCurrentState,
    undo,
    redo
  };
};
