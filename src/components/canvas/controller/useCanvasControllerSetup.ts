
import { useRef, useEffect } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { useCanvasInitialization } from "@/hooks/useCanvasInitialization";
import { DebugInfoState } from "@/types/debugTypes";
import { DrawingTool } from "@/hooks/useCanvasState";
import { Point } from "@/types/drawingTypes";
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
      if (!canvasRef.current) {
        logger.warn("Canvas element not found in DOM");
        setHasError(true);
        setErrorMessage("Canvas element not found in DOM. Please refresh the page.");
      } else {
        logger.info("Canvas element found in DOM");
      }
      
      if (!fabricCanvasRef.current) {
        logger.warn("Fabric canvas not initialized");
        setHasError(true);
        setErrorMessage("Canvas initialization failed. Please refresh the page and try again.");
      } else {
        logger.info("Canvas setup complete with dimensions:", canvasDimensions);
        // Check if the canvas has valid dimensions
        if (fabricCanvasRef.current.width === 0 || fabricCanvasRef.current.height === 0) {
          logger.warn("Fabric canvas has zero dimensions:", {
            width: fabricCanvasRef.current.width,
            height: fabricCanvasRef.current.height
          });
          setHasError(true);
          setErrorMessage("Canvas has invalid dimensions. Please refresh the page and try again.");
        }
        
        setDebugInfo(prev => ({
          ...prev,
          dimensionsSet: true,
          canvasInitialized: true
        }));
      }
    }, 500);
    
    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [canvasRef, fabricCanvasRef, canvasDimensions, setDebugInfo, setHasError, setErrorMessage]);

  return {
    canvasRef,
    fabricCanvasRef,
    historyRef
  };
};
