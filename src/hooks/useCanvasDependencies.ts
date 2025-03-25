
/**
 * Custom hook for integrating canvas dependency hooks
 * @module useCanvasDependencies
 */
import { useEffect, useRef } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { useCanvasGrid } from "./useCanvasGrid";
import { useGridManagement } from "./useGridManagement";
import { useStylusDetection } from "./useStylusDetection";
import { useZoomStateSync } from "./useZoomStateSync";
import { DebugInfoState } from "@/types/drawingTypes";
import logger from "@/utils/logger";

/**
 * Props interface for useCanvasDependencies hook
 * @interface UseCanvasDependenciesProps
 */
interface UseCanvasDependenciesProps {
  /** Reference to the fabric canvas */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Reference to the HTML canvas element */
  canvasRef: React.RefObject<HTMLCanvasElement>;
  /** Current canvas dimensions */
  canvasDimensions: { width: number, height: number };
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
 * Hook that integrates all canvas dependency hooks
 * Manages grid, stylus detection, and zoom synchronization
 * 
 * @param {UseCanvasDependenciesProps} props - Hook properties
 * @returns {Object} Grid reference and creation function
 */
export const useCanvasDependencies = (props: UseCanvasDependenciesProps) => {
  const {
    fabricCanvasRef,
    canvasRef,
    canvasDimensions,
    debugInfo,
    setDebugInfo,
    setHasError,
    setErrorMessage,
    zoomLevel
  } = props;
  
  // Initialize gridLayerRef first before passing it to other hooks
  const gridLayerRef = useRef<FabricObject[]>([]);
  
  // Create grid management
  const createGrid = useCanvasGrid({
    gridLayerRef,
    canvasDimensions,
    setDebugInfo,
    setHasError,
    setErrorMessage
  });
  
  // Initialize grid management
  const { gridLayerRef: managedGridLayerRef } = useGridManagement({
    fabricCanvasRef,
    canvasDimensions,
    debugInfo,
    createGrid
  });
  
  // Initialize stylus detection
  useStylusDetection({
    canvasRef,
    debugInfo
  });
  
  // Initialize zoom state synchronization
  useZoomStateSync({
    fabricCanvasRef,
    zoomLevel
  });
  
  // Sync the gridLayerRef with managedGridLayerRef
  useEffect(() => {
    if (managedGridLayerRef.current && managedGridLayerRef.current.length > 0) {
      gridLayerRef.current = managedGridLayerRef.current;
    }
  }, [managedGridLayerRef.current]);
  
  return {
    gridLayerRef,
    createGrid
  };
};
