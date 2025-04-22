
import { useCallback } from 'react';
import { toast } from 'sonner';
import { useDrawingHistory } from './useDrawingHistory';
import { Canvas as FabricCanvas } from 'fabric';

export interface UseDrawingActionsProps {
  canvas?: FabricCanvas | null;
}

export const useDrawingActions = ({ canvas }: UseDrawingActionsProps = {}) => {
  const { undo, redo, saveState } = useDrawingHistory({ canvas });
  
  const handleUndo = useCallback(() => {
    undo();
    toast.info('Undo action');
  }, [undo]);

  const handleRedo = useCallback(() => {
    redo();
    toast.info('Redo action');
  }, [redo]);

  const handleClear = useCallback(() => {
    if (!canvas) return;
    
    canvas.clear();
    canvas.backgroundColor = '#ffffff';
    canvas.renderAll();
    
    // Save the empty state to history
    saveState();
    
    toast.info('Canvas cleared');
  }, [canvas, saveState]);

  const handleSave = useCallback(() => {
    if (!canvas) return;
    
    try {
      // Convert canvas to JSON
      const json = JSON.stringify(canvas.toJSON());
      
      // Here you would typically save to a backend or localStorage
      localStorage.setItem('savedDrawing', json);
      
      toast.success('Saved successfully');
    } catch (error) {
      console.error('Error saving canvas:', error);
      toast.error('Failed to save');
    }
  }, [canvas]);

  return {
    handleUndo,
    handleRedo,
    handleClear,
    handleSave
  };
};
