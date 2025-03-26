
import { useRef, useEffect } from "react";
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

  // Add a check to verify that canvas references are valid using requestAnimationFrame
  // to ensure DOM has been rendered
  useEffect(() => {
    let frameId: number;
    let checkAttempts = 0;
    const MAX_CHECK_ATTEMPTS = 10;
    
    const checkCanvasReferences = () => {
      if (checkAttempts >= MAX_CHECK_ATTEMPTS) {
        logger.warn(`Canvas validation abandoned after ${MAX_CHECK_ATTEMPTS} attempts`);
        return;
      }
      
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
          if (fabricCanvasRef.current.width === 0 || fabricCanvasRef.current.height === 0) {
            logger.warn("Fabric canvas has zero dimensions:", {
              width: fabricCanvasRef.current.width,
              height: fabricCanvasRef.current.height
            });
            setHasError(true);
            setErrorMessage("Canvas has invalid dimensions. Please refresh the page and try again.");
          } else {
            // Everything looks good!
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
      frameId = requestAnimationFrame(checkCanvasReferences);
    };
    
    // Start checking
    frameId = requestAnimationFrame(checkCanvasReferences);
    
    // Clean up the animation frame on unmount
    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [canvasRef, fabricCanvasRef, canvasDimensions, setDebugInfo, setHasError, setErrorMessage]);

  return {
    canvasRef,
    fabricCanvasRef,
    historyRef
  };
};
