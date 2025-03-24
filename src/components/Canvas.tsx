
import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { Card } from "./ui/card";
import { DrawingToolbar } from "./DrawingToolbar";
import { FloorPlanList } from "./FloorPlanList";
import { DebugInfo } from "./DebugInfo";
import { LoadingError } from "./LoadingError";
import { createGrid } from "@/utils/canvasGrid";
import { FloorPlan } from "@/utils/drawing";

// Custom hooks
import { useCanvasInitialization } from "@/hooks/useCanvasInitialization";
import { useCanvasDrawing } from "@/hooks/useCanvasDrawing";
import { useCanvasResizing } from "@/hooks/useCanvasResizing";
import { useFloorPlans } from "@/hooks/useFloorPlans";
import { useDrawingTools } from "@/hooks/useDrawingTools";

/**
 * Main Canvas component for floor plan drawing
 * Handles canvas setup, grid creation, and drawing tools
 */
export const Canvas = () => {
  // State for drawing tools and display
  const [tool, setTool] = useState<"draw" | "room" | "straightLine">("draw");
  const [zoomLevel, setZoomLevel] = useState(1);
  const [gia, setGia] = useState(0);
  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>([]);
  const [currentFloor, setCurrentFloor] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  // Canvas sizing and initialization tracking
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 800, height: 600 });

  /**
   * Debug info for troubleshooting canvas issues
   */
  const [debugInfo, setDebugInfo] = useState({
    canvasInitialized: false,
    gridCreated: false,
    dimensionsSet: false,
    brushInitialized: false
  });

  // Initialize canvas and grid
  const { 
    canvasRef, 
    fabricCanvasRef, 
    gridLayerRef, 
    historyRef 
  } = useCanvasInitialization({
    canvasDimensions,
    tool,
    currentFloor,
    setZoomLevel,
    setDebugInfo,
    setHasError,
    setErrorMessage
  });
  
  // Create grid callback for other hooks
  const gridRef = useCallback((canvas: any) => {
    return createGrid(
      canvas, 
      gridLayerRef, 
      canvasDimensions, 
      setDebugInfo, 
      setHasError, 
      setErrorMessage
    );
  }, [canvasDimensions, gridLayerRef]);

  // Drawing tools
  const {
    clearDrawings,
    handleToolChange,
    handleUndo,
    handleRedo,
    handleZoom,
    clearCanvas,
    saveCanvas
  } = useDrawingTools({
    fabricCanvasRef,
    gridLayerRef,
    historyRef,
    tool,
    zoomLevel,
    setTool,
    setZoomLevel,
    floorPlans,
    currentFloor,
    setFloorPlans,
    setGia,
    createGrid: gridRef,
    recalculateGIA: () => {}  // Will be replaced after useFloorPlans
  });

  // Floor plans management
  const {
    drawFloorPlan,
    recalculateGIA,
    handleAddFloor,
    handleSelectFloor,
    loadData
  } = useFloorPlans({
    fabricCanvasRef,
    gridLayerRef,
    floorPlans,
    currentFloor,
    isLoading,
    setGia,
    setFloorPlans,
    clearDrawings,
    createGrid: gridRef
  });

  // Update the recalculateGIA in drawing tools
  useEffect(() => {
    Object.assign(useDrawingTools, { recalculateGIA });
  }, [recalculateGIA]);

  // Canvas drawing
  useCanvasDrawing({
    fabricCanvasRef,
    gridLayerRef,
    historyRef,
    tool,
    currentFloor,
    setFloorPlans,
    setGia
  });

  // Canvas resizing
  useCanvasResizing({
    canvasRef,
    fabricCanvasRef,
    setCanvasDimensions,
    setDebugInfo,
    setHasError,
    setErrorMessage,
    createGrid: gridRef
  });

  // Load floor plans data
  useEffect(() => {
    const loadFloorPlansData = async () => {
      try {
        console.log("Loading floor plans...");
        setIsLoading(true);
        const plans = await loadData();
        setFloorPlans(plans);
        setIsLoading(false);
        setHasError(false);
        console.log("Floor plans loaded:", plans);
      } catch (error) {
        console.error("Error loading floor plans:", error);
        setHasError(true);
        setErrorMessage("Failed to load floor plans");
        toast.error("Failed to load floor plans");
        setIsLoading(false);
      }
    };
    
    loadFloorPlansData();
  }, [loadData]);

  // Handle selecting a different floor
  const handleFloorSelect = useCallback((index: number) => {
    if (index !== currentFloor) {
      setCurrentFloor(index);
      handleSelectFloor(index);
    }
  }, [currentFloor, handleSelectFloor]);

  if (isLoading || hasError) {
    return (
      <LoadingError 
        isLoading={isLoading}
        hasError={hasError}
        errorMessage={errorMessage}
        onRetry={() => {
          setHasError(false);
          loadData();
        }}
      />
    );
  }

  // Main canvas display
  return (
    <div className="flex flex-col gap-6 p-6 max-w-[1200px] mx-auto">
      {/* Drawing tools bar positioned at top */}
      <DrawingToolbar
        tool={tool}
        onToolChange={handleToolChange}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onZoom={handleZoom}
        onClear={clearCanvas}
        onSave={saveCanvas}
        gia={gia}
      />
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar for floor plans */}
        <div className="md:w-64">
          <FloorPlanList 
            floorPlans={floorPlans}
            currentFloor={currentFloor}
            onSelect={handleFloorSelect}
            onAdd={handleAddFloor}
          />
        </div>
        
        {/* Canvas container */}
        <div className="flex-1 canvas-container">
          <Card className="p-6 bg-white shadow-md rounded-lg">
            <canvas ref={canvasRef} />
            <DebugInfo debugInfo={debugInfo} />
          </Card>
        </div>
      </div>
    </div>
  );
};
