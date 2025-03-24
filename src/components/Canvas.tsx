
/**
 * Main Canvas component for floor plan drawing
 * Orchestrates the canvas setup, grid creation, and drawing tools
 * @module Canvas
 */
import { useCallback, useEffect } from "react";
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
    loadData,
    handleFloorSelect,
    handleAddFloor,
    handleToolChange,
    handleUndo,
    handleRedo,
    handleZoom,
    clearCanvas,
    saveCanvas,
    drawingState
  } = CanvasController();

  // Load initial data when component mounts
  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRetry = useCallback(() => {
    loadData();
  }, [loadData]);

  return (
    <LoadingErrorWrapper
      isLoading={isLoading}
      hasError={hasError}
      errorMessage={errorMessage}
      onRetry={handleRetry}
    >
      <div className="relative">
        <CanvasLayout
          tool={tool}
          gia={gia}
          floorPlans={floorPlans}
          currentFloor={currentFloor}
          debugInfo={debugInfo}
          canvasRef={canvasRef}
          onToolChange={handleToolChange}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onZoom={handleZoom}
          onClear={clearCanvas}
          onSave={saveCanvas}
          onFloorSelect={handleFloorSelect}
          onAddFloor={handleAddFloor}
        />
        
        {/* Distance tooltip overlay */}
        <DistanceTooltip
          startPoint={drawingState?.startPoint}
          currentPoint={drawingState?.currentPoint}
          isVisible={drawingState?.isDrawing && tool === "straightLine"}
          position={drawingState?.cursorPosition || { x: 0, y: 0 }}
        />
      </div>
    </LoadingErrorWrapper>
  );
};
