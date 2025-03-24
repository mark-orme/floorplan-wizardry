
/**
 * Custom hook for initializing and managing canvas brushes
 * @module useCanvasBrush
 */
import { useCallback } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { 
  initializeDrawingBrush, 
  addPressureSensitivity
} from "@/utils/fabricBrush";

/**
 * Props for useCanvasBrush hook
 */
interface UseCanvasBrushProps {
  setDebugInfo: React.Dispatch<React.SetStateAction<{
    canvasInitialized: boolean;
    gridCreated: boolean;
    dimensionsSet: boolean;
    brushInitialized: boolean;
  }>>;
}

/**
 * Hook to handle brush initialization and configuration
 */
export const useCanvasBrush = ({
  setDebugInfo
}: UseCanvasBrushProps) => {
  
  /**
   * Initialize the drawing brush with precise settings
   */
  const setupBrush = useCallback((fabricCanvas: FabricCanvas) => {
    if (!fabricCanvas) return false;
    
    // Initialize the drawing brush with precise settings for drawing
    const pencilBrush = initializeDrawingBrush(fabricCanvas);
    if (pencilBrush) {
      fabricCanvas.freeDrawingBrush = pencilBrush;
      fabricCanvas.freeDrawingBrush.width = 2;
      fabricCanvas.freeDrawingBrush.color = "#000000";
      fabricCanvas.isDrawingMode = true;
      
      // OPTIMIZATION: Set brush properties for better performance
      if ('decimate' in pencilBrush) {
        (pencilBrush as any).decimate = 2; // Reduce number of points for smoother performance
      }
      
      setDebugInfo(prev => ({
        ...prev, 
        brushInitialized: true
      }));
      
      // Add pressure sensitivity for Apple Pencil
      addPressureSensitivity(fabricCanvas);
      
      return true;
    } else {
      console.error("Failed to initialize drawing brush");
      setDebugInfo(prev => ({
        ...prev, 
        brushInitialized: false
      }));
      return false;
    }
  }, [setDebugInfo]);

  return {
    setupBrush
  };
};
