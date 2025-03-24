
import { DrawingToolbar } from "./DrawingToolbar";
import { FloorPlanList } from "./FloorPlanList";
import { CanvasContainer } from "./CanvasContainer";

interface CanvasLayoutProps {
  tool: "draw" | "room" | "straightLine";
  gia: number;
  floorPlans: any[];
  currentFloor: number;
  debugInfo: {
    canvasInitialized: boolean;
    gridCreated: boolean;
    dimensionsSet: boolean;
    brushInitialized: boolean;
  };
  onToolChange: (tool: "draw" | "room" | "straightLine") => void;
  onUndo: () => void;
  onRedo: () => void;
  onZoom: (direction: "in" | "out") => void;
  onClear: () => void;
  onSave: () => void;
  onFloorSelect: (index: number) => void;
  onAddFloor: () => void;
}

export const CanvasLayout = ({
  tool,
  gia,
  floorPlans,
  currentFloor,
  debugInfo,
  onToolChange,
  onUndo,
  onRedo,
  onZoom,
  onClear,
  onSave,
  onFloorSelect,
  onAddFloor
}: CanvasLayoutProps) => {
  return (
    <div className="flex flex-col gap-6 p-6 max-w-[1200px] mx-auto">
      {/* Drawing tools bar positioned at top */}
      <DrawingToolbar
        tool={tool}
        onToolChange={onToolChange}
        onUndo={onUndo}
        onRedo={onRedo}
        onZoom={onZoom}
        onClear={onClear}
        onSave={onSave}
        gia={gia}
      />
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar for floor plans */}
        <div className="md:w-64">
          <FloorPlanList 
            floorPlans={floorPlans}
            currentFloor={currentFloor}
            onSelect={onFloorSelect}
            onAdd={onAddFloor}
          />
        </div>
        
        {/* Canvas container */}
        <div className="flex-1 canvas-container">
          <CanvasContainer debugInfo={debugInfo} />
        </div>
      </div>
    </div>
  );
};
