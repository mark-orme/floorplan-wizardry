
import React, { createContext, useContext, useState } from "react";
import { Canvas as FabricCanvas } from "fabric";

/**
 * Canvas controller context type
 */
interface CanvasControllerContextType {
  canvas: FabricCanvas | null;
  setCanvas: React.Dispatch<React.SetStateAction<FabricCanvas | null>>;
  clearCanvas: () => void;
}

// Create context with default values
const CanvasControllerContext = createContext<CanvasControllerContextType | null>(null);

/**
 * Props for the CanvasControllerProvider
 */
interface CanvasControllerProviderProps {
  children: React.ReactNode;
}

/**
 * Provider component for canvas controller context
 */
export const CanvasControllerProvider: React.FC<CanvasControllerProviderProps> = ({ children }) => {
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);

  /**
   * Clear all objects from canvas
   */
  const clearCanvas = () => {
    if (!canvas) return;
    
    // Get all objects that are not grid
    const nonGridObjects = canvas.getObjects().filter(obj => (obj as any).objectType !== 'grid');
    
    // Remove non-grid objects
    nonGridObjects.forEach(obj => {
      canvas.remove(obj);
    });
    
    // Force render
    canvas.requestRenderAll();
  };

  return (
    <CanvasControllerContext.Provider value={{ canvas, setCanvas, clearCanvas }}>
      {children}
    </CanvasControllerContext.Provider>
  );
};

/**
 * Hook to access canvas controller context
 * @returns {CanvasControllerContextType} Canvas controller context
 */
export const useCanvasController = (): CanvasControllerContextType => {
  const context = useContext(CanvasControllerContext);
  
  if (!context) {
    throw new Error("useCanvasController must be used within a CanvasControllerProvider");
  }
  
  return context;
};
