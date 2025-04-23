
import React, { createContext, useContext } from 'react';
import { DrawingMode } from '@/constants/drawingModes';

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
  canRedo: false
});

export const useDrawingContext = (): DrawingContextType => {
  const context = useContext(DrawingContext);
  if (context === undefined) {
    throw new Error('useDrawingContext must be used within a DrawingContextProvider');
  }
  return context;
};
