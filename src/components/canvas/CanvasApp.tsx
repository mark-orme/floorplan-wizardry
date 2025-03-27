
import { Canvas } from "@/components/Canvas";
import { CanvasLayout } from "@/components/CanvasLayout";
import { useCanvasController } from "@/components/canvas/controller/CanvasController";

/**
 * Zoom multiplier constants
 * @constant {Object}
 */
const ZOOM_MULTIPLIERS = {
  /**
   * Zoom in multiplier value
   * @constant {number}
   */
  IN: 1.2,
  
  /**
   * Zoom out multiplier value
   * @constant {number}
   */
  OUT: 0.8
};

/**
 * Zoom direction type
 * @typedef {"in" | "out"} ZoomDirection
 */
type ZoomDirection = "in" | "out";

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
    const zoomChange = direction === "in" ? ZOOM_MULTIPLIERS.IN : ZOOM_MULTIPLIERS.OUT;
    handleZoom(zoomChange);
  };

  return (
    <CanvasLayout
      tool={tool}
      gia={gia}
      floorPlans={floorPlans}
      currentFloor={currentFloor}
      debugInfo={debugInfo}
      canvasRef={canvasRef}
      lineThickness={lineThickness}
      lineColor={lineColor}
      onToolChange={handleToolChange}
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
