
import React, { createContext, useContext, useState } from 'react';
import { Canvas } from 'fabric';

// Define a minimal Canvas Engine interface
export interface CanvasEngine {
  canvas: Canvas | null;
  getCanvas: () => Canvas | null;
  dispose: () => void;
}

// Create context with default values
interface CanvasEngineContextType {
  engine: CanvasEngine | null;
  setEngine: React.Dispatch<React.SetStateAction<CanvasEngine | null>>;
}

const defaultContext: CanvasEngineContextType = {
  engine: {
    canvas: null,
    getCanvas: () => null,
    dispose: () => {}
  },
  setEngine: () => {}
};

// Create context
const CanvasEngineContext = createContext<CanvasEngineContextType>(defaultContext);

// Create provider
export const CanvasEngineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [engine, setEngine] = useState<CanvasEngine | null>(defaultContext.engine);

  return (
    <CanvasEngineContext.Provider value={{ engine, setEngine }}>
      {children}
    </CanvasEngineContext.Provider>
  );
};

// Create hook
export const useCanvasEngine = () => {
  const context = useContext(CanvasEngineContext);
  
  if (!context) {
    console.warn("useCanvasEngine must be used within a CanvasEngineProvider");
    return defaultContext;
  }
  
  return context;
};
