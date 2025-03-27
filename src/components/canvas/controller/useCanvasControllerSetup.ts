
/**
 * Canvas Controller Setup Hook
 * Handles initialization and setup of the canvas controller
 * @module canvas/controller/useCanvasControllerSetup
 */
import { useRef, useEffect } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { useCanvasInitialization } from "@/hooks/canvas-initialization";
import { DebugInfoState } from "@/types/drawingTypes";
import { DrawingTool } from "@/hooks/useCanvasState";
import logger from "@/utils/logger";
import { toast } from "sonner";
import type { CanvasReferences } from "@/types/fabric";

/**
 * Canvas controller setup properties
 * @interface UseCanvasControllerSetupProps
 */
interface UseCanvasControllerSetupProps {
  /** Current canvas dimensions */
  canvasDimensions: { width: number; height: number };
  /** Current drawing tool */
  tool: DrawingTool;
  /** Current floor index */
  currentFloor: number;
  /** Function to set zoom level */
  setZoomLevel: React.Dispatch<React.SetStateAction<number>>;
  /** Function to set debug info */
  setDebugInfo: React.Dispatch<React.SetStateAction<DebugInfoState>>;
  /** Function to set error state */
  setHasError: (value: boolean) => void;
  /** Function to set error message */
  setErrorMessage: (value: string) => void;
}

/**
 * Hook for canvas controller setup
 * Handles initialization, validation, and error handling for canvas controller
 * 
 * @param {UseCanvasControllerSetupProps} props - Hook properties
 * @returns {CanvasReferences} Canvas references
 */
export const useCanvasControllerSetup = ({
  canvasDimensions,
  tool,
  currentFloor,
  setZoomLevel,
  setDebugInfo,
  setHasError,
  setErrorMessage
}: UseCanvasControllerSetupProps): CanvasReferences => {
  // Initialize canvas and grid with improved error handling
  // useCanvasInitialization handles the core setup of the canvas and its components
  const { 
    canvasRef,         // Reference to the HTML canvas element
    fabricCanvasRef,   // Reference to the Fabric.js canvas instance
    historyRef         // Reference to the history state for undo/redo
  } = useCanvasInitialization({
    canvasDimensions,
    tool,
    currentFloor,
    setZoomLevel,
    setDebugInfo,
    setHasError,
    setErrorMessage
  });

  // Add a check to verify that canvas references are valid using requestAnimationFrame
  // This ensures DOM has been rendered before we try to access canvas properties
  useEffect(() => {
    // Track animation frame ID for cleanup
    let frameId: number;
    
    // Track number of validation attempts to avoid infinite loops
    let checkAttempts = 0;
    
    /**
     * Validate canvas references and initialization
     * Uses requestAnimationFrame for proper timing with the rendering cycle
     * This ensures we check after browser has had a chance to render
     */
    const checkCanvasReferences = () => {
      // Abort validation if we've exceeded maximum attempts
      // This prevents infinite loops if canvas never initializes properly
      if (checkAttempts >= CANVAS_VALIDATION.MAX_CHECK_ATTEMPTS) {
        logger.warn(`Canvas validation abandoned after ${CANVAS_VALIDATION.MAX_CHECK_ATTEMPTS} attempts`);
        return;
      }
      
      // Increment attempt counter
      checkAttempts++;
      
      // If canvas element exists and is in DOM, log success
      if (canvasRef.current) {
        logger.info("Canvas element found in DOM");
        console.log("🧱 canvasRef:", canvasRef.current);
        console.log("📐 Dimensions:", canvasRef.current.width, canvasRef.current.height);
        
        // If Fabric canvas is also initialized, we're fully ready
        if (fabricCanvasRef.current) {
          logger.info("Canvas setup complete with dimensions:", canvasDimensions);
          console.log("🎨 fabricCanvasRef:", fabricCanvasRef.current);
          console.log("🧮 Objects on canvas:", fabricCanvasRef.current.getObjects()?.length);
          
          // Check if the canvas has valid dimensions
          // Invalid dimensions will cause rendering issues
          if (isDimensionInvalid(fabricCanvasRef.current.width) || 
              isDimensionInvalid(fabricCanvasRef.current.height)) {
            logger.warn("Fabric canvas has invalid dimensions:", {
              width: fabricCanvasRef.current.width,
              height: fabricCanvasRef.current.height
            });
            
            // Report error to UI
            setHasError(true);
            setErrorMessage("Canvas has invalid dimensions. Please refresh the page and try again.");
          } else {
            // Everything looks good! Update debug info
            setDebugInfo(prev => ({
              ...prev,
              dimensionsSet: true,
              canvasInitialized: true
            }));
          }
          
          // No need to check further
          return;
        }
      }
      
      // Canvas element or Fabric canvas not ready yet, try again in next frame
      // This creates a polling mechanism that waits for canvas to be ready
      frameId = requestAnimationFrame(checkCanvasReferences);
    };
    
    /**
     * Check if a dimension is invalid (too small or not a number)
     * @param dimension - The dimension to check
     * @returns True if dimension is invalid
     */
    const isDimensionInvalid = (dimension: number): boolean => {
      return !isFinite(dimension) || dimension < CANVAS_VALIDATION.MIN_DIMENSION;
    };
    
    // Start checking after a short delay to allow DOM to initialize
    // This gives the browser time to render the canvas element
    const timeoutId = setTimeout(() => {
      frameId = requestAnimationFrame(checkCanvasReferences);
    }, CANVAS_VALIDATION.VALIDATION_DELAY);
    
    // Clean up animation frames and timeout on unmount
    return () => {
      clearTimeout(timeoutId);
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [canvasRef, fabricCanvasRef, canvasDimensions, setDebugInfo, setHasError, setErrorMessage]);

  // Return the canvas references for the controller to use
  return {
    canvas: fabricCanvasRef.current,
    canvasElement: canvasRef.current as HTMLCanvasElement,
    container: canvasRef.current?.parentElement as HTMLElement
  };
};

/**
 * Canvas validation constants
 * These control the validation process timing and limits
 */
const CANVAS_VALIDATION = {
  /**
   * Maximum number of validation attempts
   * Prevents infinite loops if canvas never initializes
   */
  MAX_CHECK_ATTEMPTS: 10,
  
  /**
   * Initial validation delay in milliseconds
   * Gives DOM time to render before checking
   */
  VALIDATION_DELAY: 100,
  
  /**
   * Minimum acceptable canvas dimension
   * Dimensions less than this are considered invalid
   */
  MIN_DIMENSION: 1
};
