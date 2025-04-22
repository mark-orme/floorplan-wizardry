
import React, { createContext, useContext, useState, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';

interface CanvasContextType {
  canvas: FabricCanvas | null;
  setCanvas: React.Dispatch<React.SetStateAction<FabricCanvas | null>>;
  canvasRef: React.RefObject<HTMLCanvasElement>; // Added canvasRef
}

const CanvasContext = createContext<CanvasContextType | null>(null);

export const CanvasProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <CanvasContext.Provider value={{ canvas, setCanvas, canvasRef }}>
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvasContext = (): CanvasContextType => {
  const context = useContext(CanvasContext);
  
  if (!context) {
    throw new Error('useCanvasContext must be used within a CanvasProvider');
  }
  
  return context;
};

// Add alias for compatibility
export const useCanvas = useCanvasContext;
