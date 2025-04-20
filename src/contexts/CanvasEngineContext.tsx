
import React, { createContext, useContext, useState } from 'react';
import { ICanvasEngine } from '@/interfaces/canvas-engine/ICanvasEngine';
import { FabricCanvasEngine } from '@/implementations/canvas-engine/FabricCanvasEngine';

interface CanvasEngineContextType {
  engine: ICanvasEngine | null;
  setEngine: (engine: ICanvasEngine) => void;
}

const CanvasEngineContext = createContext<CanvasEngineContextType | undefined>(undefined);

export const CanvasEngineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [engine, setEngine] = useState<ICanvasEngine | null>(null);

  return (
    <CanvasEngineContext.Provider value={{ engine, setEngine }}>
      {children}
    </CanvasEngineContext.Provider>
  );
};

export const useCanvasEngine = () => {
  const context = useContext(CanvasEngineContext);
  if (!context) {
    throw new Error('useCanvasEngine must be used within a CanvasEngineProvider');
  }
  return context;
};
