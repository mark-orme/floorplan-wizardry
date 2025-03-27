/**
 * Hook for managing canvas tools and operations
 * @module canvas/controller/useCanvasToolsManager
 */
import { useCallback } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { toast } from "sonner";
import { DrawingTool } from "@/hooks/useCanvasState";
import { FloorPlan } from "@/types/floorPlanTypes";
import { useCanvasInteractions } from "@/hooks/useCanvasInteractions";
import { usePusherConnection } from "@/hooks/usePusherConnection";
import { useCanvasControllerTools } from "@/hooks/canvas/controller/useCanvasControllerTools";
import { useCanvasInteraction } from "@/hooks/useCanvasInteraction";

/**
 * Props for the useCanvasToolsManager hook
 * @interface UseCanvasToolsManagerProps
 */
interface UseCanvasToolsManagerProps {
  /** Reference to the fabric canvas instance */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Reference to grid layer objects */
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
  /** Reference to history state */
  historyRef: React.MutableRefObject<{ past: any[][], future: any[][] }>;
  /** Current active drawing tool */
  tool: DrawingTool;
  /** Current zoom level */
  zoomLevel: number;
  /** Line thickness for drawing */
  lineThickness: number;
  /** Line color for drawing */
  lineColor: string;
  /** Function to set the current tool */
  setTool: React.Dispatch<React.SetStateAction<DrawingTool>>;
  /** Function to set the zoom level */
  setZoomLevel: React.Dispatch<React.SetStateAction<number>>;
  /** Array of floor plans */
  floorPlans: FloorPlan[];
  /** Current floor index */
  currentFloor: number;
  /** Function to set floor plans */
  setFloorPlans: React.Dispatch<React.SetStateAction<FloorPlan[]>>;
  /** Function to set GIA value */
  setGia: React.Dispatch<React.SetStateAction<number>>;
  /** Function to create grid */
  createGrid: (canvas: FabricCanvas) => any[];
  /** Function to recalculate GIA */
  recalculateGIA?: () => void;
}

/**
 * Hook that centrally manages all canvas tool operations
 * 
 * @param {UseCanvasToolsManagerProps} props - Hook properties
 * @returns All canvas tool operations and handlers
 */
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
    createGrid,
    recalculateGIA
  } = props;
  
  // Get drawing tools from controller tools hook
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
  } = useCanvasInteractions({
    fabricCanvasRef,
    tool,
    lineThickness,
    lineColor
  });
  
  // Connect to Pusher for real-time updates
  // Get floorplan ID from first floorplan if available
  const floorplanId = floorPlans[0]?.id;
  const { isConnected: isPusherConnected } = usePusherConnection(floorplanId);
  
  /**
   * Handle selection of a floor plan
   * @param {number} index - Floor plan index
   */
  const handleFloorSelect = useCallback((index: number) => {
    // Only switch if valid index and different from current
    if (index >= 0 && index < floorPlans.length && index !== currentFloor) {
      // Clear history when switching floors
      historyRef.current = { past: [], future: [] };
      
      // Save current canvas state to floor plan array
      if (fabricCanvasRef.current && floorPlans[currentFloor]) {
        const updatedFloorPlans = [...floorPlans];
        
        // TODO: Save canvas state to floor plan
        // This would involve serializing canvas state
        
        setFloorPlans(updatedFloorPlans);
      }
    }
  }, [fabricCanvasRef, floorPlans, currentFloor, historyRef, setFloorPlans]);
  
  /**
   * Add a new floor plan
   */
  const handleAddFloor = useCallback(() => {
    // Create new floor plan
    const newFloorPlan: FloorPlan = {
      id: `floor-${floorPlans.length + 1}`,
      name: `Floor ${floorPlans.length + 1}`,
      label: `Floor ${floorPlans.length + 1}`,
      canvasData: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      strokes: []
    };
    
    // Add to floor plans array
    setFloorPlans(prev => [...prev, newFloorPlan]);
    
    // Notify user
    toast.success(`Added new floor: ${newFloorPlan.name}`);
  }, [floorPlans, setFloorPlans]);
  
  /**
   * Show the measurement guide modal
   */
  const openMeasurementGuide = useCallback(() => {
    toast.info('Measurement guide coming soon');
    // TODO: Implement measurement guide modal
  }, []);
  
  /**
   * Handle line thickness change
   * @param {number} thickness - New line thickness
   */
  const handleLineThicknessChange = useCallback((thickness: number) => {
    if (fabricCanvasRef.current) {
      // Update drawing brush with new thickness
      const canvas = fabricCanvasRef.current;
      if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.width = thickness;
      }
    }
  }, [fabricCanvasRef]);
  
  /**
   * Handle line color change
   * @param {string} color - New line color
   */
  const handleLineColorChange = useCallback((color: string) => {
    if (fabricCanvasRef.current) {
      // Update drawing brush with new color
      const canvas = fabricCanvasRef.current;
      if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.color = color;
      }
    }
  }, [fabricCanvasRef]);
  
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
    
    // Help operations
    openMeasurementGuide,
    
    // Grid operations
    toggleSnap,
    snapEnabled,
    
    // Canvas state
    drawingState,
    currentZoom,
    isPusherConnected
  };
};
