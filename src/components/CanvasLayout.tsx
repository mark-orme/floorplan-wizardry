
/**
 * Layout component for the canvas and related controls
 * Organizes the UI elements for the floor plan editor
 */
import { DrawingToolbar } from "./DrawingToolbar";
import { FloorPlanList } from "./FloorPlanList";
import { CanvasContainer } from "./CanvasContainer";
import { DrawingTool } from "@/hooks/useCanvasState";
import { DebugInfoState } from "@/types/drawingTypes";
import { FloorPlan } from "@/utils/drawing";

interface CanvasLayoutProps {
  tool: DrawingTool;
  gia: number;
  floorPlans: FloorPlan[];
  currentFloor: number;
  debugInfo: DebugInfoState;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  lineThickness: number;
  lineColor: string;
  onToolChange: (tool: DrawingTool) => void;
  onUndo: () => void;
  onRedo: () => void;
  onZoom: (direction: "in" | "out") => void;
  onClear: () => void;
  onSave: () => void;
  onFloorSelect: (index: number) => void;
  onAddFloor: () => void;
  onLineThicknessChange: (thickness: number) => void;
  onLineColorChange: (color: string) => void;
}

/**
 * Main layout for the canvas application
 * @param {CanvasLayoutProps} props - Component properties 
 * @returns {JSX.Element} Rendered component
 */
export const CanvasLayout = ({
  tool,
  gia,
  floorPlans,
  currentFloor,
  debugInfo,
  canvasRef,
  lineThickness,
  lineColor,
  onToolChange,
  onUndo,
  onRedo,
  onZoom,
  onClear,
  onSave,
  onFloorSelect,
  onAddFloor,
  onLineThicknessChange,
  onLineColorChange
}: CanvasLayoutProps): JSX.Element => {
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
        lineThickness={lineThickness}
        lineColor={lineColor}
        onLineThicknessChange={onLineThicknessChange}
        onLineColorChange={onLineColorChange}
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
          <CanvasContainer 
            debugInfo={debugInfo} 
            canvasRef={canvasRef}
          />
        </div>
      </div>
    </div>
  );
};
