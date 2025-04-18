
/**
 * Hook for managing canvas tools and operations
 */
import { useCallback } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { toast } from "sonner";
import { DrawingTool } from "@/types/canvasStateTypes";
import { FloorPlan } from "@/types/floorPlanTypes";
import { usePusherConnection } from "@/hooks/usePusherConnection";
import { useCanvasControllerTools } from "@/hooks/canvas/controller/useCanvasControllerTools";
import { useCanvasStateEffects } from "./useCanvasStateEffects";
import { useCanvasFloorOperations } from "./useCanvasFloorOperations";
import { useCanvasInteraction } from "@/hooks/useCanvasInteraction";
import { useCanvasInteractions } from "@/hooks/useCanvasInteractions";
import { useLineSettings } from "@/hooks/useLineSettings";
import { useMeasurementGuideDialog } from "@/hooks/useMeasurementGuideDialog";

interface UseCanvasToolsManagerProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
  historyRef: React.MutableRefObject<{past: any[][], future: any[][]}>;
  tool: DrawingTool;
  zoomLevel: number;
  lineThickness: number;
  lineColor: string;
  setTool: React.Dispatch<React.SetStateAction<DrawingTool>>;
  setZoomLevel: React.Dispatch<React.SetStateAction<number>>;
  floorPlans: FloorPlan[];
  currentFloor: number;
  setFloorPlans: React.Dispatch<React.SetStateAction<FloorPlan[]>>;
  setGia: React.Dispatch<React.SetStateAction<number>>;
  createGrid: (canvas: FabricCanvas) => any[];
  recalculateGIA?: () => void;
}

interface CanvasInteractionsResult {
  drawingState?: any;
  currentZoom: number;
  toggleSnap: () => void;
  snapEnabled: boolean;
}

export const useCanvasToolsManager = (props: UseCanvasToolsManagerProps) => {
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

  // Get drawing tools and operations
  const {
    clearDrawings,
    handleToolChange,
    handleUndo,
    handleRedo,
    handleZoom,
    clearCanvas,
    saveCanvas,
    saveCurrentState
  } = useCanvasControllerTools({
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
  });

  // Get canvas interaction methods
  const {
    deleteSelectedObjects,
    enablePointSelection,
    setupSelectionMode
  } = useCanvasInteraction({
    fabricCanvasRef,
    tool,
    saveCurrentState
  });

  // Get canvas interactions for drawing
  const {
    drawingState,
    currentZoom,
    toggleSnap,
    snapEnabled
  } = useCanvasInteractions(
    fabricCanvasRef,
    tool,
    lineThickness,
    lineColor
  ) as CanvasInteractionsResult;

  // Initialize line settings
  const { handleLineThicknessChange, handleLineColorChange, applyLineSettings } = useLineSettings({
    fabricCanvasRef,
    lineThickness,
    lineColor
  });

  // Initialize measurement guide
  const { isOpen, openMeasurementGuide, handleOpenChange } = useMeasurementGuideDialog();

  // Connect to Pusher for real-time updates
  const floorplanId = floorPlans[0]?.id;
  const { isConnected: isPusherConnected } = usePusherConnection(floorplanId);

  // Use the extracted floor operations
  const { handleFloorSelect, handleAddFloor } = useCanvasFloorOperations({
    fabricCanvasRef,
    floorPlans,
    currentFloor,
    historyRef,
    setFloorPlans
  });

  // Use the extracted state effects
  useCanvasStateEffects({
    fabricCanvasRef,
    gridLayerRef,
    tool,
    zoomLevel,
    lineThickness,
    lineColor,
    floorPlans,
    currentFloor,
    isPusherConnected,
    snapEnabled
  });

  return {
    // Canvas tool operations
    handleToolChange,
    handleUndo,
    handleRedo,
    handleZoom,
    clearCanvas,
    saveCanvas,
    deleteSelectedObjects,
    
    // Floor plan operations
    handleFloorSelect,
    handleAddFloor,
    
    // Styling operations
    handleLineThicknessChange,
    handleLineColorChange,
    applyLineSettings,
    
    // Help operations
    openMeasurementGuide,
    
    // Grid operations
    toggleSnap,
    snapEnabled,
    
    // Canvas state
    drawingState,
    currentZoom,
    isPusherConnected,
    measurementGuideOpen: isOpen,
    onMeasurementGuideOpenChange: handleOpenChange
  };
};
