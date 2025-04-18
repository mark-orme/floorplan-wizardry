
/**
 * Hook for managing canvas tools and operations
 * @module canvas/controller/useCanvasToolsManager
 */
import { useCallback, useEffect } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { toast } from "sonner";
import { DrawingTool } from "@/types/canvasStateTypes";
import { FloorPlan } from "@/types/floorPlanTypes";
import { usePusherConnection } from "@/hooks/usePusherConnection";
import { useCanvasControllerTools } from "@/hooks/canvas/controller/useCanvasControllerTools";
import { useCanvasInteraction } from "@/hooks/useCanvasInteraction";
import { createFloorPlan } from "@/utils/floorPlanUtils";
import * as Sentry from '@sentry/react';

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

// Import useCanvasInteractions with adjusted return type
import { useCanvasInteractions } from "@/hooks/useCanvasInteractions";

// Custom interface for canvas interactions that matches what we use
interface CanvasInteractionsResult {
  drawingState?: any;
  currentZoom: number;
  toggleSnap: () => void;
  snapEnabled: boolean;
  resetViewport?: () => void; // Make this optional since our implementation doesn't provide it
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
    createGrid
  } = props;
  
  // Set up Sentry context for the component and tool usage
  useEffect(() => {
    // Set primary tags for filtering
    Sentry.setTag("component", "CanvasToolsManager");
    Sentry.setTag("tool", tool);
    Sentry.setTag("zoomLevel", zoomLevel.toString());
    
    // Set detailed tool context
    Sentry.setContext("toolState", {
      currentTool: tool,
      lineThickness,
      lineColor,
      zoomLevel,
      timestamp: new Date().toISOString()
    });
    
    // Set canvas context if available
    if (fabricCanvasRef.current) {
      const canvas = fabricCanvasRef.current;
      Sentry.setContext("canvas", {
        objectCount: canvas.getObjects().length,
        width: canvas.width,
        height: canvas.height,
        selection: canvas.selection,
        isDrawingMode: canvas.isDrawingMode,
        gridObjects: gridLayerRef.current?.length || 0
      });
    }
    
    // Set floor plan context
    Sentry.setContext("floorPlans", {
      count: floorPlans.length,
      currentFloor,
      currentFloorName: floorPlans[currentFloor]?.name || 'unknown'
    });
    
    return () => {
      // Clear component-specific tags when unmounting
      Sentry.setTag("component", null);
      Sentry.setTag("tool", null);
      Sentry.setTag("zoomLevel", null);
    };
  }, [tool, zoomLevel, lineThickness, lineColor, fabricCanvasRef, gridLayerRef, floorPlans, currentFloor]);
  
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
  
  // Get canvas interactions for drawing, with type assertion
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
  ) as CanvasInteractionsResult;  // Assert the type to match our expectations
  
  // Connect to Pusher for real-time updates
  // Get floorplan ID from first floorplan if available
  const floorplanId = floorPlans[0]?.id;
  const { isConnected: isPusherConnected } = usePusherConnection(floorplanId);
  
  // Add Sentry breadcrumb when snap state changes
  useEffect(() => {
    Sentry.addBreadcrumb({
      category: 'grid',
      message: `Grid snap ${snapEnabled ? 'enabled' : 'disabled'}`,
      level: 'info',
      data: {
        snapEnabled,
        tool,
        currentZoom
      }
    });
    
    Sentry.setTag("gridSnap", snapEnabled.toString());
  }, [snapEnabled, tool, currentZoom]);
  
  // Update Sentry context whenever Pusher connection changes
  useEffect(() => {
    Sentry.setTag("pusherConnected", isPusherConnected.toString());
    
    Sentry.setContext("realtime", {
      pusherConnected: isPusherConnected,
      floorplanId,
      timestamp: new Date().toISOString()
    });
  }, [isPusherConnected, floorplanId]);
  
  /**
   * Handle selection of a floor plan
   */
  const handleFloorSelect = useCallback((index: number) => {
    if (index >= 0 && index < floorPlans.length && index !== currentFloor) {
      Sentry.addBreadcrumb({
        category: 'floorplan',
        message: `Changed to floor ${index + 1} (${floorPlans[index]?.name})`,
        level: 'info',
        data: {
          previousFloor: currentFloor,
          newFloor: index,
          floorName: floorPlans[index]?.name
        }
      });

      if (fabricCanvasRef.current && floorPlans[currentFloor]) {
        const updatedFloorPlans = [...floorPlans];
        
        // Save current canvas state to floor plan
        const canvasState = fabricCanvasRef.current.toJSON(['id', 'name', 'isGrid']);
        updatedFloorPlans[currentFloor] = {
          ...updatedFloorPlans[currentFloor],
          canvasState
        };
        
        setFloorPlans(updatedFloorPlans);
        
        // Clear history when switching floors
        historyRef.current = { past: [], future: [] };
        
        // Load the selected floor's canvas state
        if (floorPlans[index]?.canvasState) {
          fabricCanvasRef.current.loadFromJSON(floorPlans[index].canvasState, () => {
            fabricCanvasRef.current?.renderAll();
            toast.success(`Loaded floor ${index + 1}`);
          });
        } else {
          fabricCanvasRef.current.clear();
          fabricCanvasRef.current.renderAll();
        }
      }
    }
  }, [fabricCanvasRef, floorPlans, currentFloor, historyRef, setFloorPlans]);
  
  /**
   * Add a new floor plan
   */
  const handleAddFloor = useCallback(() => {
    // Create new floor plan
    const newFloorPlan: FloorPlan = createFloorPlan(
      `floor-${floorPlans.length + 1}`,
      `Floor ${floorPlans.length + 1}`,
      floorPlans.length
    );
    
    // Add to floor plans array
    setFloorPlans(prev => [...prev, newFloorPlan]);
    
    // Notify user
    toast.success(`Added new floor: ${newFloorPlan.name}`);
  }, [floorPlans, setFloorPlans]);
  
  /**
   * Show the measurement guide modal
   */
  const openMeasurementGuide = useCallback(() => {
    toast.info('Opening measurement guide');
    // Implementation would be in the UI component that renders the modal
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
