
import { useCallback } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { toast } from 'sonner';

export interface UseCanvasHistoryProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  historyRef: React.MutableRefObject<{
    past: FabricObject[][];
    future: FabricObject[][];
  }>;
  maxHistoryLength?: number;
}

export interface UseCanvasHistoryResult {
  saveCurrentState: () => void;
  undo: () => void;
  redo: () => void;
  clearHistory: () => void;
}

/**
 * Hook for managing canvas undo/redo history
 * 
 * @param {UseCanvasHistoryProps} props - Hook properties
 * @returns {UseCanvasHistoryResult} History functions
 */
export const useCanvasHistory = ({
  fabricCanvasRef,
  historyRef,
  maxHistoryLength = 20
}: UseCanvasHistoryProps): UseCanvasHistoryResult => {

  /**
   * Save the current canvas state for undo/redo
   */
  const saveCurrentState = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    try {
      // Clone all non-grid objects to prevent reference issues
      const currentObjects = canvas.getObjects().filter(obj => obj.objectType !== 'grid');
      
      // If there are no objects, don't save an empty state unless history is empty
      if (currentObjects.length === 0 && historyRef.current.past.length > 0) {
        return;
      }
      
      // Save current state to history
      historyRef.current.past.push(currentObjects);
      
      // Clear future states (redo stack)
      historyRef.current.future = [];
      
      // Limit history length
      if (historyRef.current.past.length > maxHistoryLength) {
        historyRef.current.past.shift();
      }
      
      console.log(`Canvas state saved. History: ${historyRef.current.past.length} states`);
    } catch (error) {
      console.error('Error saving canvas state:', error);
    }
  }, [fabricCanvasRef, historyRef, maxHistoryLength]);

  /**
   * Undo the last canvas action
   */
  const undo = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || historyRef.current.past.length === 0) {
      toast.info('Nothing to undo');
      return;
    }

    try {
      // Get current state for redo
      const currentObjects = canvas.getObjects().filter(obj => obj.objectType !== 'grid');
      historyRef.current.future.push(currentObjects);

      // Remove the current state from canvas
      canvas.remove(...currentObjects);

      // Get previous state
      const previousState = historyRef.current.past.pop();
      
      // If there's a previous state, restore it
      if (previousState && previousState.length > 0) {
        canvas.add(...previousState);
      }

      // Render the canvas
      canvas.requestRenderAll();
      
      toast.success('Undo successful');
    } catch (error) {
      console.error('Error during undo:', error);
      toast.error('Error during undo');
    }
  }, [fabricCanvasRef, historyRef]);

  /**
   * Redo the last undone canvas action
   */
  const redo = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || historyRef.current.future.length === 0) {
      toast.info('Nothing to redo');
      return;
    }

    try {
      // Get current state for undo
      const currentObjects = canvas.getObjects().filter(obj => obj.objectType !== 'grid');
      historyRef.current.past.push(currentObjects);

      // Remove current state from canvas
      canvas.remove(...currentObjects);

      // Get next state from future
      const nextState = historyRef.current.future.pop();
      
      // If there's a next state, restore it
      if (nextState && nextState.length > 0) {
        canvas.add(...nextState);
      }

      // Render the canvas
      canvas.requestRenderAll();
      
      toast.success('Redo successful');
    } catch (error) {
      console.error('Error during redo:', error);
      toast.error('Error during redo');
    }
  }, [fabricCanvasRef, historyRef]);

  /**
   * Clear all history
   */
  const clearHistory = useCallback(() => {
    historyRef.current = {
      past: [],
      future: []
    };
    console.log('History cleared');
  }, [historyRef]);

  return {
    saveCurrentState,
    undo,
    redo,
    clearHistory
  };
};
