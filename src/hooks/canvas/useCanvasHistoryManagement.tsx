import { useState, useCallback, useRef } from 'react';
import { Canvas } from 'fabric';
import { captureMessage } from '@/utils/sentryUtils';

interface UseCanvasHistoryManagementProps {
  canvasRef: React.MutableRefObject<Canvas | null>;
  maxHistorySize?: number;
}

export const useCanvasHistoryManagement = ({
  canvasRef,
  maxHistorySize = 20
}: UseCanvasHistoryManagementProps) => {
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const isPristine = useRef(true);

  const saveState = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const json = canvas.toJSON();
      setHistory(prevHistory => {
        const newHistory = [...prevHistory.slice(0, historyIndex + 1), JSON.stringify(json)];
        
        // Trim history if it exceeds maxHistorySize
        if (newHistory.length > maxHistorySize) {
          newHistory.splice(0, newHistory.length - maxHistorySize);
        }
        
        return newHistory;
      });
      setHistoryIndex(prevIndex => Math.min(prevIndex + 1, maxHistorySize - 1));
      isPristine.current = false;
    } catch (error) {
      captureMessage('Failed to save canvas state', {
        level: 'error',
        tags: { feature: 'canvas-history' },
        extra: { error: String(error) }
      });
    }
  }, [canvasRef, historyIndex, maxHistorySize]);

  const undo = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (historyIndex > 0) {
      try {
        const prevIndex = historyIndex - 1;
        const json = history[prevIndex];
        
        if (json) {
          canvas.loadFromJSON(json, () => {
            canvas.renderAll();
            setHistoryIndex(prevIndex);
          });
        }
      } catch (error) {
        captureMessage('Failed to undo canvas state', {
          level: 'error',
          tags: { feature: 'canvas-history' },
          extra: { error: String(error) }
        });
      }
    }
  }, [canvasRef, history, historyIndex]);

  const redo = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (historyIndex < history.length - 1) {
      try {
        const nextIndex = historyIndex + 1;
        const json = history[nextIndex];
        
        if (json) {
          canvas.loadFromJSON(json, () => {
            canvas.renderAll();
            setHistoryIndex(nextIndex);
          });
        }
      } catch (error) {
        captureMessage('Failed to redo canvas state', {
          level: 'error',
          tags: { feature: 'canvas-history' },
          extra: { error: String(error) }
        });
      }
    }
  }, [canvasRef, history, historyIndex]);

  const resetHistory = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      setHistory([]);
      setHistoryIndex(-1);
      isPristine.current = true;
      
      // Load initial state if available
      const initialJson = history[0];
      if (initialJson) {
        canvas.loadFromJSON(initialJson, () => {
          canvas.renderAll();
        });
      } else {
        canvas.clear();
        canvas.renderAll();
      }
    } catch (error) {
      captureMessage('Failed to reset canvas history', {
        level: 'error',
        tags: { feature: 'canvas-history' },
        extra: { error: String(error) }
      });
    }
  }, [canvasRef, history]);

  return {
    saveState,
    undo,
    redo,
    resetHistory,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    isPristine: isPristine.current
  };
};
