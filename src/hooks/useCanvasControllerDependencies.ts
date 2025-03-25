
/**
 * Hook for initializing canvas dependencies
 * @module useCanvasControllerDependencies
 */
import { useRef } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { useCanvasDependencies } from "@/hooks/useCanvasDependencies";
import { DebugInfoState } from "@/types/drawingTypes";

/**
 * Props interface for useCanvasControllerDependencies hook
 * @interface UseCanvasControllerDependenciesProps
 */
interface UseCanvasControllerDependenciesProps {
  /** Reference to the fabric canvas */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Reference to the HTML canvas element */
  canvasRef: React.RefObject<HTMLCanvasElement>;
  /** Current canvas dimensions */
  canvasDimensions: { width: number; height: number };
  /** Current debug info state */
  debugInfo: DebugInfoState;
  /** Function to set debug info */
  setDebugInfo: React.Dispatch<React.SetStateAction<DebugInfoState>>;
  /** Function to set error state */
  setHasError: (value: boolean) => void;
  /** Function to set error message */
  setErrorMessage: (value: string) => void;
  /** Current zoom level */
  zoomLevel: number;
}

/**
 * Hook that initializes canvas dependencies like grid, stylus detection, etc.
 * Manages integration of various canvas-related hooks and utilities
 * 
 * @param {UseCanvasControllerDependenciesProps} props - Hook properties
 * @returns {Object} Grid reference and creation function
 */
export const useCanvasControllerDependencies = ({
  fabricCanvasRef,
  canvasRef,
  canvasDimensions,
  debugInfo,
  setDebugInfo,
  setHasError,
  setErrorMessage,
  zoomLevel
}: UseCanvasControllerDependenciesProps) => {
  // Initialize canvas dependencies (grid, stylus, zoom sync)
  const { gridLayerRef, createGrid } = useCanvasDependencies({
    fabricCanvasRef,
    canvasRef,
    canvasDimensions,
    debugInfo,
    setDebugInfo,
    setHasError,
    setErrorMessage,
    zoomLevel
  });
  
  return {
    gridLayerRef,
    createGrid
  };
};
