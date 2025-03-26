
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
      } else {
        logger.info("Canvas element found in DOM");
      }
      
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
