
import { useEffect, useRef, useCallback } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { setCanvasDimensions } from "@/utils/fabricCanvas";

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
// Global flag to track if a resize is in progress
let globalResizeInProgress = false;
// Minimum time between resizes (in milliseconds)
const MIN_RESIZE_INTERVAL = 2000;
// Time of last resize
let lastResizeTime = 0;

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
  const resizeInProgressRef = useRef(globalResizeInProgress);
  const initialResizeTimerRef = useRef<number | null>(null);
  const resizeCountRef = useRef(0);
  const lastResizeTimeRef = useRef(lastResizeTime);

  const updateCanvasDimensions = useCallback(() => {
    if (!canvasRef.current) {
      return;
    }
    
    // Prevent concurrent resize operations
    if (resizeInProgressRef.current) {
      return;
    }
    
    // Apply strict time-based throttling (one resize per 2 seconds maximum)
    const now = Date.now();
    if (now - lastResizeTimeRef.current < MIN_RESIZE_INTERVAL) {
      return;
    }
    
    resizeInProgressRef.current = true;
    globalResizeInProgress = true;
    lastResizeTimeRef.current = now;
    lastResizeTime = now;
    
    const container = document.querySelector('.canvas-container');
    if (!container) {
      setHasError(true);
      setErrorMessage("Canvas container not found");
      resizeInProgressRef.current = false;
      globalResizeInProgress = false;
      return;
    }
    
    const { width, height } = container.getBoundingClientRect();
    
    if (width <= 0 || height <= 0) {
      resizeInProgressRef.current = false;
      globalResizeInProgress = false;
      return;
    }
    
    const newWidth = Math.max(width - 20, 600);
    const newHeight = Math.max(height - 20, 400);
    
    // Skip update if dimensions haven't changed significantly (within 80px)
    if (Math.abs(newWidth - lastDimensionsRef.current.width) < 80 && 
        Math.abs(newHeight - lastDimensionsRef.current.height) < 80) {
      resizeInProgressRef.current = false;
      globalResizeInProgress = false;
      return;
    }
    
    // Update the reference
    lastDimensionsRef.current = { width: newWidth, height: newHeight };
    
    // Track resize count
    resizeCountRef.current += 1;
    
    // Only log first resize and every 5th resize to reduce console spam
    if (resizeCountRef.current === 1 || resizeCountRef.current % 5 === 0) {
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
    
    // Wait a short time before allowing another resize
    setTimeout(() => {
      resizeInProgressRef.current = false;
      globalResizeInProgress = false;
    }, 100);
  }, [canvasRef, fabricCanvasRef, setDimensions, setDebugInfo, setHasError, setErrorMessage, createGrid]);

  useEffect(() => {
    const debouncedResizeHandler = () => {
      if (resizeTimeoutRef.current !== null) {
        window.clearTimeout(resizeTimeoutRef.current);
      }
      
      // Increase debounce time to 1500ms to reduce frequency
      resizeTimeoutRef.current = window.setTimeout(() => {
        updateCanvasDimensions();
        resizeTimeoutRef.current = null;
      }, 1500);
    };

    window.addEventListener('resize', debouncedResizeHandler);
    
    // Initial update with a delay to ensure DOM is ready
    // Only run this once per component lifecycle
    if (!initialResizeTimerRef.current && !initialResizeCompleteRef.current) {
      initialResizeTimerRef.current = window.setTimeout(() => {
        updateCanvasDimensions();
        initialResizeTimerRef.current = null;
      }, 1000);
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
