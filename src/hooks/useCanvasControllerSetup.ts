
/**
 * Hook for canvas initialization and setup
 * @module useCanvasControllerSetup
 */
import { useRef, useEffect } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { useCanvasInitialization } from "@/hooks/canvas-initialization";
import { DebugInfoState } from "@/types/drawingTypes";
import { DrawingMode } from "@/constants/drawingModes";
import { resetInitializationState } from "@/utils/canvas/safeCanvasInitialization";
import logger from "@/utils/logger";

/**
 * Props interface for useCanvasControllerSetup hook
 * @interface UseCanvasControllerSetupProps
 */
interface UseCanvasControllerSetupProps {
  /** Current canvas dimensions */
  canvasDimensions: { width: number; height: number };
  /** Current drawing tool */
  tool: DrawingMode;
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

interface UseCanvasControllerSetupResult {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  historyRef: React.MutableRefObject<{
    past: FabricObject[][];
    future: FabricObject[][];
  }>;
}

/**
 * Hook that handles canvas initialization and setup
 * Manages canvas creation, initialization and validation
 * 
 * @param {UseCanvasControllerSetupProps} props - Hook properties 
 * @returns {UseCanvasControllerSetupResult} Initialized canvas references and related objects
 */
export const useCanvasControllerSetup = ({
  canvasDimensions,
  tool,
  currentFloor,
  setZoomLevel,
  setDebugInfo,
  setHasError,
  setErrorMessage
}: UseCanvasControllerSetupProps): UseCanvasControllerSetupResult => {
  // Reset initialization state at the beginning
  useEffect(() => {
    resetInitializationState();
  }, []);
  
  // Initialize canvas and grid with improved error handling
  const { 
    canvasRef, 
    fabricCanvasRef, 
    historyRef 
  } = useCanvasInitialization({
    canvasDimensions,
    tool,
    currentFloor,
    setZoomLevel,
    setDebugInfo,
    setHasError,
    setErrorMessage
  });
  
  // Add a check to verify that canvas references are valid
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      // Verify canvas element exists in the DOM
      if (!canvasRef.current) {
        logger.warn("Canvas element not found in DOM");
      } else {
        logger.info("Canvas element found in DOM");
      }
      
      // Verify fabric canvas is properly initialized
      if (!fabricCanvasRef.current) {
        logger.warn("Fabric canvas not initialized");
      } else {
        logger.info("Canvas setup complete with dimensions:", canvasDimensions);
        setDebugInfo(prev => ({
          ...prev,
          dimensionsSet: true,
          canvasInitialized: true
        }));
      }
    }, 500);
    
    // Cleanup function
    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [canvasRef, fabricCanvasRef, canvasDimensions, setDebugInfo]);

  return {
    canvasRef,
    fabricCanvasRef,
    historyRef
  };
};
