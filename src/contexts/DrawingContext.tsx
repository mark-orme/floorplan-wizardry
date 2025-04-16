
import React, { createContext, useContext, useState } from 'react';
import { DrawingMode } from '@/constants/drawingModes';

interface DrawingContextType {
  activeTool: DrawingMode;
  setActiveTool: (tool: DrawingMode) => void;
  lineColor: string;
  setLineColor: (color: string) => void;
  lineThickness: number;
  setLineThickness: (thickness: number) => void;
}

const DrawingContext = createContext<DrawingContextType | undefined>(undefined);

export const DrawingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTool, setActiveTool] = useState<DrawingMode>(DrawingMode.SELECT);
  const [lineColor, setLineColor] = useState('#000000');
  const [lineThickness, setLineThickness] = useState(2);

  return (
    <DrawingContext.Provider value={{
      activeTool,
      setActiveTool,
      lineColor,
      setLineColor,
      lineThickness,
      setLineThickness
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
