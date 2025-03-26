
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
import logger from "@/utils/logger";
import { createBasicEmergencyGrid } from "@/utils/gridCreationUtils";

// Global tracker for initial toast shown
let initialToastShown = false;
// Track whether initialization is in progress
let initializationInProgress = false;
// Track whether canvas is being disposed
let canvasDisposalInProgress = false;
// Track if we're in an initialization cycle
let canvasInitializationCycleDetected = false;
// Count consecutive initializations to detect loops
let consecutiveInitializations = 0;
const MAX_CONSECUTIVE_INITIALIZATIONS = 3;
// Add a global attempt counter to track overall initialization attempts
let globalInitAttempts = 0;
const MAX_GLOBAL_INIT_ATTEMPTS = 5;

/**
 * Hook for initializing the canvas and related objects
 */
export const useCanvasInitialization = ({
  canvasDimensions,
  tool,
  currentFloor,
  setZoomLevel,
  setDebugInfo,
  setHasError,
  setErrorMessage
}) => {
  // Track initialization state
  const [isInitialized, setIsInitialized] = useState(false);
  const initTimeoutRef = useRef<number | null>(null);
  const initializationAttempts = useRef(0);
  const maxInitAttempts = 2; // Reduced from 3 to 2
  const componentMountedRef = useRef(true); // Track if component is mounted
  
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
  
  // Define a simple setupInteractions function
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

  // Set component mounted flag
  useEffect(() => {
    componentMountedRef.current = true;
    
    return () => {
      componentMountedRef.current = false;
    };
  }, []);

  /**
   * Helper function to perform initialization that can be retried
   * @returns {boolean} Whether initialization was successful
   */
  const performInitialization = useCallback((): boolean => {
    // First, increment global attempt counter to track overall initialization attempts
    globalInitAttempts++;
    
    // Check if we've exceeded the global maximum attempts
    if (globalInitAttempts > MAX_GLOBAL_INIT_ATTEMPTS) {
      logger.error(`Too many global initialization attempts (${globalInitAttempts}), blocking further attempts`);
      
      // Only update error state if component is still mounted
      if (componentMountedRef.current) {
        setHasError(true);
        setErrorMessage(`Canvas initialization failed after multiple attempts. Using emergency mode.`);
      }
      
      // Return false to break the retry chain
      return false;
    }
    
    // Detect initialization cycles and break them
    consecutiveInitializations++;
    if (consecutiveInitializations > MAX_CONSECUTIVE_INITIALIZATIONS) {
      logger.warn("Initialization cycle detected, breaking the loop");
      canvasInitializationCycleDetected = true;
      consecutiveInitializations = 0;
      
      // Try to create an emergency grid instead
      if (fabricCanvasRef.current) {
        try {
          logger.info("Creating basic emergency grid due to initialization cycle");
          createBasicEmergencyGrid(fabricCanvasRef.current, gridLayerRef);
          
          if (componentMountedRef.current) {
            setIsInitialized(true);
          }
          return true;
        } catch (error) {
          logger.error("Failed to create emergency grid:", error);
        }
      }
      
      return false;
    }
    
    // Avoid multiple simultaneous initialization attempts
    if (initializationInProgress) {
      logger.info("Initialization already in progress, skipping");
      return false;
    }

    // Don't attempt to initialize if disposal is in progress
    if (canvasDisposalInProgress) {
      logger.info("Canvas disposal in progress, skipping initialization");
      return false;
    }
    
    // Don't reinitialize if canvas already exists and initialized flag is set
    if (isInitialized && fabricCanvasRef.current) {
      logger.info("Canvas already initialized, skipping initialization");
      return true;
    }
    
    initializationInProgress = true;
    initializationAttempts.current += 1;
    
    logger.info("Attempting canvas initialization with dimensions:", canvasDimensions);
    console.log("📏 Attempting canvas initialization with dimensions:", canvasDimensions);
    
    // CRITICAL CHANGE: Add a stronger guard to break the retry loop if canvas ref is null
    if (!canvasRef.current) {
      logger.warn("Canvas element still not available — NOT retrying");
      console.log("🛑 Canvas element not available, can't initialize fabric canvas");
      initializationInProgress = false;
      
      // Check if we should trigger emergency mode
      if (initializationAttempts.current >= maxInitAttempts) {
        logger.error("Canvas reference never available after multiple attempts, triggering emergency mode");
        
        if (componentMountedRef.current) {
          setHasError(true);
          setErrorMessage("Canvas element not available. Using emergency mode.");
        }
      }
      
      return false;
    }
    
    console.log("🧱 canvasRef exists:", canvasRef.current);
    
    // Initialize the canvas
    const fabricCanvas = initializeCanvas();
    
    // CRITICAL CHANGE: More detailed logging about why initialization failed
    if (!fabricCanvas) {
      logger.warn("Fabric canvas was not created - check DOM or ref issues");
      console.log("🎨 Fabric canvas was not created - initialization failed");
      initializationInProgress = false;
      
      // Check for too many retries and trigger emergency mode
      if (initializationAttempts.current >= maxInitAttempts) {
        logger.error("Canvas initialization failed after multiple attempts, triggering emergency mode");
        
        if (componentMountedRef.current) {
          setHasError(true);
          setErrorMessage("Canvas initialization failed. Using emergency mode.");
        }
      }
      
      return false;
    }
    
    // If we got here, canvas was successfully created
    console.log("✅ Fabric canvas created successfully:", fabricCanvas.width, "x", fabricCanvas.height);
    
    // Set debug info for canvas initialization
    if (componentMountedRef.current) {
      setDebugInfo(prev => ({
        ...prev, 
        canvasInitialized: true,
        dimensionsSet: true
      }));
    }
    
    // Important: make sure the fabric canvas ref is updated
    fabricCanvasRef.current = fabricCanvas;
    
    // Initialize the brush
    setupBrush(fabricCanvas);
    
    // Create grid directly after canvas is initialized
    const createGridSafely = () => {
      try {
        // Reset retry counter for grid creation to give it a fresh start
        logger.info("Creating grid on initialized canvas");
        console.log("🔲 Creating grid on initialized canvas");
        
        // Enable rendering first
        if (fabricCanvas) {
          fabricCanvas.renderOnAddRemove = true;
          
          // Directly create the grid
          const gridObjects = createGrid(fabricCanvas);
          
          // If we didn't create any grid objects, try emergency grid
          if (!gridObjects || gridObjects.length === 0) {
            logger.info("No grid objects created, trying basic emergency grid");
            console.log("⚠️ No grid objects created, trying emergency grid");
            createBasicEmergencyGrid(fabricCanvas, gridLayerRef);
          } else {
            console.log("✅ Grid successfully created:", gridObjects.length, "objects");
          }
          
          // Force render after grid is created
          fabricCanvas.requestRenderAll();
          console.log("🔄 Requesting canvas render");
          
          // Set debug info for grid creation
          if (componentMountedRef.current) {
            setDebugInfo(prev => ({
              ...prev,
              gridCreated: true,
              gridObjectCount: gridLayerRef.current.length
            }));
          }
          
          logger.info(`Grid created with ${gridLayerRef.current.length} objects`);
        }
      } catch (error) {
        logger.error("Error creating grid:", error);
        console.error("❌ Error creating grid:", error);
        
        // Try emergency grid on error
        if (fabricCanvas) {
          try {
            console.log("🚨 Attempting emergency grid creation");
            createBasicEmergencyGrid(fabricCanvas, gridLayerRef);
          } catch (emergencyError) {
            logger.error("Emergency grid creation also failed:", emergencyError);
            console.error("❌ Emergency grid creation also failed:", emergencyError);
          }
        }
      } finally {
        // Mark initialization as no longer in progress
        initializationInProgress = false;
        
        // Reset consecutive initializations counter on success
        consecutiveInitializations = 0;
        
        // Reset global attempts counter on success
        globalInitAttempts = 0;
        
        // Mark as initialized if component is still mounted
        if (componentMountedRef.current) {
          setIsInitialized(true);
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
    componentMountedRef
  ]);

  // Initialize canvas when component mounts or when dependencies change
  useEffect(() => {
    // Skip initialization if we detected an initialization cycle
    if (canvasInitializationCycleDetected) {
      logger.info("Skipping initialization due to detected cycle");
      return;
    }
    
    // Clear any previous timeout
    if (initTimeoutRef.current !== null) {
      window.clearTimeout(initTimeoutRef.current);
      initTimeoutRef.current = null;
    }
    
    if (isInitialized && fabricCanvasRef.current) {
      logger.info("Canvas already initialized, skipping initialization");
      return;
    }
    
    // Reset attempts counter on dependency changes
    initializationAttempts.current = 0;
    
    // Wait for DOM to be fully rendered before attempting initialization
    logger.info("Scheduling canvas initialization...");
    initTimeoutRef.current = window.setTimeout(() => {
      // Skip if component unmounted
      if (!componentMountedRef.current) return;
      
      // Attempt initialization
      const success = performInitialization();
      
      // If initialization failed, retry after a short delay (with backoff)
      // CRITICAL CHANGE: Add additional checks to prevent infinite retry loop
      if (!success && 
          initializationAttempts.current < maxInitAttempts && 
          globalInitAttempts < MAX_GLOBAL_INIT_ATTEMPTS &&
          componentMountedRef.current &&
          canvasRef.current) { // Only retry if canvas element exists
        
        const delay = Math.min(1000 * Math.pow(1.5, initializationAttempts.current), 5000);
        logger.info(`Initial canvas initialization failed, retrying in ${delay}ms (attempt ${initializationAttempts.current}/${maxInitAttempts})...`);
        
        initTimeoutRef.current = window.setTimeout(() => {
          // Skip if component unmounted during timeout
          if (!componentMountedRef.current) return;
          
          performInitialization();
        }, delay);
      }
    }, 500);
    
    // Clean up on unmount
    return () => {
      // Set mounted flag to false
      componentMountedRef.current = false;
      
      // Clear any pending initialization timeouts
      if (initTimeoutRef.current !== null) {
        window.clearTimeout(initTimeoutRef.current);
        initTimeoutRef.current = null;
      }
      
      // Skip cleanup if cycle detected, as it may be part of the problem
      if (canvasInitializationCycleDetected) {
        logger.info("Skipping canvas disposal due to detected cycle");
        return;
      }
      
      // Set flag to prevent further operations during cleanup
      canvasDisposalInProgress = true;
      initializationInProgress = false;
      
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
          canvasDisposalInProgress = false;
        }
      } else {
        // Reset disposal flag
        canvasDisposalInProgress = false;
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
    canvasRef
  ]);

  return {
    canvasRef,
    fabricCanvasRef,
    gridLayerRef,
    historyRef
  };
};
