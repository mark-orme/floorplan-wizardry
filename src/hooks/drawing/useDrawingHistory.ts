
import { useRef, useCallback } from 'react';
import { Canvas } from 'fabric';

interface UseDrawingHistoryProps {
  fabricCanvasRef: React.MutableRefObject<Canvas | null>;
}

export const useDrawingHistory = ({ fabricCanvasRef }: UseDrawingHistoryProps) => {
  const historyRef = useRef<{ past: any[], future: any[] }>({ past: [], future: [] });
  
  const saveState = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    const currentState = (canvas as any).toObject ? (canvas as any).toObject() : null;
    
    if (currentState) {
      historyRef.current.past.push(currentState);
      historyRef.current.future = [];
    }
  }, [fabricCanvasRef]);
  
  const undo = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || historyRef.current.past.length === 0) return;
    
    const lastState = historyRef.current.past.pop();
    if (lastState) {
      historyRef.current.future.unshift((canvas as any).toObject ? (canvas as any).toObject() : null);
      canvas.loadFromJSON(lastState, () => {
        canvas.renderAll();
      });
    }
  }, [fabricCanvasRef]);
  
  const redo = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || historyRef.current.future.length === 0) return;
    
    const nextState = historyRef.current.future.shift();
    if (nextState) {
      historyRef.current.past.push((canvas as any).toObject ? (canvas as any).toObject() : null);
      canvas.loadFromJSON(nextState, () => {
        canvas.renderAll();
      });
    }
  }, [fabricCanvasRef]);
  
  return { 
    canUndo: historyRef.current.past.length > 0,
    canRedo: historyRef.current.future.length > 0,
    undo,
    redo,
    saveState
  };
};
