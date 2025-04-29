
import { useState, useRef, useCallback } from 'react';
import { Canvas } from 'fabric';

type HistoryEntry = {
  objects: any[];
  viewportTransform?: number[];
};

interface UseCanvasHistoryManagementProps {
  canvas: Canvas | null;
  maxHistoryEntries?: number;
}

export const useCanvasHistoryManagement = ({ 
  canvas, 
  maxHistoryEntries = 50 
}: UseCanvasHistoryManagementProps) => {
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  
  const historyRef = useRef<{
    past: HistoryEntry[];
    future: HistoryEntry[];
    isRecording: boolean;
  }>({
    past: [],
    future: [],
    isRecording: true
  });
  
  // Save current state to history
  const saveCurrentState = useCallback(() => {
    if (!canvas || !historyRef.current.isRecording) return;

    try {
      const currentState: HistoryEntry = {
        objects: canvas.getObjects().map(obj => obj.toJSON()),
        viewportTransform: canvas.viewportTransform
      };
      
      historyRef.current.past.push(currentState);
      
      // Limit history size
      if (historyRef.current.past.length > maxHistoryEntries) {
        historyRef.current.past.shift();
      }
      
      // Clear future when new action is performed
      historyRef.current.future = [];
      
      setCanUndo(historyRef.current.past.length > 0);
      setCanRedo(false);
    } catch (error) {
      console.error('Error saving canvas state:', error);
    }
  }, [canvas, maxHistoryEntries]);
  
  // Undo last action
  const undo = useCallback(() => {
    if (!canvas || historyRef.current.past.length === 0) return;
    
    try {
      // Temporarily disable recording to avoid saving this state change
      historyRef.current.isRecording = false;
      
      // Get current state before undoing
      const currentState: HistoryEntry = {
        objects: canvas.getObjects().map(obj => obj.toJSON()),
        viewportTransform: canvas.viewportTransform
      };
      
      // Move current state to future
      historyRef.current.future.unshift(currentState);
      
      // Get previous state
      const previousState = historyRef.current.past.pop();
      if (previousState) {
        // Clear canvas and load previous state
        canvas.clear();
        
        // Restore objects
        if (previousState.objects) {
          canvas.loadFromJSON({ objects: previousState.objects }, () => {
            canvas.renderAll();
          });
        }
        
        // Restore viewport transform
        if (previousState.viewportTransform) {
          canvas.viewportTransform = previousState.viewportTransform;
        }
      }
      
      setCanUndo(historyRef.current.past.length > 0);
      setCanRedo(historyRef.current.future.length > 0);
      
      // Re-enable recording
      historyRef.current.isRecording = true;
    } catch (error) {
      console.error('Error undoing canvas action:', error);
      historyRef.current.isRecording = true;
    }
  }, [canvas]);
  
  // Redo previously undone action
  const redo = useCallback(() => {
    if (!canvas || historyRef.current.future.length === 0) return;
    
    try {
      // Temporarily disable recording to avoid saving this state change
      historyRef.current.isRecording = false;
      
      // Get current state before redoing
      const currentState: HistoryEntry = {
        objects: canvas.getObjects().map(obj => obj.toJSON()),
        viewportTransform: canvas.viewportTransform
      };
      
      // Move current state to past
      historyRef.current.past.push(currentState);
      
      // Get next state
      const nextState = historyRef.current.future.shift();
      if (nextState) {
        // Clear canvas and load next state
        canvas.clear();
        
        // Restore objects
        if (nextState.objects) {
          canvas.loadFromJSON({ objects: nextState.objects }, () => {
            canvas.renderAll();
          });
        }
        
        // Restore viewport transform
        if (nextState.viewportTransform) {
          canvas.viewportTransform = nextState.viewportTransform;
        }
      }
      
      setCanUndo(historyRef.current.past.length > 0);
      setCanRedo(historyRef.current.future.length > 0);
      
      // Re-enable recording
      historyRef.current.isRecording = true;
    } catch (error) {
      console.error('Error redoing canvas action:', error);
      historyRef.current.isRecording = true;
    }
  }, [canvas]);
  
  // Delete selected objects
  const deleteSelectedObjects = useCallback(() => {
    if (!canvas) return;
    
    // Save state before deletion
    saveCurrentState();
    
    // Delete selected objects
    const activeObjects = canvas.getActiveObjects();
    if (!activeObjects || activeObjects.length === 0) return;
    
    if (activeObjects.length === 1) {
      canvas.remove(activeObjects[0]);
    } else {
      activeObjects.forEach(obj => {
        canvas.remove(obj);
      });
      canvas.discardActiveObject();
    }
    
    canvas.renderAll();
    
    // Save state after deletion
    saveCurrentState();
  }, [canvas, saveCurrentState]);
  
  return {
    undo,
    redo,
    saveCurrentState,
    deleteSelectedObjects,
    canUndo,
    canRedo
  };
};
