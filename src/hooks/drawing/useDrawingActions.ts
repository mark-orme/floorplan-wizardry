
import { useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { useDrawingHistory } from './useDrawingHistory';
import { Canvas as FabricCanvas } from 'fabric';
import { ExtendedFabricCanvas } from '@/types/canvas-types';

export interface UseDrawingActionsProps {
  fabricCanvasRef?: React.MutableRefObject<FabricCanvas | ExtendedFabricCanvas | null>;
}

export const useDrawingActions = ({ fabricCanvasRef }: UseDrawingActionsProps = {}) => {
  const canvasRef = useRef<FabricCanvas | ExtendedFabricCanvas | null>(null);
  const { undo, redo, saveState } = useDrawingHistory(canvasRef.current);
  
  const handleUndo = useCallback(() => {
    undo();
    toast.info('Undo action');
  }, [undo]);

  const handleRedo = useCallback(() => {
    redo();
    toast.info('Redo action');
  }, [redo]);

  const handleClear = useCallback(() => {
    if (!fabricCanvasRef?.current) return;
    
    const canvas = fabricCanvasRef.current;
    canvas.clear();
    canvas.backgroundColor = '#ffffff';
    canvas.renderAll();
    
    // Save the empty state to history
    saveState();
    
    toast.info('Canvas cleared');
  }, [fabricCanvasRef, saveState]);

  const handleSave = useCallback(() => {
    if (!fabricCanvasRef?.current) return;
    
    try {
      const canvas = fabricCanvasRef.current;
      // Convert canvas to JSON
      const json = JSON.stringify(canvas.toJSON());
      
      // Here you would typically save to a backend or localStorage
      localStorage.setItem('savedDrawing', json);
      
      toast.success('Saved successfully');
    } catch (error) {
      console.error('Error saving canvas:', error);
      toast.error('Failed to save');
    }
  }, [fabricCanvasRef]);

  return {
    handleUndo,
    handleRedo,
    handleClear,
    handleSave,
    fabricCanvasRef
  };
};
