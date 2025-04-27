
/**
 * Hook for initializing canvas dependencies
 * @module useCanvasControllerDependencies
 */
import { useRef } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { useCanvasDependencies } from "@/hooks/canvas/useCanvasDependencies";
import { DebugInfoState } from "@/types/canvas/DebugInfoState";

/**
 * Props interface for useCanvasControllerDependencies hook
 * @interface UseCanvasControllerDependenciesProps
 */
interface UseCanvasControllerDependenciesProps {
  /** Reference to the Fabric canvas instance */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Reference to the HTML canvas element */
  canvasRef?: React.RefObject<HTMLCanvasElement>;
  /** Current canvas dimensions */
  canvasDimensions?: { width: number; height: number };
  /** Current debug info state */
  debugInfo?: DebugInfoState;
  /** Function to set debug info */
  setDebugInfo?: React.Dispatch<React.SetStateAction<DebugInfoState>>;
  /** Function to set error state */
  setHasError?: (value: boolean) => void;
  /** Function to set error message */
  setErrorMessage?: (value: string) => void;
  /** Current zoom level */
  zoomLevel?: number;
  /** Update debug info partially */
  updateDebugInfo?: (info: Partial<DebugInfoState>) => void;
}

/**
 * Hook result interface for useCanvasControllerDependencies
 * @interface UseCanvasControllerDependenciesResult
 */
interface UseCanvasControllerDependenciesResult {
  /** Reference to grid layer objects */
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
  /** Function to create grid */
  createGrid: (canvas: FabricCanvas) => FabricObject[];
}

/**
 * Hook that initializes canvas dependencies like grid, stylus detection, etc.
 * Manages integration of various canvas-related hooks and utilities
 */
export const useCanvasControllerDependencies = ({
  fabricCanvasRef,
  canvasRef,
  canvasDimensions,
  debugInfo,
  setDebugInfo,
  setHasError,
  setErrorMessage,
  zoomLevel,
  updateDebugInfo
}: UseCanvasControllerDependenciesProps): UseCanvasControllerDependenciesResult => {
  // Create default refs for any undefined props
  const defaultCanvasRef = useRef<HTMLCanvasElement>(null);
  
  // Initialize canvas dependencies (grid, stylus, zoom sync)
  const canvasDeps = useCanvasDependencies({
    canvasRef: canvasRef || defaultCanvasRef
  });
  
  // Extract the grid layer ref and create grid function
  const { gridLayerRef, createGrid } = canvasDeps;
  
  return {
    gridLayerRef,
    createGrid
  };
};
