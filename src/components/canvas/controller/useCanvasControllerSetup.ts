/**
 * Hook for setting up the canvas controller
 * @module useCanvasControllerSetup
 */
import { useEffect, useCallback } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { FloorPlan } from "@/types/floorPlanTypes";
import { DrawingState } from "@/types/drawingTypes";
import { DebugInfoState } from "@/types/debugTypes";

// Extend DebugInfoState to include canvasInitTime
declare module '@/types/debugTypes' {
  interface DebugInfoState {
    canvasInitTime?: string;
  }
}

interface UseCanvasControllerSetupProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
  isLoading: boolean;
  floorPlans: FloorPlan[];
  currentFloor: number;
  drawFloorPlan: (floorIndex: number, plans: FloorPlan[]) => void;
  saveCurrentState: () => void;
  createGrid: (canvas: FabricCanvas) => FabricObject[];
  handleError: (error: Error) => void;
  updateDebugInfo: (info: Partial<DebugInfoState>) => void;
  setDrawingState: React.Dispatch<React.SetStateAction<DrawingState | null>>;
  recalculateGIA: () => void;
  canvasRef?: React.RefObject<HTMLCanvasElement>;
}

/**
 * Hook that handles canvas controller setup
 * @returns Setup functions
 */
export const useCanvasControllerSetup = (props: UseCanvasControllerSetupProps) => {
  const {
    fabricCanvasRef,
    gridLayerRef,
    isLoading,
    floorPlans,
    currentFloor,
    drawFloorPlan,
    saveCurrentState,
    createGrid,
    handleError,
    updateDebugInfo,
    setDrawingState,
    recalculateGIA,
    canvasRef
  } = props;

  // Initialize canvas
  const initializeCanvas = useCallback((canvasElem: HTMLCanvasElement) => {
    if (!canvasElem) return;
    
    try {
      // Clean up old canvas instance if exists
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
      }
      
      // Create new fabric canvas
      const canvas = new FabricCanvas(canvasElem, {
        width: canvasElem.width || 1200,
        height: canvasElem.height || 800,
        selection: true,
        preserveObjectStacking: true
      });
      
      // Store canvas reference
      fabricCanvasRef.current = canvas;
      
      // Set initial drawing state
      setDrawingState({
        isDrawing: false,
        startPoint: null,
        currentPoint: null,
        cursorPosition: null,
        midPoint: null,
        selectionActive: false,
        currentZoom: canvas.getZoom()
      });
      
      // Create grid
      const gridLayer = createGrid(canvas);
      gridLayerRef.current = gridLayer;
      
      // Trigger GIA calculation
      setTimeout(() => {
        if (typeof recalculateGIA === 'function') {
          recalculateGIA();
        }
      }, 500);
      
      // Update debug info
      updateDebugInfo({
        canvasInitialized: true,
        canvasInitTime: new Date().toISOString()
      });
      
      // Save initial state
      saveCurrentState();
      
      return canvas;
    } catch (error) {
      handleError(error as Error);
      return null;
    }
  }, [
    fabricCanvasRef,
    gridLayerRef,
    createGrid,
    setDrawingState,
    updateDebugInfo,
    saveCurrentState,
    handleError,
    recalculateGIA
  ]);

  // Draw floor plan when data is loaded
  useEffect(() => {
    if (isLoading || !fabricCanvasRef.current || floorPlans.length === 0) return;
    
    console.log("Drawing initial floor plan");
    drawFloorPlan(currentFloor, floorPlans);
    
  }, [
    isLoading,
    fabricCanvasRef,
    floorPlans,
    currentFloor,
    drawFloorPlan
  ]);

  return {
    initializeCanvas
  };
};
