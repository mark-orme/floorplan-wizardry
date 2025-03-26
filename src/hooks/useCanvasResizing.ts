
/**
 * Custom hook for handling canvas resizing
 * @module useCanvasResizing
 */
import { useEffect, useRef, useCallback } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { setCanvasDimensions } from "@/utils/fabric";
import { CANVAS_DIMENSIONS } from "@/utils/fabric/canvasDimensions";
import { CanvasDimensions, DebugInfoState } from "@/types/drawingTypes";

interface UseCanvasResizingProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  setCanvasDimensions: React.Dispatch<React.SetStateAction<CanvasDimensions>>;
  setDebugInfo: React.Dispatch<React.SetStateAction<DebugInfoState>>;
  setHasError: (value: boolean) => void;
  setErrorMessage: (value: string) => void;
  createGrid: (canvas: FabricCanvas) => FabricObject[];
}

interface ResizingState {
  initialResizeComplete: boolean;
  resizeInProgress: boolean;
  lastResizeTime: number;
}

/**
 * Canvas resizing constants
 */
const RESIZING_CONSTANTS = {
  /**
   * Minimum time between resize operations in milliseconds
   * Prevents too frequent resizing operations
   * @constant {number}
   */
  MIN_RESIZE_INTERVAL: 2000,
  
  /**
   * Horizontal padding in pixels for canvas width calculation
   * @constant {number}
   */
  HORIZONTAL_PADDING: 20,
  
  /**
   * Vertical padding in pixels for canvas height calculation
   * @constant {number}
   */
  VERTICAL_PADDING: 20,
  
  /**
   * Minimum width of the canvas in pixels
   * @constant {number}
   */
  MIN_WIDTH: 600,
  
  /**
   * Minimum height of the canvas in pixels
   * @constant {number}
   */
  MIN_HEIGHT: 400,
  
  /**
   * Dimension change tolerance in pixels
   * Resize is only performed if dimensions change by more than this value
   * @constant {number}
   */
  DIMENSION_TOLERANCE: 5,
  
  /**
   * Debounce delay for window resize events in milliseconds
   * @constant {number}
   */
  RESIZE_DEBOUNCE_DELAY: 1500,
  
  /**
   * Initial resize delay in milliseconds
   * @constant {number}
   */
  INITIAL_RESIZE_DELAY: 1000,
  
  /**
   * Cool-down period after resize in milliseconds
   * @constant {number}
   */
  RESIZE_COOLDOWN: 100
};

// Use module-level object instead of loose variables
const resizingState: ResizingState = {
  initialResizeComplete: false,
  resizeInProgress: false,
  lastResizeTime: 0
};

export const useCanvasResizing = ({
  canvasRef,
  fabricCanvasRef,
  setCanvasDimensions: setDimensions,
  setDebugInfo,
  setHasError,
  setErrorMessage,
  createGrid
}: UseCanvasResizingProps): { updateCanvasDimensions: () => void } => {
  const resizeTimeoutRef = useRef<number | null>(null);
  const lastDimensionsRef = useRef<CanvasDimensions>({width: 0, height: 0});
  const initialResizeCompleteRef = useRef<boolean>(resizingState.initialResizeComplete);
  const resizeInProgressRef = useRef<boolean>(resizingState.resizeInProgress);
  const initialResizeTimerRef = useRef<number | null>(null);
  const resizeCountRef = useRef<number>(0);
  const lastResizeTimeRef = useRef<number>(resizingState.lastResizeTime);

  const updateCanvasDimensions = useCallback((): void => {
    if (!canvasRef.current) {
      return;
    }
    
    // Prevent concurrent resize operations
    if (resizeInProgressRef.current) {
      return;
    }
    
    // Apply strict time-based throttling
    const now = Date.now();
    if (now - lastResizeTimeRef.current < RESIZING_CONSTANTS.MIN_RESIZE_INTERVAL) {
      return;
    }
    
    resizeInProgressRef.current = true;
    resizingState.resizeInProgress = true;
    lastResizeTimeRef.current = now;
    resizingState.lastResizeTime = now;
    
    // Get container dimensions using ref instead of direct DOM query
    const container = canvasRef.current.closest('.canvas-container');
    if (!container) {
      setHasError(true);
      setErrorMessage("Canvas container not found");
      resizeInProgressRef.current = false;
      resizingState.resizeInProgress = false;
      return;
    }
    
    const { width, height } = container.getBoundingClientRect();
    
    if (width <= 0 || height <= 0) {
      resizeInProgressRef.current = false;
      resizingState.resizeInProgress = false;
      return;
    }
    
    const newWidth = Math.max(width - RESIZING_CONSTANTS.HORIZONTAL_PADDING, RESIZING_CONSTANTS.MIN_WIDTH);
    const newHeight = Math.max(height - RESIZING_CONSTANTS.VERTICAL_PADDING, RESIZING_CONSTANTS.MIN_HEIGHT);
    
    // Skip update if dimensions haven't changed significantly (within tolerance)
    if (Math.abs(newWidth - lastDimensionsRef.current.width) < RESIZING_CONSTANTS.DIMENSION_TOLERANCE && 
        Math.abs(newHeight - lastDimensionsRef.current.height) < RESIZING_CONSTANTS.DIMENSION_TOLERANCE) {
      resizeInProgressRef.current = false;
      resizingState.resizeInProgress = false;
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
      // Updated to use three arguments instead of two
      setCanvasDimensions(fabricCanvasRef.current, newWidth, newHeight);
      
      // Only create grid on first resize
      if (!initialResizeCompleteRef.current) {
        createGrid(fabricCanvasRef.current);
        initialResizeCompleteRef.current = true;
        resizingState.initialResizeComplete = true;
      }
      
      fabricCanvasRef.current.renderAll();
    }
    
    // Wait a short time before allowing another resize
    setTimeout(() => {
      resizeInProgressRef.current = false;
      resizingState.resizeInProgress = false;
    }, RESIZING_CONSTANTS.RESIZE_COOLDOWN);
  }, [canvasRef, fabricCanvasRef, setDimensions, setDebugInfo, setHasError, setErrorMessage, createGrid]);

  useEffect(() => {
    const debouncedResizeHandler = () => {
      if (resizeTimeoutRef.current !== null) {
        window.clearTimeout(resizeTimeoutRef.current);
      }
      
      // Use constant instead of hardcoded value
      resizeTimeoutRef.current = window.setTimeout(() => {
        updateCanvasDimensions();
        resizeTimeoutRef.current = null;
      }, RESIZING_CONSTANTS.RESIZE_DEBOUNCE_DELAY);
    };

    window.addEventListener('resize', debouncedResizeHandler);
    
    // Initial update with a delay to ensure DOM is ready
    // Only run this once per component lifecycle
    if (!initialResizeTimerRef.current && !initialResizeCompleteRef.current) {
      initialResizeTimerRef.current = window.setTimeout(() => {
        updateCanvasDimensions();
        initialResizeTimerRef.current = null;
      }, RESIZING_CONSTANTS.INITIAL_RESIZE_DELAY);
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
