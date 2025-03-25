
/**
 * Custom hook for handling canvas drawing operations
 * Manages drawing events, path creation, and shape processing
 * @module useCanvasDrawing
 */
import { useEffect, useState, useRef, useCallback } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
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
    deleteSelectedObjects = () => {}
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
    lineColor
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
    handleMouseUp,
    processCreatedPath,
    cleanupTimeouts,
    deleteSelectedObjects
  });
  
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
      fabricCanvas.on('zoom:changed' as any, updateZoomLevel);
      fabricCanvas.on('custom:zoom-changed', updateZoomLevel);
      
      // Also update on viewport transform changes
      fabricCanvas.on('viewport:transform' as any, updateZoomLevel);
    }
    
    return () => {
      if (fabricCanvas) {
        fabricCanvas.off('zoom:changed' as any, updateZoomLevel);
        fabricCanvas.off('custom:zoom-changed', updateZoomLevel);
        fabricCanvas.off('viewport:transform' as any, updateZoomLevel);
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
