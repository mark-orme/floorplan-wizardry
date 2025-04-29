
import { useState, useCallback, useRef } from 'react';
import { fabric } from 'fabric';
import { toast } from 'sonner';
import { captureMessage } from '@/utils/sentryUtils';

export const useFloorPlanDrawing = () => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [activeObjects, setActiveObjects] = useState<fabric.Object[]>([]);
  const canvasRef = useRef<fabric.Canvas | null>(null);
  
  const historyRef = useRef<{
    past: any[];
    future: any[];
  }>({
    past: [],
    future: []
  });

  // Initialize the canvas
  const initCanvas = useCallback((canvas: fabric.Canvas) => {
    if (!canvas) return;
    
    canvasRef.current = canvas;
    
    // Add event listeners
    canvas.on('object:added', () => {
      saveState();
      captureMessage('Object added to canvas');
    });
    
    canvas.on('object:modified', () => {
      saveState();
      captureMessage('Object modified on canvas');
    });
    
    canvas.on('selection:created', (e: any) => {
      if (e.selected) setActiveObjects(e.selected);
      captureMessage('Selection created on canvas');
    });
    
    canvas.on('selection:updated', (e: any) => {
      if (e.selected) setActiveObjects(e.selected);
      captureMessage('Selection updated on canvas');
    });
    
    canvas.on('selection:cleared', () => {
      setActiveObjects([]);
      captureMessage('Selection cleared on canvas');
    });
    
    // Save initial state
    saveState();
  }, []);

  // Save the current canvas state to history
  const saveState = useCallback(() => {
    if (!canvasRef.current) return;
    
    try {
      const canvas = canvasRef.current;
      const json = canvas.toJSON();
      
      historyRef.current.past.push(json);
      historyRef.current.future = [];
      
      setCanUndo(historyRef.current.past.length > 0);
      setCanRedo(false);
      
      captureMessage('Canvas state saved', { level: 'debug' });
    } catch (error) {
      console.error('Error saving canvas state:', error);
    }
  }, []);

  // Undo the last action
  const undo = useCallback(() => {
    if (!canvasRef.current || historyRef.current.past.length === 0) return;
    
    try {
      const canvas = canvasRef.current;
      const currentState = canvas.toJSON();
      const previousState = historyRef.current.past.pop();
      
      historyRef.current.future.unshift(currentState);
      
      canvas.loadFromJSON(previousState, () => {
        canvas.renderAll();
        
        setCanUndo(historyRef.current.past.length > 0);
        setCanRedo(true);
        
        toast.info('Undo successful');
        captureMessage('Undo action performed', { level: 'debug' });
      });
    } catch (error) {
      console.error('Error undoing action:', error);
      toast.error('Failed to undo');
    }
  }, []);

  // Redo the last undone action
  const redo = useCallback(() => {
    if (!canvasRef.current || historyRef.current.future.length === 0) return;
    
    try {
      const canvas = canvasRef.current;
      const currentState = canvas.toJSON();
      const nextState = historyRef.current.future.shift();
      
      historyRef.current.past.push(currentState);
      
      canvas.loadFromJSON(nextState, () => {
        canvas.renderAll();
        
        setCanUndo(true);
        setCanRedo(historyRef.current.future.length > 0);
        
        toast.info('Redo successful');
        captureMessage('Redo action performed', { level: 'debug' });
      });
    } catch (error) {
      console.error('Error redoing action:', error);
      toast.error('Failed to redo');
    }
  }, []);

  // Clear the canvas
  const clearCanvas = useCallback(() => {
    if (!canvasRef.current) return;
    
    try {
      const canvas = canvasRef.current;
      
      saveState();
      canvas.clear();
      canvas.backgroundColor = '#ffffff';
      canvas.renderAll();
      saveState();
      
      toast.info('Canvas cleared');
      captureMessage('Canvas cleared', { level: 'debug' });
    } catch (error) {
      console.error('Error clearing canvas:', error);
      toast.error('Failed to clear canvas');
    }
  }, [saveState]);

  // Delete selected objects
  const deleteSelected = useCallback(() => {
    if (!canvasRef.current) return;
    
    try {
      const canvas = canvasRef.current;
      const selectedObjects = canvas.getActiveObjects();
      
      if (!selectedObjects || selectedObjects.length === 0) {
        toast.info('Nothing selected to delete');
        return;
      }
      
      saveState();
      
      if (selectedObjects.length === 1) {
        canvas.remove(selectedObjects[0]);
      } else {
        canvas.remove(...selectedObjects);
        canvas.discardActiveObject();
      }
      
      canvas.renderAll();
      saveState();
      
      toast.info(`Deleted ${selectedObjects.length} object(s)`);
      captureMessage('Objects deleted from canvas', { level: 'debug' });
    } catch (error) {
      console.error('Error deleting objects:', error);
      toast.error('Failed to delete objects');
    }
  }, [saveState]);

  return {
    initCanvas,
    canvasRef,
    isDrawing,
    setIsDrawing,
    canUndo,
    canRedo,
    undo,
    redo,
    saveState,
    clearCanvas,
    deleteSelected,
    activeObjects
  };
};
