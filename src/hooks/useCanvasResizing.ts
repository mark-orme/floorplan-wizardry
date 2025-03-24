import { useEffect, useRef, useCallback } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { setCanvasDimensions } from "@/utils/fabric";

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
  const lastDimensionsRef = useRef<{width: number, height: number}>({width: 0, height: 0});
  const initialResizeCompleteRef = useRef(false);

  const updateCanvasDimensions = useCallback(() => {
    if (!canvasRef.current) {
      return;
    }
    
    const container = document.querySelector('.canvas-container');
    if (!container) {
      setHasError(true);
      setErrorMessage("Canvas container not found");
      return;
    }
    
    const { width, height } = container.getBoundingClientRect();
    
    if (width <= 0 || height <= 0) {
      return;
    }
    
    const newWidth = Math.max(width - 20, 600);
    const newHeight = Math.max(height - 20, 400);
    
    // Skip update if dimensions haven't changed significantly (within 5px)
    if (Math.abs(newWidth - lastDimensionsRef.current.width) < 5 && 
        Math.abs(newHeight - lastDimensionsRef.current.height) < 5) {
      return;
    }
    
    // Update the reference
    lastDimensionsRef.current = { width: newWidth, height: newHeight };
    
    // Only log on significant changes
    console.log(`Setting canvas dimensions to ${newWidth}x${newHeight}`);
    setDimensions({ width: newWidth, height: newHeight });
    setDebugInfo(prev => ({...prev, dimensionsSet: true}));
    
    if (fabricCanvasRef.current) {
      setCanvasDimensions(fabricCanvasRef.current, { width: newWidth, height: newHeight });
      
      // Only create grid on first resize or when explicitly needed
      if (!initialResizeCompleteRef.current) {
        createGrid(fabricCanvasRef.current);
        initialResizeCompleteRef.current = true;
      }
      
      fabricCanvasRef.current.renderAll();
    }
  }, [canvasRef, fabricCanvasRef, setDimensions, setDebugInfo, setHasError, setErrorMessage, createGrid]);

  useEffect(() => {
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
    
    // Initial update with a delay to ensure DOM is ready
    const initialTimer = setTimeout(updateCanvasDimensions, 300);
    
    return () => {
      window.removeEventListener('resize', debouncedResizeHandler);
      if (resizeTimeoutRef.current !== null) {
        window.clearTimeout(resizeTimeoutRef.current);
      }
      clearTimeout(initialTimer);
    };
  }, [updateCanvasDimensions]);

  return { updateCanvasDimensions };
};
