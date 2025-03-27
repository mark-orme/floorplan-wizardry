
/**
 * Canvas context provider for sharing canvas instance across components
 * @module contexts/CanvasContext
 */
import React, { createContext, useContext, useState, useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';

/**
 * Canvas context value interface
 */
interface CanvasContextValue {
  /** Current Fabric.js canvas instance */
  canvas: FabricCanvas | null;
  /** Function to set the canvas reference */
  setCanvas: (canvas: FabricCanvas | null) => void;
  /** Clear all objects from the canvas */
  clearCanvas: () => void;
  /** Refresh the canvas rendering */
  refreshCanvas: () => void;
}

// Create context with default values
const CanvasContext = createContext<CanvasContextValue>({
  canvas: null,
  setCanvas: () => {},
  clearCanvas: () => {},
  refreshCanvas: () => {}
});

/**
 * Hook to use the canvas context
 * @returns {CanvasContextValue} Canvas context value
 */
export const useCanvasContext = (): CanvasContextValue => useContext(CanvasContext);

/**
 * Canvas context provider props
 */
interface CanvasProviderProps {
  /** Child components */
  children: React.ReactNode;
}

/**
 * Canvas context provider component
 * @param {CanvasProviderProps} props - Provider props
 * @returns {JSX.Element} Provider component
 */
export const CanvasProvider: React.FC<CanvasProviderProps> = ({ children }) => {
  const [canvas, setCanvasState] = useState<FabricCanvas | null>(null);
  
  // Set canvas reference
  const setCanvas = useCallback((newCanvas: FabricCanvas | null) => {
    setCanvasState(newCanvas);
  }, []);
  
  // Clear all objects from canvas
  const clearCanvas = useCallback(() => {
    if (canvas) {
      // Preserve background color
      const backgroundColor = canvas.backgroundColor;
      
      // Clear the canvas
      canvas.clear();
      
      // Restore background color
      canvas.backgroundColor = backgroundColor;
      
      // Render the canvas
      canvas.renderAll();
    }
  }, [canvas]);
  
  // Refresh canvas rendering
  const refreshCanvas = useCallback(() => {
    if (canvas) {
      canvas.requestRenderAll();
    }
  }, [canvas]);
  
  // Create context value
  const value: CanvasContextValue = {
    canvas,
    setCanvas,
    clearCanvas,
    refreshCanvas
  };
  
  return (
    <CanvasContext.Provider value={value}>
      {children}
    </CanvasContext.Provider>
  );
};
