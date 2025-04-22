
/**
 * Hook for managing canvas drawing tools
 * Centralizes tool operations and state changes
 * @module useCanvasControllerTools
 */
import { useCallback } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { useDrawingTools } from "@/hooks/useDrawingTools";
import { DrawingMode } from "@/constants/drawingModes";
import { FloorPlan } from "@/types/floorPlanTypes";
import { useFloorPlanGIA } from "@/hooks/useFloorPlanGIA";
import { ZoomDirection } from "@/types/drawingTypes";
import { useCanvasToolState } from "@/hooks/canvas/controller/useCanvasToolState";
import { useCanvasOperations } from "@/hooks/canvas/controller/useCanvasOperations";
import { useFloorPlanOperations } from "@/hooks/canvas/controller/useFloorPlanOperations";
import { convertToUnifiedFloorPlan, convertToUnifiedFloorPlans } from "@/utils/floorPlanAdapter/floorPlanTypeAdapter";

/**
 * Props for useCanvasControllerTools hook
 * @interface UseCanvasControllerToolsProps
 */
interface UseCanvasControllerToolsProps {
  /** Reference to the fabric canvas instance */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Reference to grid layer objects */
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
  /** Reference to history state for undo/redo */
  historyRef: React.MutableRefObject<{past: FabricObject[][], future: FabricObject[][]}>;
  /** Current active drawing tool */
  tool: DrawingMode;
  /** Current zoom level */
  zoomLevel: number;
  /** Line thickness for drawing */
  lineThickness: number;
  /** Line color for drawing */
  lineColor: string;
  /** Function to set the current tool */
  setTool: React.Dispatch<React.SetStateAction<DrawingMode>>;
  /** Function to set the zoom level */
  setZoomLevel: React.Dispatch<React.SetStateAction<number>>;
  /** Array of floor plans */
  floorPlans: FloorPlan[];
  /** Index of current floor */
  currentFloor: number;
  /** Function to update floor plans */
  setFloorPlans: React.Dispatch<React.SetStateAction<FloorPlan[]>>;
  /** Function to set the GIA (Gross Internal Area) */
  setGia: React.Dispatch<React.SetStateAction<number>>;
  /** Function to create grid objects */
  createGrid: (canvas: FabricCanvas) => FabricObject[];
}

/**
 * Hook that manages canvas drawing tools and operations
 */
export const useCanvasControllerTools = (props: UseCanvasControllerToolsProps) => {
  const {
    fabricCanvasRef,
    gridLayerRef,
    historyRef,
    tool,
    zoomLevel,
    lineThickness,
    lineColor,
    setTool,
    setZoomLevel,
    floorPlans,
    currentFloor,
    setFloorPlans,
    setGia,
    createGrid
  } = props;

  // Convert floor plans types for compatibility with hooks expecting unified types
  const unifiedFloorPlans = convertToUnifiedFloorPlans(floorPlans);
  const setUnifiedFloorPlans = (plans: any) => {
    // This function will handle both direct state updates and function updates
    if (typeof plans === 'function') {
      setFloorPlans((prev: FloorPlan[]) => {
        const newPlans = plans(convertToUnifiedFloorPlans(prev));
        return newPlans.map((p: any) => p);  // Keep as-is, assuming convertToUnifiedFloorPlans made them compatible
      });
    } else {
      setFloorPlans(plans);
    }
  };

  // Initialize GIA calculation hook
  const { recalculateGIA } = useFloorPlanGIA({
    fabricCanvasRef,
    setGia
  });

  // Get drawing tool functions
  const toolFunctions = useDrawingTools({
    fabricCanvasRef,
    gridLayerRef,
    tool,
    setTool,
    zoomLevel,
    setZoomLevel,
    lineThickness,
    lineColor,
    historyRef,
    floorPlans: unifiedFloorPlans,
    currentFloor,
    setFloorPlans: setUnifiedFloorPlans,
    setGia,
    createGrid
  });

  // Use the tool state hook
  const toolState = useCanvasToolState({
    fabricCanvasRef,
    tool,
    setTool,
    lineThickness,
    lineColor,
    zoomLevel,
    setZoomLevel
  });

  // Use the canvas operations hook
  const canvasOperations = useCanvasOperations({
    fabricCanvasRef,
    gridLayerRef,
    saveCurrentState: toolFunctions.saveCurrentState
  });

  // Use the floor plan operations hook
  const floorPlanOperations = useFloorPlanOperations({
    floorPlans,
    currentFloor,
    setFloorPlans,
    setGia
  });

  // Modified handleZoom to accept string direction
  const handleZoom = useCallback((direction: ZoomDirection): void => {
    if (direction === "in") {
      toolFunctions.handleZoom(1.2);
    } else {
      toolFunctions.handleZoom(0.8);
    }
  }, [toolFunctions]);

  // Tool-related functions
  const handleLineThicknessChange = useCallback((thickness: number): void => {
    console.info(`Line thickness changed to ${thickness}`);
    // Implement line thickness change logic
  }, []);

  const handleLineColorChange = useCallback((color: string): void => {
    console.info(`Line color changed to ${color}`);
    // Implement line color change logic
  }, []);

  const openMeasurementGuide = useCallback((): void => {
    console.info('Measurement guide opened');
    // Implement measurement guide logic
  }, []);

  return {
    // From drawing tools
    handleToolChange: toolState.handleToolChange,
    handleUndo: toolFunctions.undo,
    handleRedo: toolFunctions.redo,
    handleZoom,
    saveCurrentState: toolFunctions.saveCurrentState,
    
    // From canvas operations
    clearDrawings: canvasOperations.clearDrawings,
    clearCanvas: canvasOperations.clearCanvas,
    saveCanvas: canvasOperations.saveCanvas,
    deleteSelectedObjects: canvasOperations.deleteSelectedObjects,
    
    // From floor plan operations
    handleFloorSelect: floorPlanOperations.handleFloorSelect,
    handleAddFloor: floorPlanOperations.handleAddFloor,
    
    // Additional tools
    handleLineThicknessChange,
    handleLineColorChange,
    openMeasurementGuide
  };
};
