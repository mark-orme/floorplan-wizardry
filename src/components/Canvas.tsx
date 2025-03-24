
/**
 * Main Canvas component for floor plan drawing
 * Orchestrates the canvas setup, grid creation, and drawing tools
 * @module Canvas
 */
import { useEffect, useState, useCallback, useMemo } from "react";
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
  // Performance monitoring
  const [loadTimes, setLoadTimes] = useState({
    startTime: performance.now(),
    canvasReady: 0,
    gridCreated: 0
  });
  
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
    drawingState,
    handleRetry
  } = CanvasController();

  // Load initial data only once
  useEffect(() => {
    // Record performance timing
    const startTime = performance.now();
    setLoadTimes(prev => ({ ...prev, startTime }));
    
    loadData();
  }, [loadData]);
  
  // Track debug info changes for performance metrics - only update when values change
  useEffect(() => {
    if (debugInfo.canvasInitialized && loadTimes.canvasReady === 0) {
      setLoadTimes(prev => ({ 
        ...prev, 
        canvasReady: performance.now() - prev.startTime 
      }));
    }
    
    if (debugInfo.gridCreated && loadTimes.gridCreated === 0) {
      setLoadTimes(prev => ({ 
        ...prev, 
        gridCreated: performance.now() - prev.startTime 
      }));
    }
  }, [debugInfo, loadTimes]);

  // Memoize the tooltip component to prevent unnecessary re-renders
  const tooltipComponent = useMemo(() => (
    <DistanceTooltip
      startPoint={drawingState?.startPoint}
      currentPoint={drawingState?.currentPoint}
      isVisible={drawingState?.isDrawing && tool === "straightLine"}
      position={drawingState?.cursorPosition || { x: 0, y: 0 }}
    />
  ), [drawingState, tool]);

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
        
        {tooltipComponent}
      </div>
    </LoadingErrorWrapper>
  );
};
