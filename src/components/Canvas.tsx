
/**
 * Main Canvas component for floor plan drawing
 * Orchestrates the canvas setup, grid creation, and drawing tools
 * @module Canvas
 */
import { useEffect, useState, useMemo } from "react";
import { LoadingErrorWrapper } from "./LoadingErrorWrapper";
import { CanvasLayout } from "./CanvasLayout";
import { CanvasController } from "./CanvasController";
import { DistanceTooltip } from "./DistanceTooltip";

// Track application-wide initialization
let appInitialized = false;
// Track whether initial data has been loaded
let initialDataLoaded = false;
// Track if the current render is the first mount
let isFirstMount = true;
// Track if grid has been created
let gridCreated = false;

/**
 * Main Canvas component for floor plan drawing
 * Handles canvas setup, grid creation, and drawing tools
 * @returns {JSX.Element} Rendered component
 */
export const Canvas = () => {
  // Define all hooks at the top level, never conditionally
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

  // Log drawing state for debugging when relevant changes occur
  useEffect(() => {
    if (drawingState?.isDrawing) {
      console.log("Drawing state updated:", 
        drawingState.isDrawing, 
        drawingState.startPoint, 
        drawingState.currentPoint
      );
    }
  }, [drawingState?.isDrawing, drawingState?.startPoint, drawingState?.currentPoint]);

  // Memoize the tooltip component to prevent unnecessary re-renders
  const tooltipComponent = useMemo(() => (
    <DistanceTooltip
      startPoint={drawingState?.startPoint}
      currentPoint={drawingState?.currentPoint}
      isVisible={!!drawingState?.isDrawing && (tool === "straightLine" || tool === "room")}
      position={drawingState?.cursorPosition || { x: 0, y: 0 }}
    />
  ), [drawingState, tool]);

  // Load initial data only once across all renders
  useEffect(() => {
    // Skip initialization if already done or component is remounting
    if (!isFirstMount || (appInitialized && initialDataLoaded)) {
      return;
    }
    
    // Record performance timing
    const startTime = performance.now();
    setLoadTimes(prev => ({ ...prev, startTime }));
    
    console.log("Loading initial data");
    loadData();
    appInitialized = true;
    initialDataLoaded = true;
    isFirstMount = false; // Mark first mount as complete
  }, [loadData]);
  
  // Track debug info changes for performance metrics - only update when values change
  useEffect(() => {
    if (debugInfo.canvasInitialized && loadTimes.canvasReady === 0) {
      setLoadTimes(prev => ({ 
        ...prev, 
        canvasReady: performance.now() - prev.startTime 
      }));
    }
    
    // Only log first time grid is created
    if (debugInfo.gridCreated && loadTimes.gridCreated === 0 && !gridCreated) {
      setLoadTimes(prev => ({ 
        ...prev, 
        gridCreated: performance.now() - prev.startTime 
      }));
      gridCreated = true;
    }
  }, [debugInfo, loadTimes]);

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
        
        {/* Always render tooltip in a fixed position relative to the viewport */}
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
          {tooltipComponent}
        </div>
      </div>
    </LoadingErrorWrapper>
  );
};
