
import { useEffect, useRef, useCallback } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { setCanvasDimensions } from "@/utils/fabricHelpers";

interface UseCanvasResizingProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  setCanvasDimensions: React.Dispatch<React.SetStateAction<{ width: number, height: number }>>;
  setDebugInfo: React.Dispatch<React.SetStateAction<{
    canvasInitialized: boolean;
    gridCreated: boolean;
    dimensionsSet: boolean;
    brushInitialized: boolean;
  }>>;
  setHasError: (value: boolean) => void;
  setErrorMessage: (value: string) => void;
  createGrid: (canvas: FabricCanvas) => any[];
}

export const useCanvasResizing = ({
  canvasRef,
  fabricCanvasRef,
  setCanvasDimensions: setDimensions,
  setDebugInfo,
  setHasError,
  setErrorMessage,
  createGrid
}: UseCanvasResizingProps) => {
  const resizeTimeoutRef = useRef<number | null>(null);

  const updateCanvasDimensions = useCallback(() => {
    if (!canvasRef.current) {
      console.error("Canvas ref is null during dimension update");
      return;
    }
    
    const container = document.querySelector('.canvas-container');
    console.log("Container found:", !!container);
    if (!container) {
      console.error("Canvas container not found");
      setHasError(true);
      setErrorMessage("Canvas container not found");
      return;
    }
    
    const { width, height } = container.getBoundingClientRect();
    console.log("Container dimensions:", width, height);
    
    if (width <= 0 || height <= 0) {
      console.error("Invalid container dimensions:", width, height);
      return;
    }
    
    const newWidth = Math.max(width - 20, 600);
    const newHeight = Math.max(height - 20, 400);
    
    console.log(`Setting canvas dimensions to ${newWidth}x${newHeight}`);
    setDimensions({ width: newWidth, height: newHeight });
    setDebugInfo(prev => ({...prev, dimensionsSet: true}));
    
    if (fabricCanvasRef.current) {
      console.log("Updating fabric canvas dimensions");
      setCanvasDimensions(fabricCanvasRef.current, { width: newWidth, height: newHeight });
      createGrid(fabricCanvasRef.current);
      fabricCanvasRef.current.renderAll();
    } else {
      console.log("Fabric canvas ref not available for dimension update");
    }
  }, [canvasRef, fabricCanvasRef, setDimensions, setDebugInfo, setHasError, setErrorMessage, createGrid]);

  useEffect(() => {
    console.log("Setting up resize handler");
    
    const debouncedResizeHandler = () => {
      if (resizeTimeoutRef.current !== null) {
        window.clearTimeout(resizeTimeoutRef.current);
      }
      
      resizeTimeoutRef.current = window.setTimeout(() => {
        updateCanvasDimensions();
        resizeTimeoutRef.current = null;
      }, 250);
    };

    window.addEventListener('resize', debouncedResizeHandler);
    
    // Initial update of canvas dimensions
    setTimeout(updateCanvasDimensions, 100);
    
    return () => {
      window.removeEventListener('resize', debouncedResizeHandler);
      if (resizeTimeoutRef.current !== null) {
        window.clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [updateCanvasDimensions]);

  return { updateCanvasDimensions };
};
