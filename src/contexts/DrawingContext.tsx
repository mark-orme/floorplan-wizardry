
import React, { createContext, useContext, useState, useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';

interface DrawingContextType {
  canUndo: boolean;
  canRedo: boolean;
  history: any[];
  currentHistoryIndex: number;
  activeTool: DrawingMode;
  lineColor: string;
  lineThickness: number;
  addToHistory: () => void;
  undo: () => void;
  redo: () => void;
  resetHistory: () => void;
  setCanUndo: React.Dispatch<React.SetStateAction<boolean>>;
  setCanRedo: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveTool: React.Dispatch<React.SetStateAction<DrawingMode>>;
  setLineColor: React.Dispatch<React.SetStateAction<string>>;
  setLineThickness: React.Dispatch<React.SetStateAction<number>>;
}

const DrawingContext = createContext<DrawingContextType>({
  canUndo: false,
  canRedo: false,
  history: [],
  currentHistoryIndex: -1,
  activeTool: DrawingMode.SELECT,
  lineColor: '#000000',
  lineThickness: 2,
  addToHistory: () => {},
  undo: () => {},
  redo: () => {},
  resetHistory: () => {},
  setCanUndo: () => {},
  setCanRedo: () => {},
  setActiveTool: () => {},
  setLineColor: () => {},
  setLineThickness: () => {}
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
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [activeTool, setActiveTool] = useState<DrawingMode>(DrawingMode.SELECT);
  const [lineColor, setLineColor] = useState<string>('#000000');
  const [lineThickness, setLineThickness] = useState<number>(2);
  
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
    setCanUndo(true);
    setCanRedo(false);
  }, [canvas, currentHistoryIndex, saveCanvasState]);
  
  const undo = useCallback(() => {
    if (!canvas || !canUndo) return;
    
    const previousState = history[currentHistoryIndex - 1];
    canvas.loadFromJSON(previousState, () => {
      canvas.renderAll();
      setCurrentHistoryIndex(prev => prev - 1);
      setCanUndo(currentHistoryIndex - 1 > 0);
      setCanRedo(true);
    });
  }, [canvas, canUndo, history, currentHistoryIndex]);
  
  const redo = useCallback(() => {
    if (!canvas || !canRedo) return;
    
    const nextState = history[currentHistoryIndex + 1];
    canvas.loadFromJSON(nextState, () => {
      canvas.renderAll();
      setCurrentHistoryIndex(prev => prev + 1);
      setCanUndo(true);
      setCanRedo(currentHistoryIndex + 1 < history.length - 1);
    });
  }, [canvas, canRedo, history, currentHistoryIndex]);
  
  const resetHistory = useCallback(() => {
    setHistory([]);
    setCurrentHistoryIndex(-1);
    setCanUndo(false);
    setCanRedo(false);
  }, []);
  
  const value = {
    canUndo,
    canRedo,
    history,
    currentHistoryIndex,
    activeTool,
    lineColor,
    lineThickness,
    addToHistory,
    undo,
    redo,
    resetHistory,
    setCanUndo,
    setCanRedo,
    setActiveTool,
    setLineColor,
    setLineThickness
  };
  
  return (
    <DrawingContext.Provider value={value}>
      {children}
    </DrawingContext.Provider>
  );
};

export const useDrawingContext = () => useContext(DrawingContext);

// Add the useDrawing alias for backward compatibility
export const useDrawing = useDrawingContext;
