
import React, { createContext, useContext, useState, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';

/**
 * Type for the CanvasContext value
 */
interface CanvasContextType {
  canvas: FabricCanvas | null;
  setCanvas: (canvas: FabricCanvas | null) => void;
}

/**
 * Default canvas context value
 */
const defaultContextValue: CanvasContextType = {
  canvas: null,
  setCanvas: () => {}
};

/**
 * Canvas context for providing canvas instance throughout the app
 */
const CanvasContext = createContext<CanvasContextType>(defaultContextValue);

/**
 * Props for CanvasProvider component
 */
interface CanvasProviderProps {
  children: React.ReactNode;
}

/**
 * Provider component for the canvas context
 * @param props - The component props
 * @returns The provider component
 */
export const CanvasProvider: React.FC<CanvasProviderProps> = ({ children }) => {
  const [canvas, setCanvasState] = useState<FabricCanvas | null>(null);
  
  /**
   * Sets the canvas state
   * @param newCanvas - The new canvas instance
   */
  const setCanvas = (newCanvas: FabricCanvas | null) => {
    setCanvasState(newCanvas);
  };
  
  return (
    <CanvasContext.Provider value={{ canvas, setCanvas }}>
      {children}
    </CanvasContext.Provider>
  );
};

/**
 * Hook for using the canvas context
 * @returns The canvas context value
 */
export const useCanvasContext = (): CanvasContextType => {
  const context = useContext(CanvasContext);
  
  if (!context) {
    throw new Error('useCanvasContext must be used within a CanvasProvider');
  }
  
  return context;
};
