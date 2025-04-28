
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

const defaultContext: DrawingContextType = {
  activeTool: DrawingMode.SELECT,
  setActiveTool: () => {},
  lineColor: '#000000',
  setLineColor: () => {},
  lineThickness: 2,
  setLineThickness: () => {},
};

export const DrawingContext = createContext<DrawingContextType>(defaultContext);

export const useDrawingContext = (): DrawingContextType => useContext(DrawingContext);

export const DrawingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTool, setActiveTool] = useState<DrawingMode>(DrawingMode.SELECT);
  const [lineColor, setLineColor] = useState<string>('#000000');
  const [lineThickness, setLineThickness] = useState<number>(2);

  return (
    <DrawingContext.Provider 
      value={{ 
        activeTool, 
        setActiveTool, 
        lineColor, 
        setLineColor, 
        lineThickness, 
        setLineThickness 
      }}
    >
      {children}
    </DrawingContext.Provider>
  );
};
