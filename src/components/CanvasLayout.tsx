
/**
 * Layout component for the canvas and related controls
 * Organizes the UI elements for the floor plan editor
 */
import { DrawingToolbar } from "./DrawingToolbar";
import { FloorPlanList } from "./FloorPlanList";
import { CanvasContainer } from "./CanvasContainer";
import { useCanvas } from "@/context/CanvasContext";

/**
 * Main layout for the canvas application
 * Uses the Canvas context to access state and handlers
 * @returns {JSX.Element} Rendered component
 */
export const CanvasLayout = () => {
  const {
    tool,
    gia,
    floorPlans,
    currentFloor,
    debugInfo,
    canvasRef,
    lineThickness,
    lineColor,
    handleToolChange,
    handleUndo,
    handleRedo,
    handleZoom,
    clearCanvas,
    saveCanvas,
    handleFloorSelect,
    handleAddFloor,
    handleLineThicknessChange,
    handleLineColorChange
  } = useCanvas();

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
        lineThickness={lineThickness}
        lineColor={lineColor}
        onLineThicknessChange={handleLineThicknessChange}
        onLineColorChange={handleLineColorChange}
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
          <CanvasContainer />
        </div>
      </div>
    </div>
  );
};
