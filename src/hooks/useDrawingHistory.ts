
import { useState, useCallback } from 'react';
import { fabric } from 'fabric';

interface UseDrawingHistoryProps {
  fabricCanvasRef: React.MutableRefObject<fabric.Canvas | null>;
  maxHistorySize?: number;
}

export const useDrawingHistory = ({
  fabricCanvasRef,
  maxHistorySize = 30
}: UseDrawingHistoryProps) => {
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [history, setHistory] = useState<{
    past: string[];
    future: string[];
  }>({
    past: [],
    future: []
  });
  
  const saveState = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    try {
      // Get the current canvas state as JSON
      const json = canvas.toJSON(['id', 'name', 'customType']);
      const jsonString = JSON.stringify(json);
      
      setHistory(prevHistory => {
        const newPast = [...prevHistory.past, jsonString].slice(-maxHistorySize);
        
        // When we perform a new action, future becomes empty
        return {
          past: newPast,
          future: []
        };
      });
      
      setCanUndo(true);
      setCanRedo(false);
    } catch (error) {
      console.error('Error saving canvas state:', error);
    }
  }, [fabricCanvasRef, maxHistorySize]);
  
  const undo = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || history.past.length <= 1) return;
    
    try {
      const newPast = [...history.past];
      const current = newPast.pop(); // Current state (to be undone)
      const previous = newPast[newPast.length - 1]; // Previous state to restore
      
      if (current && previous) {
        // Load the previous state
        canvas.loadFromJSON(JSON.parse(previous), () => {
          canvas.renderAll();
        });
        
        // Update history
        setHistory({
          past: newPast,
          future: [current, ...history.future].slice(0, maxHistorySize)
        });
        
        setCanUndo(newPast.length > 1);
        setCanRedo(true);
      }
    } catch (error) {
      console.error('Error during undo:', error);
    }
  }, [fabricCanvasRef, history, maxHistorySize]);
  
  const redo = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || history.future.length === 0) return;
    
    try {
      const [next, ...newFuture] = history.future;
      
      if (next) {
        // Load the next state
        canvas.loadFromJSON(JSON.parse(next), () => {
          canvas.renderAll();
        });
        
        // Update history
        setHistory({
          past: [...history.past, next].slice(-maxHistorySize),
          future: newFuture
        });
        
        setCanUndo(true);
        setCanRedo(newFuture.length > 0);
      }
    } catch (error) {
      console.error('Error during redo:', error);
    }
  }, [fabricCanvasRef, history, maxHistorySize]);
  
  return {
    saveState,
    undo,
    redo,
    canUndo,
    canRedo
  };
};
