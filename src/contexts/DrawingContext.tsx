
import React, { createContext, useContext, useState, useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';

interface DrawingContextType {
  canUndo: boolean;
  canRedo: boolean;
  history: any[];
  currentHistoryIndex: number;
  addToHistory: () => void;
  undo: () => void;
  redo: () => void;
  resetHistory: () => void;
}

const DrawingContext = createContext<DrawingContextType>({
  canUndo: false,
  canRedo: false,
  history: [],
  currentHistoryIndex: -1,
  addToHistory: () => {},
  undo: () => {},
  redo: () => {},
  resetHistory: () => {}
});

interface DrawingProviderProps {
  canvas: FabricCanvas | null;
  children: React.ReactNode;
}

export const DrawingProvider: React.FC<DrawingProviderProps> = ({
  canvas,
  children
}) => {
  const [history, setHistory] = useState<any[]>([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);
  
  const canUndo = currentHistoryIndex > 0;
  const canRedo = history.length > 0 && currentHistoryIndex < history.length - 1;
  
  const saveCanvasState = useCallback(() => {
    if (!canvas) return;
    
    const json = canvas.toJSON(['id', 'name']);
    return json;
  }, [canvas]);
  
  const addToHistory = useCallback(() => {
    if (!canvas) return;
    
    const currentState = saveCanvasState();
    if (!currentState) return;
    
    setHistory(prev => {
      // If we've gone back in history and then made a change,
      // discard any future states
      const newHistory = prev.slice(0, currentHistoryIndex + 1);
      return [...newHistory, currentState];
    });
    
    setCurrentHistoryIndex(prev => prev + 1);
  }, [canvas, currentHistoryIndex, saveCanvasState]);
  
  const undo = useCallback(() => {
    if (!canvas || !canUndo) return;
    
    const previousState = history[currentHistoryIndex - 1];
    canvas.loadFromJSON(previousState, () => {
      canvas.renderAll();
      setCurrentHistoryIndex(prev => prev - 1);
    });
  }, [canvas, canUndo, history, currentHistoryIndex]);
  
  const redo = useCallback(() => {
    if (!canvas || !canRedo) return;
    
    const nextState = history[currentHistoryIndex + 1];
    canvas.loadFromJSON(nextState, () => {
      canvas.renderAll();
      setCurrentHistoryIndex(prev => prev + 1);
    });
  }, [canvas, canRedo, history, currentHistoryIndex]);
  
  const resetHistory = useCallback(() => {
    setHistory([]);
    setCurrentHistoryIndex(-1);
  }, []);
  
  const value = {
    canUndo,
    canRedo,
    history,
    currentHistoryIndex,
    addToHistory,
    undo,
    redo,
    resetHistory
  };
  
  return (
    <DrawingContext.Provider value={value}>
      {children}
    </DrawingContext.Provider>
  );
};

export const useDrawingContext = () => useContext(DrawingContext);
