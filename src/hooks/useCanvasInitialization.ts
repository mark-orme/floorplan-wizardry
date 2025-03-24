
/**
 * Custom hook for initializing the canvas
 * Handles canvas creation, brush setup, and grid initialization
 * @module useCanvasInitialization
 */
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useCanvasCreation } from "./useCanvasCreation";
import { useCanvasBrush } from "./useCanvasBrush";
import { useCanvasInteraction } from "./useCanvasInteraction";
import { useCanvasCleanup } from "./useCanvasCleanup";
import { useCanvasGrid } from "./useCanvasGrid";
import { DrawingTool } from "./useCanvasState";

/**
 * Props for useCanvasInitialization hook
 * @interface UseCanvasInitializationProps
 */
interface UseCanvasInitializationProps {
  canvasDimensions: { width: number, height: number };
  tool: DrawingTool;
  currentFloor: number;
  setZoomLevel: (zoom: number) => void;
  setDebugInfo: React.Dispatch<React.SetStateAction<{
    canvasInitialized: boolean;
    gridCreated: boolean;
    dimensionsSet: boolean;
    brushInitialized: boolean;
  }>>;
  setHasError: (value: boolean) => void;
  setErrorMessage: (value: string) => void;
}

// Global tracker for initial toast shown
let initialToastShown = false;

/**
 * Hook for initializing the canvas and related objects
 * @param {UseCanvasInitializationProps} props - Hook properties
 * @returns {Object} Canvas and related refs
 */
export const useCanvasInitialization = ({
  canvasDimensions,
  tool,
  currentFloor,
  setZoomLevel,
  setDebugInfo,
  setHasError,
  setErrorMessage
}: UseCanvasInitializationProps) => {
  // Use the smaller, focused hooks
  const { 
    canvasRef, 
    fabricCanvasRef, 
    canvasInitializedRef,
    initializeCanvas 
  } = useCanvasCreation({
    canvasDimensions,
    setHasError,
    setErrorMessage
  });
  
  const { setupBrush } = useCanvasBrush({
    setDebugInfo
  });
  
  const { historyRef, setupInteractions } = useCanvasInteraction();
  
  const { cleanupCanvas } = useCanvasCleanup();
  
  // Grid layer reference
  const gridLayerRef = useRef<any[]>([]);
  
  // Use the grid creation hook
  const createGrid = useCanvasGrid({
    gridLayerRef,
    canvasDimensions,
    setDebugInfo,
    setHasError,
    setErrorMessage
  });

  // Initialize canvas when component mounts or when dependencies change
  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    
    // Initialize the canvas
    const fabricCanvas = initializeCanvas();
    if (!fabricCanvas) {
      return;
    }
    
    // Set debug info for canvas initialization
    setDebugInfo(prev => ({
      ...prev, 
      canvasInitialized: true
    }));
    
    // Initialize the brush
    setupBrush(fabricCanvas);
    
    // Create grid after canvas is rendered, using idle callback
    const createGridWhenIdle = () => {
      createGrid(fabricCanvas);
      
      // Now that the grid is created, enable rendering
      fabricCanvas.renderOnAddRemove = true;
      fabricCanvas.requestRenderAll();
    };
    
    // Use either requestIdleCallback or setTimeout as fallback
    if (typeof window.requestIdleCallback === 'function') {
      requestIdleCallback(createGridWhenIdle, { timeout: 500 });
    } else {
      setTimeout(createGridWhenIdle, 200);
    }
    
    // Setup interactions (pinch-to-zoom, etc.)
    const cleanupInteractions = setupInteractions(fabricCanvas);
    
    // Only show toast on first initialization across ALL renders
    if (!initialToastShown) {
      toast.success("Canvas ready for drawing!", {
        id: "canvas-ready",
        duration: 2000
      });
      initialToastShown = true;
    }
    
    // Clean up on unmount
    return () => {
      if (cleanupInteractions) {
        cleanupInteractions();
      }
      
      // Don't dispose the canvas when switching floors or tools, only on component unmount
      if (fabricCanvasRef.current === fabricCanvas) {
        cleanupCanvas(fabricCanvas);
        fabricCanvasRef.current = null;
        canvasInitializedRef.current = false;
        gridLayerRef.current = [];
      }
    };
  }, [
    canvasDimensions.width, 
    canvasDimensions.height, 
    setDebugInfo, 
    setZoomLevel, 
    setHasError, 
    setErrorMessage,
    initializeCanvas,
    setupBrush,
    setupInteractions,
    cleanupCanvas,
    createGrid
  ]);

  return {
    canvasRef,
    fabricCanvasRef,
    gridLayerRef,
    historyRef
  };
};
