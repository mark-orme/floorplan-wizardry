
/**
 * Main canvas resizing hook
 * Manages canvas resizing with event handlers and state tracking
 * @module canvas-resizing/useCanvasResizing
 */
import { useEffect, useRef, useCallback } from "react";
import { CanvasDimensions } from "@/types/drawingTypes";
import { UseCanvasResizingProps, CanvasResizingResult } from "./types";
import { resizingState } from "./state";
import { useResizeLogic } from "./useResizeLogic";
import { throttle } from "@/utils/throttleUtils";
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
  const eventCleanupRef = useRef<(() => void) | null>(null);

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

  // Create throttled resize handler
  const throttledResizeHandler = useCallback(
    throttle(() => {
      if (!resizeInProgressRef.current) {
        updateCanvasDimensions();
      }
    }, RESIZE_DEBOUNCE_DELAY),
    [updateCanvasDimensions]
  );

  // Set up event listeners for window resize
  useEffect(() => {
    // Add event listener for resize
    window.addEventListener('resize', throttledResizeHandler);
    
    // Store cleanup function
    eventCleanupRef.current = () => {
      window.removeEventListener('resize', throttledResizeHandler);
    };
    
    // Initial update with a delay to ensure DOM is ready
    // Only run this once per component lifecycle
    if (!initialResizeTimerRef.current && !initialResizeCompleteRef.current) {
      initialResizeTimerRef.current = window.setTimeout(() => {
        updateCanvasDimensions();
        initialResizeTimerRef.current = null;
      }, INITIAL_RESIZE_DELAY);
    }
    
    return () => {
      // Remove resize event listener
      if (eventCleanupRef.current) {
        eventCleanupRef.current();
      }
      
      // Clear any pending timeouts
      if (resizeTimeoutRef.current !== null) {
        window.clearTimeout(resizeTimeoutRef.current);
        resizeTimeoutRef.current = null;
      }
      if (initialResizeTimerRef.current !== null) {
        clearTimeout(initialResizeTimerRef.current);
        initialResizeTimerRef.current = null;
      }
    };
  }, [updateCanvasDimensions, throttledResizeHandler]);

  // Cancel resize function
  const cancelResize = useCallback(() => {
    if (resizeTimeoutRef.current !== null) {
      window.clearTimeout(resizeTimeoutRef.current);
      resizeTimeoutRef.current = null;
    }
    resizeInProgressRef.current = false;
    resizingState.resizeInProgress = false;
  }, []);

  return { 
    updateCanvasDimensions,
    cancelResize
  };
};
