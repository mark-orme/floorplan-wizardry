
/**
 * Custom hook for initializing Fabric.js canvas
 * @module useCanvasCreation
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { toast } from "sonner";
import { CanvasDimensions } from "@/types/drawingTypes";
import { useCanvasCleanup } from "./useCanvasCleanup";
import logger from "@/utils/logger";

/**
 * Props for useCanvasCreation hook
 */
interface UseCanvasCreationProps {
  canvasDimensions: CanvasDimensions;
  setHasError: (value: boolean) => void;
  setErrorMessage: (value: string) => void;
}

/**
 * Return type for useCanvasCreation hook
 */
interface UseCanvasCreationResult {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  canvasInitializedRef: React.MutableRefObject<boolean>;
  initializeCanvas: () => FabricCanvas | null;
}

/**
 * Hook to handle basic canvas creation and setup
 * @param {UseCanvasCreationProps} props - Hook properties
 * @returns {UseCanvasCreationResult} Canvas creation utilities and references
 */
export const useCanvasCreation = ({
  canvasDimensions,
  setHasError,
  setErrorMessage
}: UseCanvasCreationProps): UseCanvasCreationResult => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const canvasInitializedRef = useRef<boolean>(false);
  const initializationInProgressRef = useRef<boolean>(false);
  const retryAttemptsRef = useRef<number>(0);
  const maxRetryAttempts = 10; // Increased retry attempts for canvas initialization
  const retryTimeoutRef = useRef<number | null>(null);
  const [canvasElementChecked, setCanvasElementChecked] = useState<boolean>(false);
  
  // Get canvas cleanup utilities
  const { cleanupCanvas, isCanvasElementInitialized, markCanvasAsInitialized } = useCanvasCleanup();

  // This effect will ensure we clean up any timeouts when the component unmounts
  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current !== null) {
        window.clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
    };
  }, []);

  // This effect will check for the canvas element periodically
  useEffect(() => {
    const checkCanvasElement = () => {
      if (!canvasRef.current) {
        // First try by ID
        const canvasById = document.getElementById('fabric-canvas');
        
        // Then try by data-testid
        const canvasByTestId = document.querySelector('[data-testid="canvas-element"]');
        
        // Use any method that works
        if (canvasById instanceof HTMLCanvasElement) {
          console.log("Found canvas element via id, using it directly");
          canvasRef.current = canvasById;
          setCanvasElementChecked(true);
        } else if (canvasByTestId instanceof HTMLCanvasElement) {
          console.log("Found canvas element via data-testid, using it directly");
          canvasRef.current = canvasByTestId;
          setCanvasElementChecked(true);
        } else {
          // Search for any canvas element on the page
          const anyCanvas = document.querySelector('canvas');
          if (anyCanvas instanceof HTMLCanvasElement) {
            console.log("Found a canvas element on the page, using it as fallback");
            canvasRef.current = anyCanvas;
            setCanvasElementChecked(true);
          } else {
            console.log("No canvas element found yet, will retry");
            // Retry after a short delay
            setTimeout(checkCanvasElement, 500);
          }
        }
      } else {
        setCanvasElementChecked(true);
      }
    };
    
    // Start checking for canvas element
    checkCanvasElement();
    
    return () => {
      setCanvasElementChecked(false);
    };
  }, []);

  // Initialize canvas with performance optimizations
  const initializeCanvas = useCallback((): FabricCanvas | null => {
    if (!canvasRef.current) {
      console.warn("Canvas reference is not available yet");
      
      // First try by ID
      const canvasById = document.getElementById('fabric-canvas');
      
      // Then try by data-testid
      const canvasByTestId = document.querySelector('[data-testid="canvas-element"]');
      
      // Use any method that works
      if (canvasById instanceof HTMLCanvasElement) {
        console.log("Found canvas element via id, using it directly");
        canvasRef.current = canvasById;
      } else if (canvasByTestId instanceof HTMLCanvasElement) {
        console.log("Found canvas element via data-testid, using it directly");
        canvasRef.current = canvasByTestId;
      } else {
        // Search for any canvas element on the page
        const anyCanvas = document.querySelector('canvas');
        if (anyCanvas instanceof HTMLCanvasElement) {
          console.log("Found a canvas element on the page, using it as fallback");
          canvasRef.current = anyCanvas;
        } else {
          // Retry initialization after a delay if we haven't exceeded max attempts
          if (retryAttemptsRef.current < maxRetryAttempts) {
            retryAttemptsRef.current++;
            console.log(`Retrying canvas initialization (attempt ${retryAttemptsRef.current}/${maxRetryAttempts})`);
            
            // Clear any existing timeout
            if (retryTimeoutRef.current !== null) {
              window.clearTimeout(retryTimeoutRef.current);
            }
            
            // Set a new timeout with exponential backoff
            const delay = Math.min(500 * Math.pow(1.5, retryAttemptsRef.current), 5000);
            retryTimeoutRef.current = window.setTimeout(() => {
              retryTimeoutRef.current = null;
              initializeCanvas();
            }, delay);
          } else {
            console.error("Max retry attempts reached. Could not initialize canvas.");
            setHasError(true);
            setErrorMessage("Could not initialize canvas after multiple attempts. Please refresh the page.");
            toast.error("Failed to initialize canvas. Please refresh the page.");
          }
          
          return null;
        }
      }
    }
    
    // CRITICAL CHECK: If we already have an initialized canvas, return it instead of creating a new one
    if (canvasInitializedRef.current && fabricCanvasRef.current) {
      logger.debug("Canvas already initialized, reusing existing instance");
      return fabricCanvasRef.current;
    }
    
    // Prevent concurrent initializations
    if (initializationInProgressRef.current) {
      logger.debug("Canvas initialization already in progress, skipping");
      return null;
    }
    
    // Check if the canvas element has already been initialized by another instance
    if (canvasRef.current && isCanvasElementInitialized(canvasRef.current)) {
      logger.warn("Canvas element already has a Fabric instance attached, disposing first");
      
      // If we have a previous canvas instance, dispose it first
      if (fabricCanvasRef.current) {
        cleanupCanvas(fabricCanvasRef.current);
        fabricCanvasRef.current = null;
      }
      
      // Wait a bit before continuing to ensure disposal is complete
      // This could be improved with a promise-based approach
      const timeoutId = setTimeout(() => {
        initializeCanvas();
      }, 500);
      
      return null;
    }
    
    initializationInProgressRef.current = true;
    
    try {
      console.log("Creating new Fabric canvas instance with dimensions:", canvasDimensions);
      
      // Force canvas element to have width and height using inline style
      canvasRef.current.style.width = `${canvasDimensions.width || 800}px`;
      canvasRef.current.style.height = `${canvasDimensions.height || 600}px`;
      
      // Set width and height attributes
      canvasRef.current.width = canvasDimensions.width || 800;
      canvasRef.current.height = canvasDimensions.height || 600;
      
      // Trigger a forced reflow
      canvasRef.current.getBoundingClientRect();
      
      // PERFORMANCE OPTIMIZATIONS for Fabric.js initialization
      const fabricCanvas = new FabricCanvas(canvasRef.current, {
        backgroundColor: "#FFFFFF",
        isDrawingMode: true,
        selection: false,
        width: canvasDimensions.width || 800, // Fallback dimensions if not specified
        height: canvasDimensions.height || 600, // Fallback dimensions if not specified
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
      
      console.log("FabricCanvas instance created successfully with size:", 
        fabricCanvas.width, "x", fabricCanvas.height);
      
      // Mark this canvas element as initialized to prevent duplicate initialization
      if (canvasRef.current) {
        markCanvasAsInitialized(canvasRef.current);
      }
      
      fabricCanvasRef.current = fabricCanvas;
      canvasInitializedRef.current = true;
      
      // Reset retry attempts on success
      retryAttemptsRef.current = 0;
      
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
  }, [canvasDimensions, setHasError, setErrorMessage, cleanupCanvas, isCanvasElementInitialized, markCanvasAsInitialized]);

  return {
    canvasRef,
    fabricCanvasRef,
    canvasInitializedRef,
    initializeCanvas
  };
};
