
/**
 * Hook for managing drawing history (undo/redo functionality)
 * @module hooks/useDrawingHistory
 */
import { useRef, useCallback, useState } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { ICanvasMock } from '@/types/testing/ICanvasMock';

type CanvasType = FabricCanvas | ICanvasMock;

export interface UseDrawingHistoryProps {
  fabricCanvasRef: React.MutableRefObject<CanvasType | null>;
  clearDrawings?: () => void;
  recalculateGIA?: () => void;
}

export interface UseDrawingHistoryResult {
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  saveState: () => void;
  
  // Backwards compatibility with existing code
  handleUndo: () => void;
  handleRedo: () => void;
  saveCurrentState: () => void;
}

/**
 * Hook for managing drawing history (undo/redo functionality)
 * @param props Hook properties
 * @returns History state and functions
 */
export const useDrawingHistory = ({
  fabricCanvasRef,
  clearDrawings,
  recalculateGIA
}: UseDrawingHistoryProps): UseDrawingHistoryResult => {
  // Create a reference to store the history states
  const historyRef = useRef<{
    past: FabricObject[][];
    future: FabricObject[][];
  }>({ past: [], future: [] });
  
  // State to track if undo/redo is possible
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  // Function to save current canvas state
  const saveState = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Get all objects on the canvas
    const objects = canvas.getObjects();
    
    // Create a clone of the objects
    const clonedObjects = [...objects];
    
    // Add to past states and clear future
    historyRef.current.past.push(clonedObjects);
    historyRef.current.future = [];
    
    // Update state
    setCanUndo(true);
    setCanRedo(false);
  }, [fabricCanvasRef]);

  // Function to handle undo operation
  const undo = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    const { past, future } = historyRef.current;
    
    if (!canvas || past.length === 0) return;
    
    // Get current state and add to future
    const currentObjects = canvas.getObjects();
    future.unshift([...currentObjects]);
    
    // Get previous state
    const previousState = past.pop();
    
    // Clear canvas
    if (clearDrawings) {
      clearDrawings();
    } else {
      // Remove all objects from canvas
      const objectsToRemove = [...canvas.getObjects()];
      objectsToRemove.forEach((obj) => canvas.remove(obj));
    }
    
    // Add previous state objects
    if (previousState) {
      previousState.forEach((obj) => canvas.add(obj));
    }
    
    // Update canvas
    canvas.requestRenderAll();
    
    // Recalculate GIA if needed
    if (recalculateGIA) {
      recalculateGIA();
    }
    
    // Update state
    setCanUndo(past.length > 0);
    setCanRedo(true);
  }, [fabricCanvasRef, clearDrawings, recalculateGIA]);

  // Function to handle redo operation
  const redo = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    const { past, future } = historyRef.current;
    
    if (!canvas || future.length === 0) return;
    
    // Get current state and add to past
    const currentObjects = canvas.getObjects();
    past.push([...currentObjects]);
    
    // Get next state
    const nextState = future.shift();
    
    // Clear canvas
    if (clearDrawings) {
      clearDrawings();
    } else {
      // Remove all objects from canvas
      const objectsToRemove = [...canvas.getObjects()];
      objectsToRemove.forEach((obj) => canvas.remove(obj));
    }
    
    // Add next state objects
    if (nextState) {
      nextState.forEach((obj) => canvas.add(obj));
    }
    
    // Update canvas
    canvas.requestRenderAll();
    
    // Recalculate GIA if needed
    if (recalculateGIA) {
      recalculateGIA();
    }
    
    // Update state
    setCanUndo(true);
    setCanRedo(future.length > 0);
  }, [fabricCanvasRef, clearDrawings, recalculateGIA]);

  // For backwards compatibility
  const handleUndo = undo;
  const handleRedo = redo;
  const saveCurrentState = saveState;

  return {
    canUndo,
    canRedo,
    undo,
    redo,
    saveState,
    // For backwards compatibility
    handleUndo,
    handleRedo,
    saveCurrentState
  };
};
