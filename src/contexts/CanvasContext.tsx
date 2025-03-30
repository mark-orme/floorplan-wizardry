
import React, { createContext, useContext, useState } from "react";
import { Canvas as FabricCanvas } from "fabric";

/**
 * Canvas context type
 */
interface CanvasContextType {
  canvas: FabricCanvas | null;
  setCanvas: React.Dispatch<React.SetStateAction<FabricCanvas | null>>;
}

// Create context with default values
const CanvasContext = createContext<CanvasContextType | null>(null);

/**
 * Props for the CanvasProvider
 */
interface CanvasProviderProps {
  children: React.ReactNode;
}

/**
 * Provider component for canvas context
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
 * Hook to access canvas context
 * @returns {CanvasContextType} Canvas context
 */
export const useCanvasContext = (): CanvasContextType => {
  const context = useContext(CanvasContext);
  
  if (!context) {
    throw new Error("useCanvasContext must be used within a CanvasProvider");
  }
  
  return context;
};
