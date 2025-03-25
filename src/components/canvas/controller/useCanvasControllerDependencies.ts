
/**
 * Hook for initializing canvas dependencies
 * @module useCanvasControllerDependencies
 */
import { useRef } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { useCanvasDependencies } from "@/hooks/useCanvasDependencies";
import { DebugInfoState } from "@/types/drawingTypes";

interface UseCanvasControllerDependenciesProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  canvasDimensions: { width: number; height: number };
  debugInfo: DebugInfoState;
  setDebugInfo: React.Dispatch<React.SetStateAction<DebugInfoState>>;
  setHasError: (value: boolean) => void;
  setErrorMessage: (value: string) => void;
  zoomLevel: number;
}

/**
 * Hook that initializes canvas dependencies like grid, stylus detection, etc.
 * @returns Grid reference and creation function
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
