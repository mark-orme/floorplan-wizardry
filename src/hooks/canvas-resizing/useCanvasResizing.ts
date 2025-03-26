
/**
 * Main canvas resizing hook
 * Manages canvas resizing with event handlers and state tracking
 * @module canvas-resizing/useCanvasResizing
 */
import { useEffect, useRef } from "react";
import { CanvasDimensions } from "@/types/drawingTypes";
import { UseCanvasResizingProps, CanvasResizingResult } from "./types";
import { resizingState } from "./state";
import { useResizeLogic } from "./useResizeLogic";
import {
  RESIZE_DEBOUNCE_DELAY,
  INITIAL_RESIZE_DELAY
} from "./constants";

/**
 * Hook for handling canvas resizing operations
 * Manages window resize events and initial sizing
 * 
 * @param props - Canvas resizing properties
 * @returns Object with updateCanvasDimensions function
 */
export const useCanvasResizing = ({
  canvasRef,
  fabricCanvasRef,
  setCanvasDimensions: setDimensions,
  setDebugInfo,
  setHasError,
  setErrorMessage,
  createGrid
}: UseCanvasResizingProps): CanvasResizingResult => {
  const resizeTimeoutRef = useRef<number | null>(null);
  const lastDimensionsRef = useRef<CanvasDimensions>({width: 0, height: 0});
  const initialResizeCompleteRef = useRef<boolean>(resizingState.initialResizeComplete);
  const resizeInProgressRef = useRef<boolean>(resizingState.resizeInProgress);
  const initialResizeTimerRef = useRef<number | null>(null);
  const resizeCountRef = useRef<number>(0);
  const lastResizeTimeRef = useRef<number>(resizingState.lastResizeTime);

  // Use the resize logic hook
  const { updateCanvasDimensions } = useResizeLogic({
    canvasRef,
    fabricCanvasRef,
    setDimensions,
    setDebugInfo,
    setHasError,
    setErrorMessage,
    createGrid,
    lastDimensionsRef,
    initialResizeCompleteRef,
    resizeInProgressRef,
    lastResizeTimeRef,
    resizeCountRef
  });

  // Set up event listeners for window resize
  useEffect(() => {
    const debouncedResizeHandler = () => {
      if (resizeTimeoutRef.current !== null) {
        window.clearTimeout(resizeTimeoutRef.current);
      }
      
      resizeTimeoutRef.current = window.setTimeout(() => {
        updateCanvasDimensions();
        resizeTimeoutRef.current = null;
      }, RESIZE_DEBOUNCE_DELAY);
    };

    window.addEventListener('resize', debouncedResizeHandler);
    
    // Initial update with a delay to ensure DOM is ready
    // Only run this once per component lifecycle
    if (!initialResizeTimerRef.current && !initialResizeCompleteRef.current) {
      initialResizeTimerRef.current = window.setTimeout(() => {
        updateCanvasDimensions();
        initialResizeTimerRef.current = null;
      }, INITIAL_RESIZE_DELAY);
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
