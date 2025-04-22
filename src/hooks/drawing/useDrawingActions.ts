
import { useCallback } from 'react';
import { toast } from 'sonner';

export const useDrawingActions = () => {
  const handleUndo = useCallback(() => {
    toast.info('Undo action');
    // Implement undo logic
  }, []);

  const handleRedo = useCallback(() => {
    toast.info('Redo action');
    // Implement redo logic
  }, []);

  const handleClear = useCallback(() => {
    toast.info('Clear canvas');
    // Implement clear logic
  }, []);

  const handleSave = useCallback(() => {
    toast.success('Saved successfully');
    // Implement save logic
  }, []);

  return {
    handleUndo,
    handleRedo,
    handleClear,
    handleSave
  };
};
