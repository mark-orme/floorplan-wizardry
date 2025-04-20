import { useCallback, useState, useRef } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';

export interface UseDrawingHistoryProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  maxHistorySize?: number;
}

export interface UseDrawingHistoryResult {
  canUndo: boolean;
  canRedo: boolean;
  saveState: () => void;
  undo: () => void;
  redo: () => void;
  clearHistory: () => void;
  history: {
    past: FabricObject[][];
    future: FabricObject[][];
  };
}

/**
 * Hook for managing canvas drawing history (undo/redo)
 */
export const useDrawingHistory = ({
  fabricCanvasRef,
  maxHistorySize = 50
}: UseDrawingHistoryProps): UseDrawingHistoryResult => {
  // Keep past and future states
  const historyRef = useRef<{
    past: FabricObject[][];
    future: FabricObject[][];
  }>({
    past: [],
    future: []
  });
  
  // State to trigger re-renders
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  
  // Save current canvas state to history
  const saveState = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    const currentObjects = canvas.getObjects();
    
    // Create a deep copy of objects
    const objectsCopy = currentObjects.map(obj => {
      return canvas.getPointerCoords 
        ? obj.clone() // fabric v6+
        : obj.toObject(); // older fabric
    });
    
    // Add to history
    historyRef.current.past.push(objectsCopy as any);
    historyRef.current.future = [];
    
    // Limit history size
    if (historyRef.current.past.length > maxHistorySize) {
      historyRef.current.past.shift();
    }
    
    // Update UI state
    setCanUndo(historyRef.current.past.length > 0);
    setCanRedo(false);
  }, [fabricCanvasRef, maxHistorySize]);
  
  // Undo last action
  const undo = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || historyRef.current.past.length === 0) return;
    
    // Save current state to future for redo
    const currentObjects = canvas.getObjects();
    const objectsCopy = currentObjects.map(obj => {
      return canvas.getPointerCoords 
        ? obj.clone() // fabric v6+
        : obj.toObject(); // older fabric
    });
    
    historyRef.current.future.push(objectsCopy as any);
    
    // Get previous state
    const previousState = historyRef.current.past.pop();
    
    // Clear canvas
    canvas.clear();
    
    // Restore objects from previous state
    if (previousState) {
      previousState.forEach(objData => {
        // For cloned objects (fabric v6+)
        if (objData instanceof FabricObject) {
          canvas.add(objData);
        } 
        // For serialized objects
        else {
          try {
            const klass = FabricCanvas.getClass(objData.type);
            if (klass) {
              const obj = klass.fromObject(objData);
              canvas.add(obj);
            }
          } catch (error) {
            console.error('Error restoring object:', error);
          }
        }
      });
    }
    
    canvas.requestRenderAll();
    
    // Update UI state
    setCanUndo(historyRef.current.past.length > 0);
    setCanRedo(historyRef.current.future.length > 0);
  }, [fabricCanvasRef]);
  
  // Redo last undone action
  const redo = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || historyRef.current.future.length === 0) return;
    
    // Save current state to past for undo
    const currentObjects = canvas.getObjects();
    const objectsCopy = currentObjects.map(obj => {
      return canvas.getPointerCoords 
        ? obj.clone() // fabric v6+
        : obj.toObject(); // older fabric
    });
    
    historyRef.current.past.push(objectsCopy as any);
    
    // Get next state
    const nextState = historyRef.current.future.pop();
    
    // Clear canvas
    canvas.clear();
    
    // Restore objects from next state
    if (nextState) {
      nextState.forEach(objData => {
        // For cloned objects (fabric v6+)
        if (objData instanceof FabricObject) {
          canvas.add(objData);
        } 
        // For serialized objects
        else {
          try {
            const klass = FabricCanvas.getClass(objData.type);
            if (klass) {
              const obj = klass.fromObject(objData);
              canvas.add(obj);
            }
          } catch (error) {
            console.error('Error restoring object:', error);
          }
        }
      });
    }
    
    canvas.requestRenderAll();
    
    // Update UI state
    setCanUndo(historyRef.current.past.length > 0);
    setCanRedo(historyRef.current.future.length > 0);
  }, [fabricCanvasRef]);
  
  // Clear all history
  const clearHistory = useCallback(() => {
    historyRef.current = {
      past: [],
      future: []
    };
    setCanUndo(false);
    setCanRedo(false);
  }, []);
  
  return {
    canUndo,
    canRedo,
    saveState,
    undo,
    redo,
    clearHistory,
    history: historyRef.current
  };
};
