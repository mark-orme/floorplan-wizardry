
/**
 * Canvas initialization module
 * Re-exports initialization hooks and utilities
 * @module canvas-initialization
 */

import { useRef } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { DrawingTool } from "@/types/canvasStateTypes";
import { DebugInfoState } from "@/types/drawingTypes";

// Added createGrid to the props interface
export interface UseCanvasInitializationProps {
  /** Canvas dimensions */
  canvasDimensions: { width: number; height: number };
  /** Current active drawing tool */
  tool: DrawingTool;
  /** Current floor index */
  currentFloor: number;
  /** Function to set zoom level */
  setZoomLevel: (zoom: number) => void;
  /** Function to set debug info */
  setDebugInfo: React.Dispatch<React.SetStateAction<DebugInfoState>>;
  /** Function to set error state */
  setHasError: (value: boolean) => void;
  /** Function to set error message */
  setErrorMessage: (value: string) => void;
  /** Optional function to create grid on canvas */
  createGrid?: (canvas: FabricCanvas) => FabricObject[];
}

export interface UseCanvasInitializationResult {
  /** Reference to the HTML canvas element */
  canvasRef: React.RefObject<HTMLCanvasElement>;
  /** Reference to the Fabric canvas instance */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Reference to grid layer objects */
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
  /** Reference to history state for undo/redo */
  historyRef: React.MutableRefObject<{past: FabricObject[][], future: FabricObject[][]}>;
  /** Function to delete selected objects */
  deleteSelectedObjects: () => void;
  /** Function to recalculate gross internal area */
  recalculateGIA: () => void;
}

/**
 * Hook for canvas initialization
 * Sets up the canvas, grid, and history tracking
 */
export const useCanvasInitialization = (
  props: UseCanvasInitializationProps
): UseCanvasInitializationResult => {
  // Return mock objects for now, replace with actual implementation
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const gridLayerRef = useRef<FabricObject[]>([]);
  const historyRef = useRef<{past: FabricObject[][], future: FabricObject[][]}>({
    past: [],
    future: []
  });
  
  const deleteSelectedObjects = () => {
    // Implement deletion logic
  };
  
  const recalculateGIA = () => {
    // Implement GIA recalculation
  };
  
  return {
    canvasRef,
    fabricCanvasRef,
    gridLayerRef,
    historyRef,
    deleteSelectedObjects,
    recalculateGIA
  };
};
