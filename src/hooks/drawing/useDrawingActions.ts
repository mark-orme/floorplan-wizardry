
import { useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { useDrawingHistory } from './useDrawingHistory';
import { Canvas } from 'fabric';
import { ExtendedFabricCanvas } from '@/types/fabric-unified';

export interface UseDrawingActionsProps {
  fabricCanvasRef?: React.MutableRefObject<Canvas | null>;
}

export const useDrawingActions = ({ fabricCanvasRef }: UseDrawingActionsProps = {}) => {
  // Create a ref to handle both the input ref and our internal ref
  const actualCanvasRef = fabricCanvasRef || useRef<Canvas | null>(null);
  
  // Pass the ref to useDrawingHistory
  const { undo, redo, saveState } = useDrawingHistory({ 
    fabricCanvasRef: actualCanvasRef 
  });
  
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
    if ('backgroundColor' in canvas) {
      (canvas as any).backgroundColor = '#ffffff';
    }
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
      const json = JSON.stringify((canvas as any).toJSON ? (canvas as any).toJSON() : {});
      
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
    fabricCanvasRef: actualCanvasRef
  };
};
