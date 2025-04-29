import { useRef, useCallback } from 'react';
import { Canvas } from 'fabric';
import { ExtendedFabricCanvas } from '@/types/canvas-types';

export const useDrawingHistory = (canvas: Canvas | ExtendedFabricCanvas | null) => {
  const historyRef = useRef<{ past: any[], future: any[] }>({ past: [], future: [] });
  
  const saveState = useCallback(() => {
    if (!canvas) return;
    
    const currentState = (canvas as any).toObject ? (canvas as any).toObject() : null;
    
    if (currentState) {
      historyRef.current.past.push(currentState);
      historyRef.current.future = [];
    }
  }, [canvas]);
  
  const undo = useCallback(() => {
    if (!canvas || historyRef.current.past.length === 0) return;
    
    const lastState = historyRef.current.past.pop();
    if (lastState) {
      historyRef.current.future.unshift((canvas as any).toObject ? (canvas as any).toObject() : null);
      canvas.loadFromJSON(lastState, () => {
        canvas.renderAll();
      });
    }
  }, [canvas]);
  
  const redo = useCallback(() => {
    if (!canvas || historyRef.current.future.length === 0) return;
    
    const nextState = historyRef.current.future.shift();
    if (nextState) {
      historyRef.current.past.push((canvas as any).toObject ? (canvas as any).toObject() : null);
      canvas.loadFromJSON(nextState, () => {
        canvas.renderAll();
      });
    }
  }, [canvas]);
  
  return { 
    canUndo: historyRef.current.past.length > 0,
    canRedo: historyRef.current.future.length > 0,
    undo,
    redo,
    saveState
  };
};
