
/**
 * Main Canvas component for floor plan drawing
 * Orchestrates the canvas setup, grid creation, and drawing tools
 * @module Canvas
 */
import { useEffect, useRef } from "react";
import { LoadingErrorWrapper } from "./LoadingErrorWrapper";
import { CanvasLayout } from "./CanvasLayout";
import { CanvasController } from "./CanvasController";
import { DistanceTooltip } from "./DistanceTooltip";

/**
 * Main Canvas component for floor plan drawing
 * Handles canvas setup, grid creation, and drawing tools
 * @returns {JSX.Element} Rendered component
 */
export const Canvas = () => {
  // Track initialization with refs
  const appInitializedRef = useRef(false);
  const initialDataLoadedRef = useRef(false);
  const isFirstMountRef = useRef(true);
  
  // Get all controller hooks and state
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
  } = CanvasController();

  // Default to select tool on initial load
  useEffect(() => {
    if (isFirstMountRef.current && !isLoading && debugInfo.canvasInitialized) {
      console.log("Canvas initialized, setting default tool: select");
      handleToolChange("select");
      isFirstMountRef.current = false;
    }
  }, [isLoading, debugInfo.canvasInitialized, handleToolChange]);

  // Load initial data once
  useEffect(() => {
    // Skip if already initialized
    if (!isFirstMountRef.current || (appInitializedRef.current && initialDataLoadedRef.current)) {
      return;
    }
    
    console.log("Loading initial data for canvas");
    loadData().catch(err => console.error("Error loading initial data:", err));
    appInitializedRef.current = true;
    initialDataLoadedRef.current = true;
  }, [loadData]);

  // Determine tooltip visibility conditions
  const isTooltipVisible = 
    (drawingState?.isDrawing && (tool === "straightLine" || tool === "room")) ||
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
        />
        
        {/* Tooltip for measurements */}
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-50">
          <DistanceTooltip
            startPoint={drawingState?.startPoint}
            currentPoint={drawingState?.currentPoint}
            isVisible={isTooltipVisible}
            position={drawingState?.cursorPosition}
            midPoint={drawingState?.midPoint}
          />
        </div>
      </div>
    </LoadingErrorWrapper>
  );
};
