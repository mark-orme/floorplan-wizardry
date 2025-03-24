
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
  const resizeInProgressRef = useRef(false);
  const initialResizeTimerRef = useRef<number | null>(null);

  const updateCanvasDimensions = useCallback(() => {
    if (!canvasRef.current) {
      return;
    }
    
    // Prevent concurrent resize operations
    if (resizeInProgressRef.current) {
      return;
    }
    
    resizeInProgressRef.current = true;
    
    const container = document.querySelector('.canvas-container');
    if (!container) {
      setHasError(true);
      setErrorMessage("Canvas container not found");
      resizeInProgressRef.current = false;
      return;
    }
    
    const { width, height } = container.getBoundingClientRect();
    
    if (width <= 0 || height <= 0) {
      resizeInProgressRef.current = false;
      return;
    }
    
    const newWidth = Math.max(width - 20, 600);
    const newHeight = Math.max(height - 20, 400);
    
    // Skip update if dimensions haven't changed significantly (within 30px)
    if (Math.abs(newWidth - lastDimensionsRef.current.width) < 30 && 
        Math.abs(newHeight - lastDimensionsRef.current.height) < 30) {
      resizeInProgressRef.current = false;
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
    
    resizeInProgressRef.current = false;
  }, [canvasRef, fabricCanvasRef, setDimensions, setDebugInfo, setHasError, setErrorMessage, createGrid]);

  useEffect(() => {
    const debouncedResizeHandler = () => {
      if (resizeTimeoutRef.current !== null) {
        window.clearTimeout(resizeTimeoutRef.current);
      }
      
      // Increase debounce time to 500ms to reduce frequency
      resizeTimeoutRef.current = window.setTimeout(() => {
        updateCanvasDimensions();
        resizeTimeoutRef.current = null;
      }, 500);
    };

    window.addEventListener('resize', debouncedResizeHandler);
    
    // Initial update with a delay to ensure DOM is ready
    // Only run this once per component lifecycle
    if (!initialResizeTimerRef.current) {
      initialResizeTimerRef.current = window.setTimeout(() => {
        updateCanvasDimensions();
        initialResizeTimerRef.current = null;
      }, 500);
    }
    
    return () => {
      window.removeEventListener('resize', debouncedResizeHandler);
      if (resizeTimeoutRef.current !== null) {
        window.clearTimeout(resizeTimeoutRef.current);
      }
      if (initialResizeTimerRef.current !== null) {
        clearTimeout(initialResizeTimerRef.current);
        initialResizeTimerRef.current = null;
      }
    };
  }, [updateCanvasDimensions]);

  return { updateCanvasDimensions };
};
