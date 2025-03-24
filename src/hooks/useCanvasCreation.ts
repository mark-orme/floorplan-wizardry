
/**
 * Custom hook for initializing Fabric.js canvas
 * @module useCanvasCreation
 */
import { useCallback, useEffect, useRef } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { toast } from "sonner";

/**
 * Props for useCanvasCreation hook
 */
interface UseCanvasCreationProps {
  canvasDimensions: { width: number, height: number };
  setHasError: (value: boolean) => void;
  setErrorMessage: (value: string) => void;
}

/**
 * Hook to handle basic canvas creation and setup
 */
export const useCanvasCreation = ({
  canvasDimensions,
  setHasError,
  setErrorMessage
}: UseCanvasCreationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const canvasInitializedRef = useRef(false);
  const initializationInProgressRef = useRef(false);

  /**
   * Initialize canvas with performance optimizations
   */
  const initializeCanvas = useCallback(() => {
    if (!canvasRef.current) {
      return null;
    }
    
    if (canvasInitializedRef.current && fabricCanvasRef.current) {
      return fabricCanvasRef.current;
    }
    
    // Prevent concurrent initializations
    if (initializationInProgressRef.current) {
      return null;
    }
    
    initializationInProgressRef.current = true;
    
    try {
      // PERFORMANCE OPTIMIZATIONS for Fabric.js initialization
      const fabricCanvas = new FabricCanvas(canvasRef.current, {
        backgroundColor: "#FFFFFF",
        isDrawingMode: true,
        selection: false,
        width: canvasDimensions.width,
        height: canvasDimensions.height,
        renderOnAddRemove: false,
        stateful: false,
        fireRightClick: false,
        stopContextMenu: true,
        enableRetinaScaling: false,
        perPixelTargetFind: false,
        skipOffscreen: true, // OPTIMIZATION: Skip rendering objects outside canvas viewport
        objectCaching: true, // OPTIMIZATION: Enable object caching for all objects
        imageSmoothingEnabled: false, // OPTIMIZATION: Disable image smoothing for better performance
        preserveObjectStacking: false, // OPTIMIZATION: Disable object stacking preservation for performance
        svgViewportTransformation: false // OPTIMIZATION: Disable SVG viewport transforms
      });
      
      console.log("FabricCanvas instance created");
      fabricCanvasRef.current = fabricCanvas;
      canvasInitializedRef.current = true;
      
      // OPTIMIZATION: Precompile frequent canvas operations
      fabricCanvas.calcViewportBoundaries();
      
      initializationInProgressRef.current = false;
      
      return fabricCanvas;
    } catch (err) {
      console.error("Error initializing canvas:", err);
      setHasError(true);
      setErrorMessage(`Failed to initialize canvas: ${err instanceof Error ? err.message : String(err)}`);
      toast.error("Failed to initialize canvas");
      initializationInProgressRef.current = false;
      return null;
    }
  }, [canvasDimensions, setHasError, setErrorMessage]);

  return {
    canvasRef,
    fabricCanvasRef,
    canvasInitializedRef,
    initializeCanvas
  };
};
