
/**
 * Custom hook for handling canvas drawing operations
 * Manages drawing events, path creation, and shape processing
 * @module useCanvasDrawing
 */
import { useEffect, useState, useRef, useCallback } from "react";
import { Canvas as FabricCanvas, Object as FabricObject, Polyline as FabricPolyline } from "fabric";
import { usePathProcessing } from "./usePathProcessing";
import { useDrawingState } from "./useDrawingState";
import { useCanvasHistory } from "./useCanvasHistory";
import { useCanvasEventHandlers } from "./useCanvasEventHandlers";
import { type FloorPlan } from "@/types/floorPlanTypes";
import { DrawingTool } from "./useCanvasState";
import { type DrawingState } from "@/types/drawingTypes";

interface HistoryRef {
  past: FabricObject[][];
  future: FabricObject[][];
}

interface UseCanvasDrawingProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
  historyRef: React.MutableRefObject<HistoryRef>;
  tool: DrawingTool;
  currentFloor: number;
  setFloorPlans: React.Dispatch<React.SetStateAction<FloorPlan[]>>;
  setGia: React.Dispatch<React.SetStateAction<number>>;
  lineThickness?: number;
  lineColor?: string;
  deleteSelectedObjects?: () => void;
  recalculateGIA?: () => void;
}

interface UseCanvasDrawingResult {
  drawingState: DrawingState;
}

/**
 * Hook for handling all drawing-related operations on the canvas
 * @param {UseCanvasDrawingProps} props - Hook properties
 * @returns {UseCanvasDrawingResult} Drawing state and handlers
 */
export const useCanvasDrawing = (props: UseCanvasDrawingProps): UseCanvasDrawingResult => {
  const {
    fabricCanvasRef,
    gridLayerRef,
    historyRef,
    tool,
    currentFloor,
    setFloorPlans,
    setGia,
    lineThickness = 2,
    lineColor = "#000000",
    deleteSelectedObjects = () => {},
    recalculateGIA
  } = props;
  
  // Track current zoom level for proper tooltip positioning
  const [currentZoom, setCurrentZoom] = useState<number>(1);
  
  // Use the improved history management hook
  const { saveCurrentState, handleUndo, handleRedo } = useCanvasHistory({
    fabricCanvasRef,
    gridLayerRef,
    historyRef,
    recalculateGIA: () => {
      if (process.env.NODE_ENV === 'development') {
        console.log("Recalculating GIA after history operation");
      }
      if (recalculateGIA && typeof recalculateGIA === 'function') {
        recalculateGIA();
      }
    }
  });
  
  const { processCreatedPath } = usePathProcessing({
    fabricCanvasRef,
    gridLayerRef,
    historyRef,
    tool,
    currentFloor,
    setFloorPlans,
    setGia,
    lineThickness,
    lineColor,
    recalculateGIA
  });
  
  const {
    drawingState,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    cleanupTimeouts
  } = useDrawingState({ 
    fabricCanvasRef,
    tool
  });
  
  // Set up all event handlers using the dedicated hook
  const { registerZoomTracking } = useCanvasEventHandlers({
    fabricCanvasRef,
    tool,
    lineColor,
    lineThickness,
    saveCurrentState,
    handleUndo,
    handleRedo,
    handleMouseDown,
    handleMouseMove,
    // Fix for TS2322 error: Making sure handleMouseUp accepts Event parameter
    handleMouseUp: (e: Event) => handleMouseUp(e),
    processCreatedPath,
    cleanupTimeouts,
    deleteSelectedObjects
  });
  
  // Add event listener to trigger GIA calculation when objects change
  useEffect(() => {
    if (!fabricCanvasRef.current || !recalculateGIA) return;
    
    const canvas = fabricCanvasRef.current;
    
    // Update GIA when objects are added, removed or modified
    const handleObjectChange = () => {
      if (recalculateGIA && typeof recalculateGIA === 'function') {
        recalculateGIA();
      }
    };
    
    canvas.on('object:added', handleObjectChange);
    canvas.on('object:removed', handleObjectChange);
    canvas.on('object:modified', handleObjectChange);
    
    return () => {
      canvas.off('object:added', handleObjectChange);
      canvas.off('object:removed', handleObjectChange);
      canvas.off('object:modified', handleObjectChange);
    };
  }, [fabricCanvasRef, recalculateGIA]);
  
  // Update zoom level whenever canvas changes - with stabilized dependencies
  useEffect(() => {
    const updateZoomLevel = () => {
      if (fabricCanvasRef.current) {
        const zoom = fabricCanvasRef.current.getZoom();
        setCurrentZoom(zoom);
      }
    };
    
    // Initial update
    updateZoomLevel();
    
    // Set up listeners for zoom changes
    const fabricCanvas = fabricCanvasRef.current;
    if (fabricCanvas) {
      // Listen for both standard zoom events and our custom event
      fabricCanvas.on('zoom:changed', updateZoomLevel as (e: unknown) => void);
      fabricCanvas.on('custom:zoom-changed', updateZoomLevel);
      
      // Also update on viewport transform changes
      fabricCanvas.on('viewport:transform', updateZoomLevel as (e: unknown) => void);
    }
    
    return () => {
      if (fabricCanvas) {
        fabricCanvas.off('zoom:changed', updateZoomLevel as (e: unknown) => void);
        fabricCanvas.off('custom:zoom-changed', updateZoomLevel);
        fabricCanvas.off('viewport:transform', updateZoomLevel as (e: unknown) => void);
      }
    };
  }, [fabricCanvasRef]); // Keep this simple to avoid dependency issues
  
  // Return drawing state with current zoom level
  return {
    drawingState: {
      ...drawingState,
      currentZoom
    }
  };
};
