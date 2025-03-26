
/**
 * Custom hook for initializing the canvas
 * Main entry point that coordinates all canvas initialization hooks
 * @module useCanvasInitialization
 */
import { useEffect, useRef, useCallback } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { toast } from "sonner";
import { useCanvasCreation } from "../useCanvasCreation";
import { useCanvasBrush } from "../useCanvasBrush";
import { useCanvasCleanup } from "../useCanvasCleanup";
import { DrawingTool } from "../useCanvasState";
import { DebugInfoState, CanvasDimensions } from "@/types/drawingTypes";
import logger from "@/utils/logger";
import { createBasicEmergencyGrid } from "@/utils/gridCreationUtils";
import { useCanvasGridInitialization } from "./useCanvasGridInitialization";
import { useCanvasRetryLogic } from "./useCanvasRetryLogic";
import { useCanvasStateTracking } from "./useCanvasStateTracking";
import { resetInitializationState } from "@/utils/canvas/safeCanvasInitialization";

// Type definition for the props to ensure they're all required
interface UseCanvasInitializationProps {
  canvasDimensions: CanvasDimensions;
  tool?: DrawingTool;
  currentFloor?: number;
  setZoomLevel?: React.Dispatch<React.SetStateAction<number>>;
  setDebugInfo: React.Dispatch<React.SetStateAction<DebugInfoState>>;
  setHasError: (value: boolean) => void;
  setErrorMessage: (value: string) => void;
  createGrid?: (canvas: FabricCanvas) => FabricObject[];
}

// Global tracker for initial toast shown
let initialToastShown = false;

/**
 * Main hook for initializing the canvas and related objects
 * Coordinates all sub-hooks for different aspects of initialization
 * @param props - Hook properties
 * @returns Initialized canvas objects and related functions
 */
