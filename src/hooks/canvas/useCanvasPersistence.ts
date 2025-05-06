import { useCallback } from 'react';

interface UseCanvasPersistenceProps {
  saveToLocalStorage: (key: string, data: any) => void;
  loadFromLocalStorage: (key: string) => any;
}

export const useCanvasPersistence = ({
  saveToLocalStorage,
  loadFromLocalStorage
}: UseCanvasPersistenceProps) => {
  const saveCanvasState = useCallback((canvasId: string | undefined, canvasState: any) => {
    // Use default ID if undefined
    const id = canvasId || 'default-canvas-id';
    saveToLocalStorage(id, canvasState);
  }, [saveToLocalStorage]);

  const loadCanvasState = useCallback((canvasId: string | undefined) => {
    // Use default ID if undefined
    const id = canvasId || 'default-canvas-id';
    return loadFromLocalStorage(id);
  }, [loadFromLocalStorage]);

  return {
    saveCanvasState,
    loadCanvasState
  };
};
