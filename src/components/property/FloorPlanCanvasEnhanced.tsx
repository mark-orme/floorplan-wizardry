
import React, { useRef } from "react";
import { EnhancedCanvas } from "@/components/EnhancedCanvas";
import { CanvasControllerProvider } from "@/components/canvas/controller/CanvasController";
import { useEnhancedSnapToGrid } from "@/hooks/useEnhancedSnapToGrid";
import { useTouchGestures } from "@/hooks/useTouchGestures";
import { usePaperSizeManager } from "@/hooks/usePaperSizeManager";
import { DrawingLayers } from "@/components/canvas/DrawingLayers";
import { DrawingMode } from "@/constants/drawingModes";
import { PaperSizeSelector } from "@/components/canvas/PaperSizeSelector";
import { CanvasDiagnostics } from "@/components/canvas/CanvasDiagnostics";
import { useFloorPlanCanvas } from "@/hooks/useFloorPlanCanvas";
import { AreaCalculationDisplay } from "./AreaCalculationDisplay";
import { ToolIndicator } from "./ToolIndicator";
import { CalculateAreaButton } from "./CalculateAreaButton";

interface FloorPlanCanvasEnhancedProps {
  /** Callback for canvas error */
  onCanvasError?: (error: Error) => void;
  /** Initial tool */
  initialTool?: DrawingMode;
  /** Initial line color */
  initialLineColor?: string;
  /** Initial line thickness */
  initialLineThickness?: number;
  /** Whether to show grid */
  showGrid?: boolean;
}

export const FloorPlanCanvasEnhanced: React.FC<FloorPlanCanvasEnhancedProps> = ({
  onCanvasError,
  initialTool = DrawingMode.SELECT,
  initialLineColor = "#000000",
  initialLineThickness = 2,
  showGrid = true
}) => {
  // Canvas container reference
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  
  // Use our extracted hook for canvas operations
  const {
    fabricCanvasRef,
    tool,
    lineColor,
    lineThickness,
    canvasZoom,
    setCanvasZoom,
    layers,
    setLayers,
    activeLayerId,
    setActiveLayerId,
    calculatedArea,
    handleCanvasReady,
    handleCanvasError,
    handleUndo,
    calculateArea
  } = useFloorPlanCanvas({
    initialTool,
    initialLineColor,
    initialLineThickness,
    onCanvasError
  });
  
  // Use paper size manager hook
  const { currentPaperSize, paperSizes, infiniteCanvas, changePaperSize, toggleInfiniteCanvas } = 
    usePaperSizeManager({ fabricCanvasRef });
  
  return (
    <div 
      ref={canvasContainerRef}
      className="h-full w-full relative overflow-hidden"
      data-testid="enhanced-floor-plan-wrapper"
    >
      <CanvasControllerProvider>
        <EnhancedCanvas
          width={currentPaperSize.width}
          height={currentPaperSize.height}
          onCanvasReady={handleCanvasReady}
          onError={handleCanvasError}
          tool={tool}
          lineColor={lineColor}
          lineThickness={lineThickness}
          snapToGrid={true}
          autoStraighten={true}
          onZoomChange={setCanvasZoom}
          onUndo={handleUndo}
          showGrid={showGrid}
          infiniteCanvas={infiniteCanvas}
          paperSize={infiniteCanvas ? undefined : currentPaperSize}
        />
        
        {/* Canvas diagnostics component */}
        {fabricCanvasRef.current && (
          <CanvasDiagnostics 
            canvas={fabricCanvasRef.current}
            currentTool={tool}
            runOnMount={true}
            monitoringInterval={30000}
          />
        )}
        
        {/* Layer management */}
        <DrawingLayers
          fabricCanvasRef={fabricCanvasRef}
          layers={layers}
          setLayers={setLayers}
          activeLayerId={activeLayerId}
          setActiveLayerId={setActiveLayerId}
        />
        
        {/* Area calculation display - extracted to component */}
        <AreaCalculationDisplay areaM2={calculatedArea.areaM2} />
        
        {/* Paper size controls */}
        <PaperSizeSelector
          currentPaperSize={currentPaperSize}
          paperSizes={paperSizes}
          infiniteCanvas={infiniteCanvas}
          onChangePaperSize={changePaperSize}
          onToggleInfiniteCanvas={toggleInfiniteCanvas}
        />
        
        {/* Tool selection indicators - extracted to component */}
        <ToolIndicator activeTool={tool} />
        
        {/* Calculate Area button - extracted to component */}
        <CalculateAreaButton onClick={calculateArea} />
      </CanvasControllerProvider>
    </div>
  );
};
