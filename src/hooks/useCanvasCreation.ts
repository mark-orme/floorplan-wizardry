
/**
 * Custom hook for initializing Fabric.js canvas
 * @module useCanvasCreation
 */
import { useCallback, useEffect, useRef } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { toast } from "sonner";
import { CanvasDimensions } from "@/types/drawingTypes";

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
  const maxRetryAttempts = 5; // Max retry attempts for canvas initialization
  const retryTimeoutRef = useRef<number | null>(null);

  // This effect will ensure we clean up any timeouts when the component unmounts
  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current !== null) {
        window.clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
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
    
    if (canvasInitializedRef.current && fabricCanvasRef.current) {
      return fabricCanvasRef.current;
    }
    
    // Prevent concurrent initializations
    if (initializationInProgressRef.current) {
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
  }, [canvasDimensions, setHasError, setErrorMessage]);

  return {
    canvasRef,
    fabricCanvasRef,
    canvasInitializedRef,
    initializeCanvas
  };
};
