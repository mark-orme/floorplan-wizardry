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
import { 
  prepareCanvasForInitialization, 
  validateCanvasInitialization,
  handleInitializationFailure
} from "@/utils/canvas/safeCanvasInitialization";
import { captureError } from "@/utils/sentryUtils";

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
  const maxRetryAttempts = 5; // Reduced to prevent excessive attempts
  const retryTimeoutRef = useRef<number | null>(null);
  const [canvasElementChecked, setCanvasElementChecked] = useState<boolean>(false);
  
  // Get canvas cleanup utilities
  const { 
    cleanupCanvas, 
    isCanvasElementInitialized: checkCanvasElementInitialized, 
    markCanvasAsInitialized
  } = useCanvasCleanup();

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

  // Initialize canvas with performance optimizations and duplicate initialization checks
  const initializeCanvas = useCallback((): FabricCanvas | null => {
    // Prevent concurrent initializations
    if (initializationInProgressRef.current) {
      logger.debug("Canvas initialization already in progress, skipping");
      return null;
    }
    
    // CRITICAL CHECK: If we already have an initialized canvas, return it instead of creating a new one
    if (canvasInitializedRef.current && fabricCanvasRef.current) {
      logger.debug("Canvas already initialized, reusing existing instance");
      return fabricCanvasRef.current;
    }
    
    // Get the canvas element
    const canvasElement = canvasRef.current;
    if (!canvasElement) {
      // If canvas element is not available, retry with limited attempts
      if (retryAttemptsRef.current < maxRetryAttempts) {
        retryAttemptsRef.current++;
        const delay = Math.min(300 * Math.pow(1.3, retryAttemptsRef.current), 3000);
        
        retryTimeoutRef.current = window.setTimeout(() => {
          retryTimeoutRef.current = null;
          initializeCanvas();
        }, delay);
      } else {
        // Max retries reached, fail with error
        setHasError(true);
        setErrorMessage("Could not find canvas element after multiple attempts");
        toast.error("Failed to find canvas element. Please refresh the page.");
      }
      
      return null;
    }
    
    initializationInProgressRef.current = true;
    
    try {
      // Prepare the canvas element for initialization
      prepareCanvasForInitialization(canvasElement);
      
      // Force canvas element to have width and height using inline style
      canvasElement.style.width = `${canvasDimensions.width || 800}px`;
      canvasElement.style.height = `${canvasDimensions.height || 600}px`;
      
      // Set width and height attributes
      canvasElement.width = canvasDimensions.width || 800;
      canvasElement.height = canvasDimensions.height || 600;
      
      // Trigger a forced reflow
      canvasElement.getBoundingClientRect();
      
      // Attempting canvas initialization with dimensions... debug message
      console.log(`Attempting canvas initialization with dimensions... ${canvasDimensions.width || 800} x ${canvasDimensions.height || 600}`);
      
      // PERFORMANCE OPTIMIZATIONS for Fabric.js initialization
      const fabricCanvas = new FabricCanvas(canvasElement, {
        backgroundColor: "#FFFFFF",
        isDrawingMode: true,
        selection: false,
        width: canvasDimensions.width || 800,
        height: canvasDimensions.height || 600,
        renderOnAddRemove: false,
        stateful: false,
        fireRightClick: false,
        stopContextMenu: true,
        enableRetinaScaling: false,
        perPixelTargetFind: false,
        skipOffscreen: true,
        objectCaching: true,
        imageSmoothingEnabled: false,
        preserveObjectStacking: false,
        svgViewportTransformation: false
      });
      
      // Validate the created canvas
      if (!validateCanvasInitialization(fabricCanvas)) {
        throw new Error("Canvas validation failed after creation");
      }
      
      console.log("FabricCanvas instance created successfully with size:", 
        fabricCanvas.width, "x", fabricCanvas.height);
      
      // Mark this canvas element as initialized to prevent duplicate initialization
      if (canvasElement) {
        markCanvasAsInitialized(canvasElement);
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
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("Error initializing canvas:", errorMessage);
      
      handleInitializationFailure(errorMessage, false);
      
      setHasError(true);
      setErrorMessage(`Failed to initialize canvas: ${errorMessage}`);
      toast.error("Failed to initialize canvas");
      
      captureError(err, 'canvas-initialization-error', {
        level: 'error',
        extra: { 
          dimensions: canvasDimensions,
          retryAttempts: retryAttemptsRef.current
        }
      });
      
      initializationInProgressRef.current = false;
      return null;
    }
  }, [
    canvasDimensions, 
    setHasError, 
    setErrorMessage, 
    cleanupCanvas, 
    checkCanvasElementInitialized, 
    markCanvasAsInitialized
  ]);

  return {
    canvasRef,
    fabricCanvasRef,
    canvasInitializedRef,
    initializeCanvas
  };
};
