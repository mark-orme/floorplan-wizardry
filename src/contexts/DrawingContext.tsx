
import React, { createContext, useContext, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';

interface DrawingContextType {
  tool: DrawingMode;
  setTool: React.Dispatch<React.SetStateAction<DrawingMode>>;
  lineColor: string;
  setLineColor: React.Dispatch<React.SetStateAction<string>>;
  lineThickness: number;
  setLineThickness: React.Dispatch<React.SetStateAction<number>>;
  canvas: FabricCanvas | null;
  undoStack: any[];
  redoStack: any[];
  addToUndoStack: (state: any) => void;
  undo: () => void;
  redo: () => void;
}

const DrawingContext = createContext<DrawingContextType | null>(null);

export const DrawingProvider: React.FC<{
  children: React.ReactNode;
  canvas: FabricCanvas | null;
}> = ({ children, canvas }) => {
  const [tool, setTool] = useState<DrawingMode>(DrawingMode.SELECT);
  const [lineColor, setLineColor] = useState('#000000');
  const [lineThickness, setLineThickness] = useState(2);
  const [undoStack, setUndoStack] = useState<any[]>([]);
  const [redoStack, setRedoStack] = useState<any[]>([]);

  const addToUndoStack = (state: any) => {
    setUndoStack(prev => [...prev, state]);
    setRedoStack([]);
  };

  const undo = () => {
    if (undoStack.length === 0 || !canvas) return;
    
    const currentState = canvas.toJSON();
    const prevState = undoStack[undoStack.length - 1];
    
    setRedoStack(prev => [...prev, currentState]);
    setUndoStack(prev => prev.slice(0, prev.length - 1));
    
    canvas.loadFromJSON(prevState, canvas.renderAll.bind(canvas));
  };

  const redo = () => {
    if (redoStack.length === 0 || !canvas) return;
    
    const currentState = canvas.toJSON();
    const nextState = redoStack[redoStack.length - 1];
    
    setUndoStack(prev => [...prev, currentState]);
    setRedoStack(prev => prev.slice(0, prev.length - 1));
    
    canvas.loadFromJSON(nextState, canvas.renderAll.bind(canvas));
  };

  return (
    <DrawingContext.Provider
      value={{
        tool,
        setTool,
        lineColor,
        setLineColor,
        lineThickness,
        setLineThickness,
        canvas,
        undoStack,
        redoStack,
        addToUndoStack,
        undo,
        redo
      }}
    >
      {children}
    </DrawingContext.Provider>
  );
};

export const useDrawingContext = () => {
  const context = useContext(DrawingContext);
  
  if (!context) {
    throw new Error('useDrawingContext must be used within a DrawingProvider');
  }
  
  return context;
};
