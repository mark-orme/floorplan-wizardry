
/**
 * Main Canvas component for floor plan drawing
 * Orchestrates the canvas setup, grid creation, and drawing tools
 * @module Canvas
 */
import { useCallback, useEffect } from "react";
import { LoadingErrorWrapper } from "./LoadingErrorWrapper";
import { CanvasLayout } from "./CanvasLayout";
import { CanvasController } from "./CanvasController";

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
    saveCanvas
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
    </LoadingErrorWrapper>
  );
};
