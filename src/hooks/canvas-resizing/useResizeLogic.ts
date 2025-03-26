
/**
 * Canvas resize logic hook
 * Handles the core resize functionality
 * @module canvas-resizing/useResizeLogic
 */
import { useCallback } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { setCanvasDimensions } from "@/utils/fabric";
import { CanvasDimensions, DebugInfoState } from "@/types/drawingTypes";
import { resizingState } from "./state";
import {
  MIN_RESIZE_INTERVAL,
  HORIZONTAL_PADDING,
  VERTICAL_PADDING,
  MIN_WIDTH,
  MIN_HEIGHT,
  DIMENSION_TOLERANCE,
  RESIZE_COOLDOWN
} from "./constants";

/**
 * Hook that provides the core canvas resizing logic
 * 
 * @param params - Parameters for the resize logic
 * @returns The updateCanvasDimensions function
 */
export const useResizeLogic = ({
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
}: {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  setDimensions: React.Dispatch<React.SetStateAction<CanvasDimensions>>;
  setDebugInfo: React.Dispatch<React.SetStateAction<DebugInfoState>>;
  setHasError: (value: boolean) => void;
  setErrorMessage: (value: string) => void;
  createGrid: (canvas: FabricCanvas) => any[];
  lastDimensionsRef: React.MutableRefObject<CanvasDimensions>;
  initialResizeCompleteRef: React.MutableRefObject<boolean>;
  resizeInProgressRef: React.MutableRefObject<boolean>;
  lastResizeTimeRef: React.MutableRefObject<number>;
  resizeCountRef: React.MutableRefObject<number>;
}) => {
  /**
   * Update canvas dimensions based on container size
   * Handles all the canvas resizing logic
   */
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
    if (now - lastResizeTimeRef.current < MIN_RESIZE_INTERVAL) {
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
    
    const newWidth = Math.max(width - HORIZONTAL_PADDING, MIN_WIDTH);
    const newHeight = Math.max(height - VERTICAL_PADDING, MIN_HEIGHT);
    
    // Skip update if dimensions haven't changed significantly (within tolerance)
    if (Math.abs(newWidth - lastDimensionsRef.current.width) < DIMENSION_TOLERANCE && 
        Math.abs(newHeight - lastDimensionsRef.current.height) < DIMENSION_TOLERANCE) {
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
    }, RESIZE_COOLDOWN);
  }, [
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
  ]);

  return { updateCanvasDimensions };
};
