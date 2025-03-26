
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
import { Button } from "./ui/button";
import { HelpCircle } from "lucide-react";

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
  onDelete?: () => void;
  onFloorSelect: (index: number) => void;
  onAddFloor: () => void;
  onLineThicknessChange: (thickness: number) => void;
  onLineColorChange: (color: string) => void;
  onShowMeasurementGuide: () => void;
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
  onDelete,
  onFloorSelect,
  onAddFloor,
  onLineThicknessChange,
  onLineColorChange,
  onShowMeasurementGuide
}: CanvasLayoutProps): JSX.Element => {
  return (
    <div className="flex flex-col gap-1 p-0 max-w-[1920px] mx-auto"> {/* Reduced gap, padding, increased max-width */}
      {/* Drawing tools bar positioned at top */}
      <div className="flex justify-between items-center mb-1"> {/* Added small bottom margin */}
        <DrawingToolbar
          tool={tool}
          onToolChange={onToolChange}
          onUndo={onUndo}
          onRedo={onRedo}
          onZoom={onZoom}
          onClear={onClear}
          onSave={onSave}
          onDelete={onDelete}
          gia={gia}
          lineThickness={lineThickness}
          lineColor={lineColor}
          onLineThicknessChange={onLineThicknessChange}
          onLineColorChange={onLineColorChange}
        />
        
        {/* Help button for measurement guide */}
        <Button
          variant="outline"
          size="sm"
          onClick={onShowMeasurementGuide}
          className="ml-2"
        >
          <HelpCircle className="h-4 w-4 mr-2" />
          Measurement Guide
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-1"> {/* Reduced gap from 2 to 1 */}
        {/* Sidebar for floor plans - made narrower */}
        <div className="md:w-28"> {/* Reduced from w-36 to w-28 */}
          <FloorPlanList 
            floorPlans={floorPlans}
            currentFloor={currentFloor}
            onSelect={onFloorSelect}
            onAdd={onAddFloor} // Use the onAddFloor function that doesn't take parameters
          />
        </div>
        
        {/* Canvas container - takes more space */}
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
