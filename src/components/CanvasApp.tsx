
/**
 * Canvas application component
 * Main component that wraps the canvas with necessary UI elements
 * @module CanvasApp
 */
import { Canvas } from "@/components/Canvas";
import { CanvasLayout } from "@/components/CanvasLayout";
import { useCanvasController } from "@/components/canvas/controller/CanvasController";
import { DrawingToolbarModals } from "@/components/DrawingToolbarModals";
import { DebugInfoState } from "@/types/core/DebugInfo";
import { ZoomDirection } from "@/types/drawingTypes";
import { DrawingTool } from "@/constants/drawingModes";

/**
 * Canvas application component
 * Wraps the canvas with necessary controllers and UI
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
   * @param {ZoomDirection} direction - Zoom direction ("in" or "out")
   */
  const handleZoomAdapter = (direction: ZoomDirection) => {
    // Convert direction to a zoom level adjustment
    const zoomChange = direction === "in" ? 1.2 : 0.8;
    handleZoom(zoomChange);
  };

  // Create a safe debug info object with required properties for type compatibility
  const safeDebugInfo: DebugInfoState = {
    // Include all required properties to ensure type safety
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
      <DrawingToolbarModals />
    </CanvasLayout>
  );
};
