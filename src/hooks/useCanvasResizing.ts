
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

// Global flag to track if initial resize has been done
let initialGlobalResizeComplete = false;

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
  const initialResizeCompleteRef = useRef(initialGlobalResizeComplete);
  const resizeInProgressRef = useRef(false);
  const initialResizeTimerRef = useRef<number | null>(null);
  const resizeCountRef = useRef(0);

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
    
    // Skip update if dimensions haven't changed significantly (within 50px)
    if (Math.abs(newWidth - lastDimensionsRef.current.width) < 50 && 
        Math.abs(newHeight - lastDimensionsRef.current.height) < 50) {
      resizeInProgressRef.current = false;
      return;
    }
    
    // Update the reference
    lastDimensionsRef.current = { width: newWidth, height: newHeight };
    
    // Track resize count
    resizeCountRef.current += 1;
    
    // Only log every 3rd resize to reduce console spam
    if (resizeCountRef.current % 3 === 0) {
      console.log(`Setting canvas dimensions to ${newWidth}x${newHeight}`);
    }
    
    setDimensions({ width: newWidth, height: newHeight });
    setDebugInfo(prev => ({...prev, dimensionsSet: true}));
    
    if (fabricCanvasRef.current) {
      setCanvasDimensions(fabricCanvasRef.current, { width: newWidth, height: newHeight });
      
      // Only create grid on first resize
      if (!initialResizeCompleteRef.current) {
        createGrid(fabricCanvasRef.current);
        initialResizeCompleteRef.current = true;
        initialGlobalResizeComplete = true;
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
      
      // Increase debounce time to 800ms to reduce frequency
      resizeTimeoutRef.current = window.setTimeout(() => {
        updateCanvasDimensions();
        resizeTimeoutRef.current = null;
      }, 800);
    };

    window.addEventListener('resize', debouncedResizeHandler);
    
    // Initial update with a delay to ensure DOM is ready
    // Only run this once per component lifecycle
    if (!initialResizeTimerRef.current && !initialResizeCompleteRef.current) {
      initialResizeTimerRef.current = window.setTimeout(() => {
        updateCanvasDimensions();
        initialResizeTimerRef.current = null;
      }, 800);
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
