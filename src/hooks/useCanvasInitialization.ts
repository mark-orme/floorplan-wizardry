
/**
 * Custom hook for initializing the canvas
 * Handles canvas creation, brush setup, and grid initialization
 * @module useCanvasInitialization
 */
import { useEffect, useRef, useState, useCallback } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { toast } from "sonner";
import { useCanvasCreation } from "./useCanvasCreation";
import { useCanvasBrush } from "./useCanvasBrush";
import { useCanvasCleanup } from "./useCanvasCleanup";
import { useCanvasGrid } from "./useCanvasGrid";
import { DrawingTool } from "./useCanvasState";
import { DebugInfoState } from "@/types/drawingTypes";

/**
 * Props for useCanvasInitialization hook
 * @interface UseCanvasInitializationProps
 */
interface UseCanvasInitializationProps {
  canvasDimensions: { width: number, height: number };
  tool: DrawingTool;
  currentFloor: number;
  setZoomLevel: (zoom: number) => void;
  setDebugInfo: React.Dispatch<React.SetStateAction<DebugInfoState>>;
  setHasError: (value: boolean) => void;
  setErrorMessage: (value: string) => void;
}

/**
 * Return type for useCanvasInitialization hook
 * @interface UseCanvasInitializationResult
 */
interface UseCanvasInitializationResult {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
  historyRef: React.MutableRefObject<{
    past: FabricObject[][];
    future: FabricObject[][];
  }>;
}

// Global tracker for initial toast shown
let initialToastShown = false;

/**
 * Hook for initializing the canvas and related objects
 * @param {UseCanvasInitializationProps} props - Hook properties
 * @returns {UseCanvasInitializationResult} Canvas and related refs
 */
export const useCanvasInitialization = ({
  canvasDimensions,
  tool,
  currentFloor,
  setZoomLevel,
  setDebugInfo,
  setHasError,
  setErrorMessage
}: UseCanvasInitializationProps): UseCanvasInitializationResult => {
  // Track initialization state
  const [isInitialized, setIsInitialized] = useState(false);
  const initTimeoutRef = useRef<number | null>(null);
  
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
  
  // Create a history reference manually here
  const historyRef = useRef<{past: FabricObject[][], future: FabricObject[][]}>({
    past: [],
    future: []
  });
  
  /**
   * Define a simple setupInteractions function
   * @param {FabricCanvas} canvas - The Fabric canvas instance
   * @returns {Function} Cleanup function
   */
  const setupInteractions = useCallback((canvas: FabricCanvas) => {
    // Basic interactions setup
    return () => {
      // Cleanup function
    };
  }, []);
  
  const { cleanupCanvas } = useCanvasCleanup();
  
  // Grid layer reference
  const gridLayerRef = useRef<FabricObject[]>([]);
  
  // Use the grid creation hook
  const createGrid = useCanvasGrid({
    gridLayerRef,
    canvasDimensions,
    setDebugInfo,
    setHasError,
    setErrorMessage
  });

  /**
   * Helper function to perform initialization that can be retried
   * @returns {boolean} Whether initialization was successful
   */
  const performInitialization = useCallback(() => {
    console.log("Attempting canvas initialization with dimensions:", canvasDimensions);
    
    if (!canvasRef.current) {
      console.warn("Canvas element still not available");
      return false;
    }
    
    // Initialize the canvas
    const fabricCanvas = initializeCanvas();
    if (!fabricCanvas) {
      console.warn("Failed to initialize Fabric canvas");
      return false;
    }
    
    // Set debug info for canvas initialization
    setDebugInfo(prev => ({
      ...prev, 
      canvasInitialized: true,
      dimensionsSet: true
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
    
    setIsInitialized(true);
    return true;
  }, [
    canvasRef, 
    canvasDimensions, 
    initializeCanvas, 
    setupBrush, 
    createGrid, 
    setupInteractions, 
    setDebugInfo
  ]);

  // Initialize canvas when component mounts or when dependencies change
  useEffect(() => {
    // Clear any previous timeout
    if (initTimeoutRef.current !== null) {
      window.clearTimeout(initTimeoutRef.current);
      initTimeoutRef.current = null;
    }
    
    if (isInitialized && fabricCanvasRef.current) {
      console.log("Canvas already initialized, skipping initialization");
      return;
    }
    
    // Wait for DOM to be fully rendered before attempting initialization
    console.log("Scheduling canvas initialization...");
    initTimeoutRef.current = window.setTimeout(() => {
      // Attempt initialization
      const success = performInitialization();
      
      // If initialization failed, retry after a short delay
      if (!success) {
        console.log("Initial canvas initialization failed, retrying in 1 second...");
        initTimeoutRef.current = window.setTimeout(() => {
          performInitialization();
        }, 1000);
      }
    }, 500);
    
    // Clean up on unmount
    return () => {
      if (initTimeoutRef.current !== null) {
        window.clearTimeout(initTimeoutRef.current);
        initTimeoutRef.current = null;
      }
      
      if (fabricCanvasRef.current) {
        cleanupCanvas(fabricCanvasRef.current);
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
    createGrid,
    performInitialization,
    isInitialized,
    fabricCanvasRef,
    canvasInitializedRef
  ]);

  return {
    canvasRef,
    fabricCanvasRef,
    gridLayerRef,
    historyRef
  };
};
