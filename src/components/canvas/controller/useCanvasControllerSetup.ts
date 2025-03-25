
/**
 * Hook for canvas initialization and setup
 * @module useCanvasControllerSetup
 */
import { useRef, useEffect, useState } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { useCanvasInitialization } from "@/hooks/useCanvasInitialization";
import { DebugInfoState } from "@/types/drawingTypes";
import { DrawingTool } from "@/hooks/useCanvasState";
import logger from "@/utils/logger";
import { toast } from "sonner";

interface UseCanvasControllerSetupProps {
  canvasDimensions: { width: number; height: number };
  tool: DrawingTool;
  currentFloor: number;
  setZoomLevel: React.Dispatch<React.SetStateAction<number>>;
  setDebugInfo: React.Dispatch<React.SetStateAction<DebugInfoState>>;
  setHasError: (value: boolean) => void;
  setErrorMessage: (value: string) => void;
}

/**
 * Hook that handles canvas initialization and setup
 * @returns Initialized canvas references and related objects
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
  // Track initialization attempts
  const [initAttempts, setInitAttempts] = useState(0);
  const maxInitAttempts = 3;
  
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
  
  // Add a check to verify that canvas references are valid with automatic retry
  useEffect(() => {
    let timeoutId: number | null = null;
    
    const checkCanvasSetup = () => {
      // Verify canvas element exists in the DOM
      if (!canvasRef.current) {
        logger.warn("Canvas element not found in DOM");
        
        if (initAttempts < maxInitAttempts) {
          // Retry after delay
          timeoutId = window.setTimeout(() => {
            setInitAttempts(prev => prev + 1);
            logger.info(`Retrying canvas setup (attempt ${initAttempts + 1}/${maxInitAttempts})...`);
          }, 1000);
        } else {
          // Show error after max attempts
          setHasError(true);
          setErrorMessage("Canvas element could not be found. Please refresh the page.");
          toast.error("Canvas initialization failed. Please refresh the page.");
        }
      } else {
        logger.info("Canvas element found in DOM");
      }
      
      // Verify fabric canvas is properly initialized
      if (!fabricCanvasRef.current) {
        logger.warn("Fabric canvas not initialized");
        
        if (initAttempts < maxInitAttempts) {
          // We'll let the retry from canvasRef.current handle this
        } else if (canvasRef.current) {
          // If canvas element exists but fabric canvas failed to initialize
          setHasError(true);
          setErrorMessage("Canvas failed to initialize. Please refresh the page.");
          toast.error("Canvas initialization failed. Please refresh the page.");
        }
      } else {
        logger.info("Canvas setup complete with dimensions:", canvasDimensions);
        setDebugInfo(prev => ({
          ...prev,
          dimensionsSet: true
        }));
      }
    };
    
    // Run this check after a short delay to allow time for the DOM to be ready
    timeoutId = window.setTimeout(checkCanvasSetup, 500);
    
    // Cleanup function
    return () => {
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [canvasRef, fabricCanvasRef, initAttempts, maxInitAttempts, canvasDimensions, setDebugInfo, setHasError, setErrorMessage]);

  return {
    canvasRef,
    fabricCanvasRef,
    historyRef
  };
};
