
/**
 * Hook for initializing canvas dependencies
 * @module useCanvasControllerDependencies
 */
import { useRef } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { useCanvasDependencies } from "@/hooks/useCanvasDependencies";
import { DebugInfoState } from "@/types/debugTypes";

/**
 * Props interface for useCanvasControllerDependencies hook
 * @interface UseCanvasControllerDependenciesProps
 */
interface UseCanvasControllerDependenciesProps {
  /** Reference to the fabric canvas instance */
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
 * 
 * @param {UseCanvasControllerDependenciesProps} props - Hook properties
 * @returns {UseCanvasControllerDependenciesResult} Grid reference and creation function
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
  const defaultGridLayerRef = useRef<FabricObject[]>([]);
  
  // Provide fallback values for required props
  const resolvedCanvasRef = canvasRef || defaultCanvasRef;
  const resolvedCanvasDimensions = canvasDimensions || { width: 800, height: 600 };
  // Fixed: Include all required properties in the default debug info
  const resolvedDebugInfo = debugInfo || { 
    canvasInitialized: false, 
    gridCreated: false,
    dimensionsSet: false,
    brushInitialized: false 
  };
  const resolvedSetDebugInfo = setDebugInfo || ((_: any) => {});
  const resolvedSetHasError = setHasError || ((_: boolean) => {});
  const resolvedSetErrorMessage = setErrorMessage || ((_: string) => {});
  const resolvedZoomLevel = zoomLevel || 1;
  
  // Initialize canvas dependencies (grid, stylus, zoom sync)
  const { gridLayerRef, createGrid } = useCanvasDependencies({
    fabricCanvasRef,
    canvasRef: resolvedCanvasRef,
    canvasDimensions: resolvedCanvasDimensions,
    debugInfo: resolvedDebugInfo,
    setDebugInfo: resolvedSetDebugInfo,
    setHasError: resolvedSetHasError,
    setErrorMessage: resolvedSetErrorMessage,
    zoomLevel: resolvedZoomLevel
  });
  
  return {
    gridLayerRef: gridLayerRef || defaultGridLayerRef,
    createGrid
  };
};
