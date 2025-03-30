
/**
 * useCanvasInitialization hook
 * Core hook for canvas initialization and setup
 * @module hooks/canvas-initialization/useCanvasInitialization
 */
import { useRef, useCallback } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { DrawingTool } from "../useCanvasState";
import { DebugInfoState } from "@/types/drawingTypes";
import { createBasicEmergencyGrid } from "@/utils/gridCreationUtils";

/**
 * Props for the useCanvasInitialization hook
 */
interface UseCanvasInitializationProps {
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

/**
 * Result of the useCanvasInitialization hook
 */
interface UseCanvasInitializationResult {
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
 * Hook for initializing and setting up the canvas
 * @param {UseCanvasInitializationProps} props - Hook properties
 * @returns {UseCanvasInitializationResult} Canvas initialization result
 */
export const useCanvasInitialization = (
  props: UseCanvasInitializationProps
): UseCanvasInitializationResult => {
  // Create refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const gridLayerRef = useRef<FabricObject[]>([]);
  const historyRef = useRef<{past: FabricObject[][], future: FabricObject[][]}>({
    past: [],
    future: []
  });
  
  // Function to initialize grid
  const initializeGrid = useCallback((canvas: FabricCanvas): FabricObject[] => {
    try {
      // Use provided grid creation function or fallback
      const createGridFn = props.createGrid || createBasicEmergencyGrid;
      
      // Create grid
      const gridObjects = createGridFn(canvas);
      
      // Store grid objects in ref
      gridLayerRef.current = gridObjects;
      
      // Update debug info
      props.setDebugInfo(prev => ({
        ...prev,
        gridCreated: true,
        gridObjectCount: gridObjects.length
      }));
      
      return gridObjects;
    } catch (error) {
      console.error("Error initializing grid:", error);
      props.setHasError(true);
      props.setErrorMessage("Error initializing grid");
      
      // Try emergency grid as fallback
      try {
        const emergencyGrid = createBasicEmergencyGrid(canvas);
        gridLayerRef.current = emergencyGrid;
        return emergencyGrid;
      } catch (fallbackError) {
        console.error("Emergency grid creation also failed:", fallbackError);
        return [];
      }
    }
  }, [props]);
  
  // Function to delete selected objects
  const deleteSelectedObjects = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    const activeObjects = canvas.getActiveObjects();
    if (activeObjects.length === 0) return;
    
    canvas.remove(...activeObjects);
    canvas.discardActiveObject();
    canvas.requestRenderAll();
  }, []);
  
  // Function to recalculate GIA (Gross Internal Area)
  const recalculateGIA = useCallback(() => {
    // Implementation would calculate area based on closed shapes
    console.log("Recalculating GIA");
  }, []);
  
  return {
    canvasRef,
    fabricCanvasRef,
    gridLayerRef,
    historyRef,
    deleteSelectedObjects,
    recalculateGIA
  };
};
