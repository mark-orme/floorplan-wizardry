
import React, { createContext, useContext } from 'react';
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
  setCanUndo: React.Dispatch<React.SetStateAction<boolean>>;
  setCanRedo: React.Dispatch<React.SetStateAction<boolean>>;
  canvas?: FabricCanvas;  
  activeTool?: DrawingMode;
  addToUndoStack: (state: any) => void;
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

// Export a type-safe provider for use in tests/apps
export const DrawingProvider: React.FC<{
  children: React.ReactNode;
  value: DrawingContextType;
}> = ({ children, value }) => {
  return (
    <DrawingContext.Provider value={value}>
      {children}
    </DrawingContext.Provider>
  );
};
