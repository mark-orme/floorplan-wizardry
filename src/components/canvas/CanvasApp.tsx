
import { Canvas } from "@/components/Canvas";
import { CanvasLayout } from "@/components/CanvasLayout";
import { useCanvasController } from "@/components/canvas/controller/CanvasController";
import { ZOOM_MULTIPLIERS, ZoomDirection } from "@/constants/zoomConstants";
import { DebugInfoState } from "@/types/core/DebugInfo";
import { DrawingTool } from "@/constants/drawingModes";

/**
 * Canvas application component
 * Wraps the canvas with necessary controllers and UI
 * 
 * The Canvas app orchestrates the main drawing functionality by:
 * 1. Managing drawing tools and state
 * 2. Handling user interactions (zoom, undo/redo, save)
 * 3. Providing UI controls through CanvasLayout
 * 
 * @returns {JSX.Element} Rendered component
 */
export const CanvasApp = () => {
  // Use the canvas controller hook to get all the necessary props
  const {
    tool,
    gia,
    floorPlans,
    currentFloor,
    debugInfo,
    lineThickness,
    lineColor,
    canvasRef,
    handleToolChange,
    handleUndo,
    handleRedo,
    handleZoom,
    clearCanvas,
    saveCanvas,
    deleteSelectedObjects,
    handleFloorSelect,
    handleAddFloor,
    handleLineThicknessChange,
    handleLineColorChange,
    openMeasurementGuide
  } = useCanvasController();

  /**
   * Adapter function to convert direction-based zoom to level-based zoom
   * Maps "in"/"out" directions to appropriate zoom factors
   * 
   * @param {ZoomDirection} direction - Zoom direction ("in" or "out")
   */
  const handleZoomAdapter = (direction: ZoomDirection) => {
    // Convert direction to a zoom level adjustment using constants
    const zoomChange = direction === "in" ? ZOOM_MULTIPLIERS.IN : ZOOM_MULTIPLIERS.OUT;
    handleZoom(zoomChange);
  };

  // Create a safe debug info object with required properties for type compatibility
  const safeDebugInfo: DebugInfoState = {
    ...debugInfo,
    canvasInitialized: debugInfo.canvasInitialized || false,
    dimensionsSet: debugInfo.dimensionsSet || false,
    gridCreated: debugInfo.gridCreated || false,
    eventHandlersSet: debugInfo.eventHandlersSet || false,
    brushInitialized: debugInfo.brushInitialized || false,
    showDebugInfo: debugInfo.showDebugInfo || false,
    canvasReady: debugInfo.canvasReady || false, 
    canvasCreated: debugInfo.canvasCreated || false,
    canvasLoaded: debugInfo.canvasLoaded || false,
    canvasEventsRegistered: debugInfo.canvasEventsRegistered || false,
    gridRendered: debugInfo.gridRendered || false,
    toolsInitialized: debugInfo.toolsInitialized || false,
    lastInitTime: debugInfo.lastInitTime || 0,
    lastGridCreationTime: debugInfo.lastGridCreationTime || 0,
    gridObjectCount: debugInfo.gridObjectCount || 0,
    canvasDimensions: debugInfo.canvasDimensions || { width: 0, height: 0 },
    hasError: debugInfo.hasError || false,
    errorMessage: debugInfo.errorMessage || "",
    performanceStats: debugInfo.performanceStats || {}
  };

  return (
    <CanvasLayout
      tool={tool as DrawingTool}
      gia={gia}
      floorPlans={floorPlans}
      currentFloor={currentFloor}
      debugInfo={safeDebugInfo}
      canvasRef={canvasRef}
      lineThickness={lineThickness}
      lineColor={lineColor}
      onToolChange={handleToolChange as (tool: DrawingTool) => void}
      onUndo={handleUndo}
      onRedo={handleRedo}
      onZoom={handleZoomAdapter}
      onClear={clearCanvas}
      onSave={saveCanvas}
      onDelete={deleteSelectedObjects}
      onFloorSelect={handleFloorSelect}
      onAddFloor={handleAddFloor}
      onLineThicknessChange={handleLineThicknessChange}
      onLineColorChange={handleLineColorChange}
      onShowMeasurementGuide={openMeasurementGuide}
    >
      <Canvas />
    </CanvasLayout>
  );
};
