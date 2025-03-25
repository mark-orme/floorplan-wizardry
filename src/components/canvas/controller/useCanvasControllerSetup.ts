
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
  // Initialize canvas and grid
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
    // Verify canvas element exists in the DOM
    if (!canvasRef.current) {
      logger.warn("Canvas element not found in DOM");
    }
    
    // Verify fabric canvas is properly initialized
    if (!fabricCanvasRef.current) {
      logger.warn("Fabric canvas not initialized");
    } else {
      logger.info("Canvas setup complete");
    }
  }, [canvasRef, fabricCanvasRef]);

  return {
    canvasRef,
    fabricCanvasRef,
    historyRef
  };
};
