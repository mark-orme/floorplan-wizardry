
import React, { createContext, useContext, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';

interface CanvasContextType {
  canvas: FabricCanvas | null;
  setCanvas: (canvas: FabricCanvas | null) => void;
}

const CanvasContext = createContext<CanvasContextType | undefined>(undefined);

export const CanvasProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [canvas, setCanvasState] = useState<FabricCanvas | null>(null);

  const setCanvas = (newCanvas: FabricCanvas | null) => {
    setCanvasState(newCanvas);
  };

  return (
    <CanvasContext.Provider value={{ canvas, setCanvas }}>
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvasContext = (): CanvasContextType => {
  const context = useContext(CanvasContext);
  if (context === undefined) {
    throw new Error('useCanvasContext must be used within a CanvasProvider');
  }
  return context;
};

export const useCanvas = (): FabricCanvas | null => {
  const { canvas } = useCanvasContext();
  return canvas;
};
