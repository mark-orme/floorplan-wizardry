
import React, { createContext, useContext, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';

/**
 * Interface for the Canvas Context values
 */
interface CanvasContextValue {
  /** The current Fabric.js canvas instance */
  canvas: FabricCanvas | null;
  /** Function to set the current canvas instance */
  setCanvas: (canvas: FabricCanvas | null) => void;
}

/**
 * Default context value with null canvas
 */
const defaultContextValue: CanvasContextValue = {
  canvas: null,
  setCanvas: () => {}
};

/**
 * Create the Canvas Context
 */
const CanvasContext = createContext<CanvasContextValue>(defaultContextValue);

/**
 * Props for the CanvasProvider component
 */
interface CanvasProviderProps {
  children: React.ReactNode;
}

/**
 * Provider component for the Canvas Context
 * Manages the canvas instance state
 */
export const CanvasProvider: React.FC<CanvasProviderProps> = ({ children }) => {
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);

  return (
    <CanvasContext.Provider value={{ canvas, setCanvas }}>
      {children}
    </CanvasContext.Provider>
  );
};

/**
 * Hook to access the Canvas Context
 * @returns The canvas context values
 */
export const useCanvasContext = (): CanvasContextValue => {
  const context = useContext(CanvasContext);
  
  if (!context) {
    throw new Error('useCanvasContext must be used within a CanvasProvider');
  }
  
  return context;
};
