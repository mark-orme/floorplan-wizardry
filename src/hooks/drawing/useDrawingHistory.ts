
import { useState, useCallback, useRef } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { toast } from 'sonner';

export interface UseDrawingHistoryProps {
  canvas?: FabricCanvas | null;
  maxHistorySteps?: number;
}

export const useDrawingHistory = ({
  canvas,
  maxHistorySteps = 50
}: UseDrawingHistoryProps = {}) => {
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  
  // Using refs to avoid unnecessary re-renders
  const historyRef = useRef<{
    past: string[];
    future: string[];
    current: string | null;
  }>({
    past: [],
    future: [],
    current: null
  });
  
  // Save current state to history
  const saveState = useCallback(() => {
    if (!canvas) return;
    
    try {
      const json = JSON.stringify(canvas.toJSON(['id', 'selectable', 'evented']));
      
      if (json === historyRef.current.current) return; // No changes
      
      const newPast = [...historyRef.current.past];
      if (historyRef.current.current) {
        newPast.push(historyRef.current.current);
      }
      
      // Limit history size
      while (newPast.length > maxHistorySteps) {
        newPast.shift();
      }
      
      historyRef.current = {
        past: newPast,
        current: json,
        future: []
      };
      
      setCanUndo(newPast.length > 0);
      setCanRedo(false);
    } catch (error) {
      console.error('Error saving drawing state:', error);
    }
  }, [canvas, maxHistorySteps]);
  
  // Undo last action
  const undo = useCallback(() => {
    if (!canvas || historyRef.current.past.length === 0) return;
    
    try {
      const lastState = historyRef.current.past.pop();
      const newFuture = [...historyRef.current.future];
      
      if (historyRef.current.current) {
        newFuture.unshift(historyRef.current.current);
      }
      
      historyRef.current = {
        past: [...historyRef.current.past],
        current: lastState || null,
        future: newFuture
      };
      
      if (lastState) {
        canvas.loadFromJSON(JSON.parse(lastState), () => {
          canvas.renderAll();
          toast.info('Undo successful');
        });
      }
      
      setCanUndo(historyRef.current.past.length > 0);
      setCanRedo(true);
    } catch (error) {
      console.error('Error during undo:', error);
      toast.error('Failed to undo');
    }
  }, [canvas]);
  
  // Redo last undone action
  const redo = useCallback(() => {
    if (!canvas || historyRef.current.future.length === 0) return;
    
    try {
      const nextState = historyRef.current.future.shift();
      const newPast = [...historyRef.current.past];
      
      if (historyRef.current.current) {
        newPast.push(historyRef.current.current);
      }
      
      historyRef.current = {
        past: newPast,
        current: nextState || null,
        future: [...historyRef.current.future]
      };
      
      if (nextState) {
        canvas.loadFromJSON(JSON.parse(nextState), () => {
          canvas.renderAll();
          toast.info('Redo successful');
        });
      }
      
      setCanUndo(true);
      setCanRedo(historyRef.current.future.length > 0);
    } catch (error) {
      console.error('Error during redo:', error);
      toast.error('Failed to redo');
    }
  }, [canvas]);
  
  return {
    canUndo,
    canRedo,
    saveState,
    undo,
    redo,
    
    // Expose history for external use if needed
    getHistory: () => ({
      pastSteps: historyRef.current.past.length,
      futureSteps: historyRef.current.future.length
    })
  };
};
