
/**
 * Main Canvas component for floor plan drawing
 * Orchestrates the canvas setup, grid creation, and drawing tools
 * @module Canvas
 */
import { useEffect, useRef } from "react";
import { LoadingErrorWrapper } from "./LoadingErrorWrapper";
import { CanvasLayout } from "./CanvasLayout";
import { CanvasController } from "./canvas/controller/CanvasController";
import { DistanceTooltip } from "./DistanceTooltip";
import { MeasurementGuideModal } from "./MeasurementGuideModal";
import { useMeasurementGuide } from "@/hooks/useMeasurementGuide";
import logger from "@/utils/logger";

interface CanvasProps {
  readonly?: boolean;
  'data-readonly'?: boolean;
}

/**
 * Main Canvas component for floor plan drawing
 * Handles canvas setup, grid creation, and drawing tools
 * @returns {JSX.Element} Rendered component
 */
export const Canvas = (props: CanvasProps) => {
  // Track initialization with refs instead of module-level variables
  const appInitializedRef = useRef<boolean>(false);
  const initialDataLoadedRef = useRef<boolean>(false);
  const isFirstMountRef = useRef<boolean>(true);
  
  // We need to use a stable controller reference
  const controllerRef = useRef<ReturnType<typeof CanvasController> | null>(null);
  
  // Initialize controller only once
  if (!controllerRef.current) {
    controllerRef.current = CanvasController();
  }
  
  // Extract controller properties
  const {
    tool,
    gia,
    floorPlans,
    currentFloor,
    isLoading,
    hasError,
    errorMessage,
    debugInfo,
    canvasRef,
    lineThickness,
    lineColor,
    loadData,
    handleFloorSelect,
    handleAddFloor,
    handleToolChange,
    handleUndo,
    handleRedo,
    handleZoom,
    clearCanvas,
    saveCanvas,
    handleLineThicknessChange,
    handleLineColorChange,
    drawingState,
    handleRetry
  } = controllerRef.current;
  
  // Measurement guide modal state - must be after other hooks
  const { 
    showMeasurementGuide, 
    setShowMeasurementGuide,
    handleCloseMeasurementGuide
  } = useMeasurementGuide(tool);

  // We now default to select tool on initial load
  useEffect(() => {
    if (isFirstMountRef.current && !isLoading && debugInfo.canvasInitialized) {
      logger.info("Using default tool: select");
      handleToolChange("select");
      isFirstMountRef.current = false;
    }
  }, [isLoading, debugInfo.canvasInitialized, handleToolChange]);

  // Load initial data only once across all renders
  useEffect(() => {
    // Skip initialization if already done or component is remounting
    if (!isFirstMountRef.current || (appInitializedRef.current && initialDataLoadedRef.current)) {
      return;
    }
    
    logger.info("Loading initial canvas data");
    loadData();
    appInitializedRef.current = true;
    initialDataLoadedRef.current = true;
  }, [loadData]);

  // Determine tooltip visibility - show when drawing or in select mode with an active selection
  const isTooltipVisible = 
    // Always show during active drawing with straightLine or room tools
    (drawingState?.isDrawing && (tool === "straightLine" || tool === "room")) ||
    // Show when hovering with these tools even if not actively drawing
    (!drawingState?.isDrawing && (tool === "straightLine" || tool === "room") && drawingState?.cursorPosition != null) ||
    // Also show when in select mode and actively manipulating a line
    (tool === "select" && drawingState?.isDrawing);

  return (
    <LoadingErrorWrapper
      isLoading={isLoading}
      hasError={hasError}
      errorMessage={errorMessage}
      onRetry={handleRetry}
    >
      <div className="relative w-full h-full">
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
          onZoom={handleZoom}
          onClear={clearCanvas}
          onSave={saveCanvas}
          onFloorSelect={handleFloorSelect}
          onAddFloor={handleAddFloor}
          onLineThicknessChange={handleLineThicknessChange}
          onLineColorChange={handleLineColorChange}
          onShowMeasurementGuide={() => setShowMeasurementGuide(true)}
        />
        
        {/* Render tooltip directly within the canvas space */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-50">
          <DistanceTooltip
            startPoint={drawingState?.startPoint}
            currentPoint={drawingState?.currentPoint}
            isVisible={isTooltipVisible}
            position={drawingState?.cursorPosition}
            midPoint={drawingState?.midPoint}
            currentZoom={drawingState?.currentZoom}
          />
        </div>
        
        {/* Measurement guide modal */}
        <MeasurementGuideModal
          open={showMeasurementGuide}
          onOpenChange={(open) => {
            if (!open) {
              // Handle closing with "don't show again" preference
              const checkbox = document.getElementById("dont-show-again") as HTMLInputElement;
              handleCloseMeasurementGuide(checkbox?.checked || false);
            } else {
              setShowMeasurementGuide(true);
            }
          }}
        />
      </div>
    </LoadingErrorWrapper>
  );
};
