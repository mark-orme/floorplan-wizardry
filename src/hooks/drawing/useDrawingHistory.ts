
import { useState, useCallback, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';

export interface UseDrawingHistoryProps {
  maxHistorySteps?: number;
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
}

export interface UseDrawingHistoryResult {
  undo: () => void;
  redo: () => void;
  saveState: () => void;
  canUndo: boolean;
  canRedo: boolean;
  getHistory: () => { pastSteps: number; futureSteps: number };
}

export const useDrawingHistory = ({
  maxHistorySteps = 20,
  fabricCanvasRef
}: UseDrawingHistoryProps): UseDrawingHistoryResult => {
  const [past, setPast] = useState<any[]>([]);
  const [future, setFuture] = useState<any[]>([]);
  const isBatchingRef = useRef(false);

  const saveState = useCallback(() => {
    // Don't save if we're in the middle of a batch operation
    if (isBatchingRef.current) return;

    // Get the canvas
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    // Save the current state
    const currentState = canvas.toObject();
    
    // Add to history, maintaining the limit
    setPast(prevPast => {
      const newPast = [...prevPast, currentState];
      if (newPast.length > maxHistorySteps) {
        return newPast.slice(newPast.length - maxHistorySteps);
      }
      return newPast;
    });
    
    // Clear future states when a new action is performed
    setFuture([]);
  }, [fabricCanvasRef, maxHistorySteps]);

  const undo = useCallback(() => {
    // Get the canvas
    const canvas = fabricCanvasRef.current;
    if (!canvas || past.length === 0) return;

    // Set batching flag to prevent saveState calls during restoration
    isBatchingRef.current = true;
    
    // Remove the last state from past
    const newPast = [...past];
    const currentState = canvas.toObject();
    const prevState = newPast.pop();
    
    // Update the states
    setPast(newPast);
    setFuture([currentState, ...future]);
    
    // Restore the canvas to the previous state
    canvas.loadFromJSON(prevState, () => {
      canvas.renderAll();
      isBatchingRef.current = false;
    });
  }, [fabricCanvasRef, past, future]);

  const redo = useCallback(() => {
    // Get the canvas
    const canvas = fabricCanvasRef.current;
    if (!canvas || future.length === 0) return;

    // Set batching flag to prevent saveState calls during restoration
    isBatchingRef.current = true;
    
    // Remove the first state from future
    const newFuture = [...future];
    const currentState = canvas.toObject();
    const nextState = newFuture.shift();
    
    // Update the states
    setPast([...past, currentState]);
    setFuture(newFuture);
    
    // Restore the canvas to the next state
    canvas.loadFromJSON(nextState, () => {
      canvas.renderAll();
      isBatchingRef.current = false;
    });
  }, [fabricCanvasRef, past, future]);

  const getHistory = useCallback(() => {
    return {
      pastSteps: past.length,
      futureSteps: future.length
    };
  }, [past, future]);

  return {
    undo,
    redo,
    saveState,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
    getHistory
  };
};
