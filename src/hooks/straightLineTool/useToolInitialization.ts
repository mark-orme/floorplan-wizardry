
/**
 * Hook for managing tool initialization
 * @module hooks/straightLineTool/useToolInitialization
 */
import { useState, useCallback } from "react";
import { Canvas } from "fabric";

interface UseToolInitializationProps {
  fabricCanvasRef: React.MutableRefObject<Canvas | null>;
}

/**
 * Hook for managing tool initialization
 */
export const useToolInitialization = (props: UseToolInitializationProps) => {
  const { fabricCanvasRef } = props;
  
  const [isToolInitialized, setIsToolInitialized] = useState(false);
  
  /**
   * Initialize the tool
   */
  const initializeTool = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Configure canvas
    canvas.selection = false;
    canvas.defaultCursor = 'crosshair';
    canvas.hoverCursor = 'crosshair';
    canvas.isDrawingMode = false;
    
    // Mark as initialized
    setIsToolInitialized(true);
  }, [fabricCanvasRef]);
  
  return {
    isToolInitialized,
    initializeTool
  };
};