export const useCanvasInitialization = ({
  canvasDimensions,
  tool = 'select',
  currentFloor = 0,
  setZoomLevel = () => {},
  setDebugInfo,
  setHasError,
  setErrorMessage,
  createGrid = () => []
}: UseCanvasInitializationProps) => {
  // Check if we have valid dimensions to prevent the width/height error
  if (!canvasDimensions || typeof canvasDimensions.width !== 'number' || typeof canvasDimensions.height !== 'number') {
    // Log the issue and use default dimensions
    console.warn("Invalid or missing canvas dimensions provided to useCanvasInitialization. Using defaults.");
    canvasDimensions = { width: 800, height: 600 };
  }

  // Use the state tracking hooks
  const {
    isInitialized,
    componentMountedRef,
    startInitialization,
    completeInitialization,
    failInitialization,
    setDisposalState,
    getInitializationState,
    setInitTimeout,
    clearInitTimeouts,
    setupMountedTracking,
    hasExceededMaxAttempts
  } = useCanvasStateTracking();
  
  // Use the retry logic hook
  const {
    trackInitializationAttempt,
    resetInitializationTracking,
    isCycleDetected
  } = useCanvasRetryLogic();
  
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
  
  // Use the grid initialization hook
  const { gridLayerRef, initializeGrid } = useCanvasGridInitialization({
    setDebugInfo,
    setHasError,
    setErrorMessage
  });
  
  // Define a simple setupInteractions function
  const setupInteractions = useCallback((canvas: FabricCanvas): (() => void) => {
    // Basic interactions setup
    return () => {
      // Cleanup function
    };
  }, []);
  
  const { cleanupCanvas } = useCanvasCleanup();

  // Set component mounted flag
  useEffect(() => {
    const cleanup = setupMountedTracking();
    
    // Reset initialization state when the component mounts
    resetInitializationState();
    
    // Log initial state
    console.log("💡 Canvas initialization started with dimensions:", canvasDimensions);
    
    return cleanup;
  }, [setupMountedTracking, canvasDimensions]);

  /**
   * Helper function to perform initialization that can be retried
   * @returns Whether initialization was successful
   */
  const performInitialization = useCallback((): boolean => {
    // Check for detected cycles first
    if (isCycleDetected()) {
      logger.warn("Initialization cycle previously detected, skipping attempt");
      return false;
    }
    
    // Track attempt and check if we should continue
    const attemptStatus = trackInitializationAttempt();
    if (!attemptStatus.shouldContinue) {
      // Handle max attempts reached
      if (attemptStatus.isMaxAttemptsReached) {
        logger.error("Max initialization attempts reached");
        
        // Only update error state if component is still mounted
        if (componentMountedRef.current) {
          setHasError(true);
          setErrorMessage(`Canvas initialization failed after multiple attempts. Using emergency mode.`);
        }
      }
      
      // Handle cycle detection
      if (attemptStatus.isCycleDetected) {
        // Try to create an emergency grid instead
        if (fabricCanvasRef.current) {
          try {
            logger.info("Creating basic emergency grid due to initialization cycle");
            createBasicEmergencyGrid(fabricCanvasRef.current, gridLayerRef);
            
            if (componentMountedRef.current) {
              completeInitialization();
            }
            return true;
          } catch (error) {
            logger.error("Failed to create emergency grid:", error);
          }
        }
      }
      
      return false;
    }
    
    // Get current initialization state
    const initState = getInitializationState();
    
    // Avoid multiple simultaneous initialization attempts
    if (initState.initializationInProgress) {
      logger.info("Initialization already in progress, skipping");
      return false;
    }

    // Don't attempt to initialize if disposal is in progress
    if (initState.canvasDisposalInProgress) {
      logger.info("Canvas disposal in progress, skipping initialization");
      return false;
    }
    
    // Don't reinitialize if canvas already exists and initialized flag is set
    if (initState.isInitialized && fabricCanvasRef.current) {
      logger.info("Canvas already initialized, skipping initialization");
      return true;
    }
    
    // Mark initialization as started
    const attemptNum = startInitialization();
    
    logger.info("Attempting canvas initialization with dimensions:", canvasDimensions);
    console.log("📏 Attempting canvas initialization with dimensions:", canvasDimensions);
    
    // CRITICAL CHECK: Verify canvas element exists and has dimensions
    if (!canvasRef.current) {
      logger.warn("⚠️ Canvas element not available - cannot initialize fabric canvas");
      console.log("🛑 Canvas element not available, can't initialize fabric canvas");
      failInitialization();
      
      // Check if we should trigger emergency mode
      if (hasExceededMaxAttempts()) {
        logger.error("Canvas reference never available after multiple attempts");
        
        if (componentMountedRef.current) {
          setHasError(true);
          setErrorMessage("Canvas element not available. Using emergency mode.");
        }
      }
      
      return false;
    }
    
    // Check canvas dimensions
    console.log("🧱 canvasRef exists with dimensions:", 
      canvasRef.current.offsetWidth, "x", canvasRef.current.offsetHeight);
    
    // Initialize the canvas
    const fabricCanvas = initializeCanvas();
    
    if (!fabricCanvas) {
      logger.warn("⚠️ Fabric canvas was not created - check DOM or ref issues");
      console.log("🎨 Fabric canvas was not created - initialization failed");
      failInitialization();
      
      // Check for too many retries and trigger emergency mode
      if (hasExceededMaxAttempts()) {
        logger.error("Canvas initialization failed after multiple attempts");
        
        if (componentMountedRef.current) {
          setHasError(true);
          setErrorMessage("Canvas initialization failed. Using emergency mode.");
        }
      }
      
      return false;
    }
    
    // If we got here, canvas was successfully created
    console.log("✅ Fabric canvas created successfully:", fabricCanvas.width, "x", fabricCanvas.height);
    
    // IMPORTANT: Make sure the fabric canvas ref is updated
    fabricCanvasRef.current = fabricCanvas;
    
    // Set debug info for canvas initialization
    if (componentMountedRef.current) {
      setDebugInfo(prev => ({
        ...prev, 
        canvasInitialized: true,
        dimensionsSet: true
      }));
    }
    
    // Initialize the brush
    setupBrush(fabricCanvas);
    
    // Create grid only after verifying the canvas has valid dimensions
    const createGridSafely = () => {
      try {
        // Create the grid using our grid initialization hook
        if (fabricCanvas && fabricCanvas.width > 0 && fabricCanvas.height > 0) {
          const grid = initializeGrid(fabricCanvas, createGrid);
          
          // Force render after grid is created
          fabricCanvas.requestRenderAll();
        } else {
          logger.error("Cannot create grid: Canvas has invalid dimensions");
        }
      } catch (error) {
        logger.error("Error in grid creation:", error);
      } finally {
        // Mark initialization as complete
        resetInitializationTracking();
        if (componentMountedRef.current) {
          completeInitialization();
        }
      }
    };
    
    // Use a short timeout to ensure canvas is fully ready
    setTimeout(createGridSafely, 50);
    
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
    
    return true;
  }, [
    canvasRef, 
    canvasDimensions, 
    initializeCanvas, 
    setupBrush, 
    createGrid,
    setupInteractions, 
    setDebugInfo,
    isInitialized,
    fabricCanvasRef,
    gridLayerRef,
    setHasError,
    setErrorMessage,
    componentMountedRef,
    trackInitializationAttempt,
    resetInitializationTracking,
    isCycleDetected,
    startInitialization,
    failInitialization,
    completeInitialization,
    getInitializationState,
    hasExceededMaxAttempts,
    initializeGrid
  ]);

  // Initialize canvas when component mounts or when dependencies change
  useEffect(() => {
    // Skip initialization if we detected an initialization cycle
    if (isCycleDetected()) {
      logger.info("Skipping initialization due to detected cycle");
      return;
    }
    
    // Clear any previous timeout
    clearInitTimeouts();
    
    if (isInitialized && fabricCanvasRef.current) {
      logger.info("Canvas already initialized, skipping initialization");
      return;
    }
    
    // IMPORTANT: Use requestAnimationFrame to wait for DOM to be fully rendered
    const waitForCanvasElement = () => {
      if (!componentMountedRef.current) return;
      
      // Check if canvas element exists and has dimensions
      if (!canvasRef.current || canvasRef.current.offsetWidth === 0) {
        console.log("⏳ Canvas not ready yet, waiting for next frame...");
        requestAnimationFrame(waitForCanvasElement);
        return;
      }
      
      // Now that we have a valid canvas element, attempt initialization
      console.log("✅ Canvas element ready with dimensions:", 
                  canvasRef.current.offsetWidth, "x", canvasRef.current.offsetHeight);
      const success = performInitialization();
      
      // If initialization failed, retry after a short delay (with backoff)
      if (!success && 
          !hasExceededMaxAttempts() && 
          componentMountedRef.current &&
          canvasRef.current) { // Only retry if canvas element exists
        
        const attemptNum = getInitializationState().attempts;
        const delay = Math.min(1000 * Math.pow(1.5, attemptNum), 5000);
        logger.info(`Initial canvas initialization failed, retrying in ${delay}ms (attempt ${attemptNum})...`);
        
        setInitTimeout(() => {
          // Skip if component unmounted during timeout
          if (!componentMountedRef.current) return;
          
          performInitialization();
        }, delay);
      }
    };
    
    // Start waiting for canvas element to be ready
    requestAnimationFrame(waitForCanvasElement);
    
    // Clean up on unmount
    return () => {
      // Skip cleanup if cycle detected, as it may be part of the problem
      if (isCycleDetected()) {
        logger.info("Skipping canvas disposal due to detected cycle");
        return;
      }
      
      // Set flag to prevent further operations during cleanup
      setDisposalState(true);
      
      // Store a local reference to the canvas before clearing it
      const currentCanvas = fabricCanvasRef.current;
      
      // Reset all BEFORE trying to dispose
      fabricCanvasRef.current = null;
      canvasInitializedRef.current = false;
      gridLayerRef.current = [];
      
      // Then dispose the canvas if it exists
      if (currentCanvas) {
        try {
          logger.info("Beginning canvas cleanup process");
          
          // Use our cleanup utility function
          cleanupCanvas(currentCanvas);
        } catch (error) {
          logger.error("Error initiating canvas cleanup:", error);
        } finally {
          // Reset disposal flag
          setDisposalState(false);
        }
      } else {
        // Reset disposal flag
        setDisposalState(false);
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
    canvasInitializedRef,
    canvasRef,
    clearInitTimeouts,
    componentMountedRef,
    hasExceededMaxAttempts,
    isCycleDetected,
    setDisposalState,
    setInitTimeout,
    getInitializationState
  ]);

  // Add a function to delete selected objects
  const deleteSelectedObjects = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    const activeObjects = canvas.getActiveObjects();
    
    if (activeObjects.length > 0) {
      // Save current state for undo
      if (historyRef.current) {
        const currentState = canvas.getObjects().filter(obj => 
          !gridLayerRef.current.includes(obj)
        );
        historyRef.current.past.push([...currentState]);
        historyRef.current.future = [];
      }
      
      // Remove selected objects
      canvas.remove(...activeObjects);
      canvas.discardActiveObject();
      canvas.requestRenderAll();
      
      // Recalculate GIA if objects were removed
      if (typeof createGrid === 'function') {
        createGrid(canvas);
      }
      
      toast.success(`Deleted ${activeObjects.length} object(s)`);
    }
  }, [fabricCanvasRef, gridLayerRef, historyRef, createGrid]);

  // Add a simple function to recalculate GIA
  const recalculateGIA = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    
    // This is a placeholder - the actual implementation would calculate GIA
    console.log("Recalculating GIA...");
    
    // If a grid function was provided, use it to refresh the grid
    if (typeof createGrid === 'function') {
      try {
        createGrid(fabricCanvasRef.current);
      } catch (error) {
        console.error("Error recalculating GIA:", error);
      }
    }
  }, [fabricCanvasRef, createGrid]);

  return {
    canvasRef,
    fabricCanvasRef,
    gridLayerRef,
    historyRef,
    deleteSelectedObjects,
    recalculateGIA
  };
};
