
/**
 * Canvas application component
 * Main component that wraps the canvas with necessary UI elements
 * @module CanvasApp
 */
import { Canvas } from "@/components/Canvas";
import CanvasLayout from "@/components/CanvasLayout"; // Fixed import statement
import { DrawingToolbarModals } from "@/components/DrawingToolbarModals";
import { DEFAULT_DEBUG_STATE } from "@/types/core/DebugInfo";
import { DebugInfoState } from "@/types/drawingTypes";
import { ZoomDirection } from "@/types/drawingTypes";
import { DrawingTool } from "@/types/drawingTypes";
import { useCanvasController } from "@/components/canvas/controller/CanvasController";

/**
 * Canvas application component
 * Wraps the canvas with necessary controllers and UI
 * @returns {JSX.Element} Rendered component
 */
export const CanvasApp = (): JSX.Element => {
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
  const handleZoomAdapter = (direction: ZoomDirection): void => {
    // Convert direction to a zoom level adjustment
    handleZoom(direction);
  };

  // Create a safe debug info object with required properties for type compatibility
  const safeDebugInfo: DebugInfoState = {
    ...DEFAULT_DEBUG_STATE,
    ...(debugInfo || {})
  };

  return (
    <CanvasLayout>
      <Canvas />
      <DrawingToolbarModals />
    </CanvasLayout>
  );
};
