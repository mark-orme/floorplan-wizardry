
/**
 * Custom hook for initializing and managing canvas brushes
 * @module useCanvasBrush
 */
import { useCallback } from "react";
import { Canvas as FabricCanvas, PencilBrush } from "fabric";
import { 
  initializeDrawingBrush, 
  addPressureSensitivity
} from "@/utils/fabricBrush";
import { DebugInfoState } from "@/types/drawingTypes";
import logger from "@/utils/logger";

/**
 * Props for useCanvasBrush hook
 * @interface UseCanvasBrushProps
 */
interface UseCanvasBrushProps {
  /** Function to update debug info state */
  setDebugInfo: React.Dispatch<React.SetStateAction<DebugInfoState>>;
}

/**
 * Result type for useCanvasBrush hook
 * @interface UseCanvasBrushResult
 */
interface UseCanvasBrushResult {
  /** Initialize brush on the canvas */
  setupBrush: (fabricCanvas: FabricCanvas) => boolean;
}

/**
 * Type definition for extended PencilBrush with additional properties
 */
interface ExtendedPencilBrush extends PencilBrush {
  decimate?: number;
}

/**
 * Hook to handle brush initialization and configuration
 * Manages drawing brush settings and pressure sensitivity
 * 
 * @param {UseCanvasBrushProps} props - Hook properties
 * @returns {UseCanvasBrushResult} Brush setup function
 */
export const useCanvasBrush = ({
  setDebugInfo
}: UseCanvasBrushProps): UseCanvasBrushResult => {
  
  /**
   * Initialize the drawing brush with precise settings
   * @param {FabricCanvas} fabricCanvas - The Fabric.js canvas instance
   * @returns {boolean} Success indicator
   */
  const setupBrush = useCallback((fabricCanvas: FabricCanvas): boolean => {
    if (!fabricCanvas) return false;
    
    // Initialize the drawing brush with precise settings for drawing
    const pencilBrush = initializeDrawingBrush(fabricCanvas) as PencilBrush;
    if (pencilBrush) {
      fabricCanvas.freeDrawingBrush = pencilBrush;
      fabricCanvas.freeDrawingBrush.width = 2;
      fabricCanvas.freeDrawingBrush.color = "#000000";
      fabricCanvas.isDrawingMode = true;
      
      // OPTIMIZATION: Set brush properties for better performance
      const extendedBrush = pencilBrush as ExtendedPencilBrush;
      if (extendedBrush) {
        extendedBrush.decimate = 2; // Reduce number of points for smoother performance
      }
      
      setDebugInfo(prev => ({
        ...prev, 
        brushInitialized: true
      }));
      
      // Add pressure sensitivity for Apple Pencil
      addPressureSensitivity(fabricCanvas);
      
      logger.debug("Drawing brush initialized successfully");
      return true;
    } else {
      logger.error("Failed to initialize drawing brush");
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
