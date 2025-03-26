
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
import { DebugInfoState, CanvasDimensions } from "@/types/drawingTypes";

/**
 * Props for useCanvasInitialization hook
 * @interface UseCanvasInitializationProps
 */
interface UseCanvasInitializationProps {
  /** Canvas dimensions for width and height */
  canvasDimensions: CanvasDimensions;
  /** Current active drawing tool */
  tool: DrawingTool;
  /** Current floor index */
  currentFloor: number;
  /** Function to set the current zoom level */
  setZoomLevel: (zoom: number) => void;
  /** Function to update debug information */
  setDebugInfo: React.Dispatch<React.SetStateAction<DebugInfoState>>;
  /** Function to set error state */
  setHasError: (value: boolean) => void;
  /** Function to set error message */
  setErrorMessage: (value: string) => void;
}

/**
 * Return type for useCanvasInitialization hook
 * @interface UseCanvasInitializationResult
 */
interface UseCanvasInitializationResult {
  /** Reference to the HTML canvas element */
  canvasRef: React.RefObject<HTMLCanvasElement>;
  /** Reference to the Fabric.js canvas instance */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Reference to grid layer objects */
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
  /** Reference to history state for undo/redo */
  historyRef: React.MutableRefObject<{
    past: FabricObject[][];
    future: FabricObject[][];
  }>;
}

// Global tracker for initial toast shown
let initialToastShown = false;
// Track whether initialization is in progress
let initializationInProgress = false;

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
  const initializationAttempts = useRef(0);
  const maxInitAttempts = 3;
  
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
  const setupInteractions = useCallback((canvas: FabricCanvas): (() => void) => {
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
  const performInitialization = useCallback((): boolean => {
    // Avoid multiple simultaneous initialization attempts
    if (initializationInProgress) {
      console.log("Initialization already in progress, skipping");
      return false;
    }
    
    initializationInProgress = true;
    initializationAttempts.current += 1;
    
    console.log("Attempting canvas initialization with dimensions:", canvasDimensions);
    
    if (!canvasRef.current) {
      console.warn("Canvas element still not available");
      initializationInProgress = false;
      return false;
    }
    
    // Initialize the canvas
    const fabricCanvas = initializeCanvas();
    if (!fabricCanvas) {
      console.warn("Failed to initialize Fabric canvas");
      initializationInProgress = false;
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
      
      // Mark initialization as no longer in progress
      initializationInProgress = false;
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
    
    // Reset attempts counter on dependency changes
    initializationAttempts.current = 0;
    
    // Wait for DOM to be fully rendered before attempting initialization
    console.log("Scheduling canvas initialization...");
    initTimeoutRef.current = window.setTimeout(() => {
      // Attempt initialization
      const success = performInitialization();
      
      // If initialization failed, retry after a short delay (with backoff)
      if (!success && initializationAttempts.current < maxInitAttempts) {
        const delay = Math.min(1000 * Math.pow(1.5, initializationAttempts.current), 5000);
        console.log(`Initial canvas initialization failed, retrying in ${delay}ms (attempt ${initializationAttempts.current}/${maxInitAttempts})...`);
        initTimeoutRef.current = window.setTimeout(() => {
          performInitialization();
        }, delay);
      }
    }, 500);
    
    // Clean up on unmount
    return () => {
      initializationInProgress = false;
      
      // Clear any pending initialization timeouts
      if (initTimeoutRef.current !== null) {
        window.clearTimeout(initTimeoutRef.current);
        initTimeoutRef.current = null;
      }
      
      // Store a local reference to the canvas before clearing it
      const currentCanvas = fabricCanvasRef.current;
      
      // Set all refs to null first to avoid further operations attempting to use them
      fabricCanvasRef.current = null;
      canvasInitializedRef.current = false;
      gridLayerRef.current = [];
      
      // Then dispose the canvas if it exists
      if (currentCanvas) {
        try {
          console.log("Beginning canvas cleanup process");
          
          // Use our cleanup utility function
          cleanupCanvas(currentCanvas);
        } catch (error) {
          console.error("Error initiating canvas cleanup:", error);
        }
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
