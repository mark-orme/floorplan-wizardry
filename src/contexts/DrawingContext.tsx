
import React, { createContext, useContext, useState } from 'react';
import { DrawingMode } from '@/constants/drawingModes';
import type { Canvas as FabricCanvas } from 'fabric';

interface DrawingContextType {
  tool: DrawingMode;
  setTool: React.Dispatch<React.SetStateAction<DrawingMode>>;
  lineColor: string;
  setLineColor: React.Dispatch<React.SetStateAction<string>>;
  lineThickness: number;
  setLineThickness: React.Dispatch<React.SetStateAction<number>>;
  showGrid: boolean;
  setShowGrid: React.Dispatch<React.SetStateAction<boolean>>;
  canUndo: boolean;
  canRedo: boolean;
  setCanUndo: (v: boolean) => void;
  setCanRedo: (v: boolean) => void;
  addToUndoStack: (cmd: any) => void;
  canvas?: FabricCanvas;  
  activeTool?: DrawingMode;
  setActiveTool?: (tool: DrawingMode) => void;
  handleToolChange?: (tool: DrawingMode) => void;
}

export const DrawingContext = createContext<DrawingContextType>({
  tool: DrawingMode.SELECT,
  setTool: () => {},
  lineColor: '#000000',
  setLineColor: () => {},
  lineThickness: 2,
  setLineThickness: () => {},
  showGrid: true,
  setShowGrid: () => {},
  canUndo: false,
  canRedo: false,
  setCanUndo: () => {},
  setCanRedo: () => {},
  addToUndoStack: () => {},
  activeTool: DrawingMode.SELECT,
  setActiveTool: () => {},
  handleToolChange: () => {},
});

export const useDrawingContext = (): DrawingContextType => {
  const context = useContext(DrawingContext);
  if (context === undefined) {
    throw new Error('useDrawingContext must be used within a DrawingContextProvider');
  }
  return context;
};

// Alias for backward compatibility
export const useDrawing = useDrawingContext;

// Export provider with default implementation
export const DrawingProvider: React.FC<{
  children: React.ReactNode;
  value?: Partial<DrawingContextType>;
}> = ({ children, value = {} }) => {
  // Default state
  const [tool, setTool] = useState<DrawingMode>(DrawingMode.SELECT);
  const [lineColor, setLineColor] = useState<string>('#000000');
  const [lineThickness, setLineThickness] = useState<number>(2);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [canUndo, setCanUndo] = useState<boolean>(false);
  const [canRedo, setCanRedo] = useState<boolean>(false);
  const [undoStack, setUndoStack] = useState<any[]>([]);
  const [redoStack, setRedoStack] = useState<any[]>([]);
  
  // Default implementation of addToUndoStack
  const addToUndoStack = (cmd: any) => {
    setUndoStack(prev => [...prev, cmd]);
    setCanUndo(true);
    setRedoStack([]);
    setCanRedo(false);
  };
  
  // Default tool change handler
  const handleToolChange = (newTool: DrawingMode) => {
    setTool(newTool);
  };
  
  // Combine defaults with provided value
  const contextValue: DrawingContextType = {
    tool,
    setTool,
    lineColor,
    setLineColor,
    lineThickness,
    setLineThickness,
    showGrid,
    setShowGrid,
    canUndo,
    canRedo,
    setCanUndo,
    setCanRedo,
    addToUndoStack,
    handleToolChange,
    ...value // Override defaults with provided values
  };

  return (
    <DrawingContext.Provider value={contextValue}>
      {children}
    </DrawingContext.Provider>
  );
};
