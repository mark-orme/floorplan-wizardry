
import { useCallback, useRef, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';

interface DrawingState {
  previousStates: string[];
  currentStateIndex: number;
  maxStates: number;
}

interface UseDrawingToolsProps {
  canvas: FabricCanvas | null;
  maxUndoSteps?: number;
}

export const useDrawingTools = ({
  canvas,
  maxUndoSteps = 20
}: UseDrawingToolsProps) => {
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Use a ref to avoid re-renders on state updates
  const stateRef = useRef<DrawingState>({
    previousStates: [],
    currentStateIndex: -1,
    maxStates: maxUndoSteps
  });
  
  // Save canvas state for undo
  const saveState = useCallback(() => {
    if (!canvas || isSaving) return;
    
    setIsSaving(true);
    
    try {
      // Convert canvas to JSON
      const json = JSON.stringify(canvas.toJSON());
      
      const state = stateRef.current;
      
      // If we're not at the end of the undo history, remove future states
      if (state.currentStateIndex < state.previousStates.length - 1) {
        state.previousStates = state.previousStates.slice(0, state.currentStateIndex + 1);
      }
      
      // Add current state
      state.previousStates.push(json);
      
      // Limit number of states
      if (state.previousStates.length > state.maxStates) {
        state.previousStates.shift();
      } else {
        state.currentStateIndex++;
      }
      
      // Update undo/redo availability
      setCanUndo(state.currentStateIndex > 0);
      setCanRedo(state.currentStateIndex < state.previousStates.length - 1);
    } catch (error) {
      console.error('Failed to save canvas state:', error);
    } finally {
      setIsSaving(false);
    }
  }, [canvas, isSaving]);
  
  // Undo last action
  const undo = useCallback(() => {
    if (!canvas) return;
    
    const state = stateRef.current;
    
    // Check if we can undo
    if (state.currentStateIndex <= 0) {
      setCanUndo(false);
      return;
    }
    
    // Move back in history
    state.currentStateIndex--;
    
    // Get previous state
    const previousState = state.previousStates[state.currentStateIndex];
    
    if (previousState) {
      // Load previous state
      canvas.loadFromJSON(previousState, () => {
        canvas.renderAll();
        
        // Update undo/redo availability
        setCanUndo(state.currentStateIndex > 0);
        setCanRedo(state.currentStateIndex < state.previousStates.length - 1);
      });
    }
  }, [canvas]);
  
  // Redo last undone action
  const redo = useCallback(() => {
    if (!canvas) return;
    
    const state = stateRef.current;
    
    // Check if we can redo
    if (state.currentStateIndex >= state.previousStates.length - 1) {
      setCanRedo(false);
      return;
    }
    
    // Move forward in history
    state.currentStateIndex++;
    
    // Get next state
    const nextState = state.previousStates[state.currentStateIndex];
    
    if (nextState) {
      // Load next state
      canvas.loadFromJSON(nextState, () => {
        canvas.renderAll();
        
        // Update undo/redo availability
        setCanUndo(state.currentStateIndex > 0);
        setCanRedo(state.currentStateIndex < state.previousStates.length - 1);
      });
    }
  }, [canvas]);
  
  // Clear the canvas
  const clearCanvas = useCallback(() => {
    if (!canvas) return;
    
    // Save current state before clearing
    saveState();
    
    // Clear canvas
    canvas.clear();
    canvas.backgroundColor = '#ffffff';
    canvas.renderAll();
  }, [canvas, saveState]);
  
  // Delete selected objects
  const deleteSelectedObjects = useCallback(() => {
    if (!canvas) return;
    
    // Save current state before deleting
    saveState();
    
    // Delete selected objects
    const activeObjects = canvas.getActiveObjects();
    if (activeObjects.length) {
      canvas.remove(...activeObjects);
      canvas.discardActiveObject();
      canvas.renderAll();
    }
  }, [canvas, saveState]);
  
  return {
    saveState,
    undo,
    redo,
    clearCanvas,
    deleteSelectedObjects,
    canUndo,
    canRedo
  };
};

export default useDrawingTools;
