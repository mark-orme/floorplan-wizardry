
/**
 * Hook for managing canvas references
 */
import { useCallback, useRef } from "react";
import { Canvas as FabricCanvas } from "fabric";
import logger from "@/utils/logger";

interface UseCanvasRefProps {
  setCanvas?: (canvas: FabricCanvas | null) => void;
}

export const useCanvasRef = ({ setCanvas }: UseCanvasRefProps) => {
  // Reference to the drawing canvas component
  const canvasComponentRef = useRef<any>(null);
  
  // Reset canvas ref when component unmounts
  const cleanupCanvas = useCallback(() => {
    if (setCanvas) {
      setCanvas(null);
    }
    logger.info("Canvas references cleaned up");
  }, [setCanvas]);
  
  // Set canvas ref and update undo/redo state
  const setCanvasRef = useCallback((ref: any) => {
    canvasComponentRef.current = ref;
  }, []);

  return {
    canvasComponentRef,
    setCanvasRef,
    cleanupCanvas
  };
};
