
import { useState } from "react";
import { Canvas } from "@/components/Canvas";
import { CanvasLayout } from "@/components/CanvasLayout";
import { FloorPlanList } from "@/components/FloorPlanList";
import { DrawingToolbar } from "@/components/DrawingToolbar";
import { CanvasControllerProvider, useCanvasController } from "@/components/canvas/controller/CanvasController";
import { DebugInfo } from "@/components/DebugInfo";

// Create a wrapper component that uses the canvas controller
const CanvasApp = () => {
  const [showDebug, setShowDebug] = useState(false);
  const {
    tool,
    gia,
    floorPlans,
    currentFloor,
    debugInfo,
    lineThickness,
    lineColor,
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
  } = useCanvasController();

  return (
    <CanvasLayout
      tool={tool}
      gia={gia}
      floorPlans={floorPlans}
      currentFloor={currentFloor}
      debugInfo={debugInfo}
      canvasRef={null} // This will be supplied by the Canvas component
      lineThickness={lineThickness}
      lineColor={lineColor}
      onToolChange={handleToolChange}
      onUndo={handleUndo}
      onRedo={handleRedo}
      onZoom={handleZoom}
      onClear={clearCanvas}
      onSave={saveCanvas}
      onDelete={deleteSelectedObjects}
      onFloorSelect={handleFloorSelect}
      onAddFloor={handleAddFloor}
      onLineThicknessChange={handleLineThicknessChange}
      onLineColorChange={handleLineColorChange}
      onShowMeasurementGuide={() => {}}
    >
      <Canvas />
    </CanvasLayout>
  );
};

const Index = () => {
  return (
    <main className="flex min-h-screen flex-col w-full">
      <CanvasControllerProvider>
        <CanvasApp />
      </CanvasControllerProvider>
    </main>
  );
};

export default Index;
