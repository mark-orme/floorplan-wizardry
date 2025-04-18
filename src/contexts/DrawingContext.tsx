
import React, { createContext, useContext, useState } from 'react';
import { DrawingMode } from '@/constants/drawingModes';

interface DrawingContextType {
  activeTool: DrawingMode;
  setActiveTool: (tool: DrawingMode) => void;
  tool: DrawingMode;  // Add this property
  setTool: (tool: DrawingMode) => void;  // Add this property
  lineColor: string;
  setLineColor: (color: string) => void;
  lineThickness: number;
  setLineThickness: (thickness: number) => void;
  snapToGrid: boolean;
  setSnapToGrid: (snap: boolean) => void;
  canUndo: boolean;
  setCanUndo: (canUndo: boolean) => void;
  canRedo: boolean;
  setCanRedo: (canRedo: boolean) => void;
}

const DrawingContext = createContext<DrawingContextType | undefined>(undefined);

export const DrawingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTool, setActiveTool] = useState<DrawingMode>(DrawingMode.SELECT);
  const [lineColor, setLineColor] = useState('#000000');
  const [lineThickness, setLineThickness] = useState(2);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  // Set tool as alias for activeTool to maintain compatibility with both naming conventions
  const tool = activeTool;
  const setTool = setActiveTool;

  return (
    <DrawingContext.Provider value={{
      activeTool,
      setActiveTool,
      tool,
      setTool,
      lineColor,
      setLineColor,
      lineThickness,
      setLineThickness,
      snapToGrid,
      setSnapToGrid,
      canUndo,
      setCanUndo,
      canRedo,
      setCanRedo
    }}>
      {children}
    </DrawingContext.Provider>
  );
};

export const useDrawing = () => {
  const context = useContext(DrawingContext);
  if (context === undefined) {
    throw new Error('useDrawing must be used within a DrawingProvider');
  }
  return context;
};

// Add this line to fix the useDrawingContext import errors
export const useDrawingContext = useDrawing;
