
import { useCallback } from "react";
import { LoadingErrorWrapper } from "./LoadingErrorWrapper";
import { CanvasLayout } from "./CanvasLayout";
import { CanvasController } from "./CanvasController";

/**
 * Main Canvas component for floor plan drawing
 * Handles canvas setup, grid creation, and drawing tools
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
