
/**
 * Hook for canvas initialization and setup
 * @module useCanvasControllerSetup
 */
import { useRef, useEffect } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { useCanvasInitialization } from "@/hooks/useCanvasInitialization";
import { DebugInfoState } from "@/types/drawingTypes";
import { DrawingTool } from "@/hooks/useCanvasState";
import logger from "@/utils/logger";
import { toast } from "sonner";

/**
 * Props interface for useCanvasControllerSetup hook
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
 * Hook that handles canvas initialization and setup
 * Manages canvas creation, initialization and validation
 * 
 * @param {UseCanvasControllerSetupProps} props - Hook properties 
 * @returns {Object} Initialized canvas references and related objects
 */
export const useCanvasControllerSetup = ({
  canvasDimensions,
  tool,
  currentFloor,
  setZoomLevel,
  setDebugInfo,
  setHasError,
  setErrorMessage
}: UseCanvasControllerSetupProps) => {
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
          dimensionsSet: true
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
