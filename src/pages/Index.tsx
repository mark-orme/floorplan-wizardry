
import { useState, useEffect } from "react";
import { Canvas } from "@/components/Canvas";
import { CanvasLayout } from "@/components/CanvasLayout";
import { CanvasControllerProvider, useCanvasController } from "@/components/canvas/controller/CanvasController";
import { DebugInfo } from "@/components/DebugInfo";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

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
    openMeasurementGuide
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
      onShowMeasurementGuide={openMeasurementGuide}
    >
      <Canvas />
    </CanvasLayout>
  );
};

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <main className="flex flex-col w-full min-h-screen bg-background">
      <div className="flex items-center p-2 bg-muted/30 border-b">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate('/properties')}
          className="mr-2"
        >
          <Home className="h-4 w-4 mr-1" />
          Back to Properties
        </Button>
        <h1 className="text-xl font-bold">Floor Plan Editor</h1>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <CanvasControllerProvider>
          <CanvasApp />
        </CanvasControllerProvider>
      </div>
    </main>
  );
};

export default Index;
