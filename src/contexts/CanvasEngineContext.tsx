
import React, { createContext, useContext, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';

/**
 * Canvas engine interface
 */
export interface CanvasEngine {
  canvas: FabricCanvas;
  getCanvas: () => FabricCanvas;
  dispose: () => void;
}

export interface CanvasEngineContextType {
  engine: CanvasEngine | null;
  setEngine: React.Dispatch<React.SetStateAction<CanvasEngine | null>>;
}

const CanvasEngineContext = createContext<CanvasEngineContextType>({
  engine: null,
  setEngine: () => null,
});

export const CanvasEngineProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [engine, setEngine] = useState<CanvasEngine | null>(null);

  return (
    <CanvasEngineContext.Provider value={{ engine, setEngine }}>
      {children}
    </CanvasEngineContext.Provider>
  );
};

export const useCanvasEngine = (): CanvasEngineContextType => {
  const context = useContext(CanvasEngineContext);
  
  if (!context) {
    throw new Error('useCanvasEngine must be used within a CanvasEngineProvider');
  }
  
  return context;
};
