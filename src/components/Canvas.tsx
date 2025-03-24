
/**
 * Main Canvas component for floor plan drawing
 * Orchestrates the canvas setup, grid creation, and drawing tools
 * @module Canvas
 */
import { useEffect, useState, useRef } from "react";
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
  // Track initialization with refs instead of module-level variables
  const appInitializedRef = useRef(false);
  const initialDataLoadedRef = useRef(false);
  const isFirstMountRef = useRef(true);
  const gridCreatedRef = useRef(false);
  
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

  // Force straightLine tool on initial load
  useEffect(() => {
    if (isFirstMountRef.current && !isLoading && debugInfo.canvasInitialized) {
      console.log("Setting initial tool to straightLine");
      handleToolChange("straightLine");
      isFirstMountRef.current = false;
    }
  }, [isLoading, debugInfo.canvasInitialized, handleToolChange]);

  // Log drawing state for debugging when relevant changes occur
  useEffect(() => {
    if (drawingState?.isDrawing) {
      console.log("Drawing state updated in Canvas:", {
        isDrawing: drawingState.isDrawing,
        startPoint: drawingState.startPoint,
        currentPoint: drawingState.currentPoint,
        tool
      });
    }
  }, [drawingState?.isDrawing, drawingState?.startPoint, drawingState?.currentPoint, tool]);

  // Load initial data only once across all renders
  useEffect(() => {
    // Skip initialization if already done or component is remounting
    if (!isFirstMountRef.current || (appInitializedRef.current && initialDataLoadedRef.current)) {
      return;
    }
    
    // Record performance timing
    const startTime = performance.now();
    setLoadTimes(prev => ({ ...prev, startTime }));
    
    console.log("Loading initial data");
    loadData();
    appInitializedRef.current = true;
    initialDataLoadedRef.current = true;
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
    if (debugInfo.gridCreated && loadTimes.gridCreated === 0 && !gridCreatedRef.current) {
      setLoadTimes(prev => ({ 
        ...prev, 
        gridCreated: performance.now() - prev.startTime 
      }));
      gridCreatedRef.current = true;
    }
  }, [debugInfo, loadTimes]);

  // Determine tooltip visibility - show when drawing or in select mode with an active selection
  const isTooltipVisible = 
    // Always show during active drawing with straightLine or room tools
    (drawingState?.isDrawing && (tool === "straightLine" || tool === "room")) ||
    // Also show when in select mode and actively manipulating a line
    (tool === "select" && drawingState?.isDrawing);
  
  // Log tooltip visibility for debugging
  useEffect(() => {
    console.log("Tooltip visibility check:", {
      isDrawing: !!drawingState?.isDrawing,
      tool,
      isVisible: isTooltipVisible
    });
  }, [drawingState?.isDrawing, tool, isTooltipVisible]);

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
        
        {/* Render tooltip in a fixed position relative to the viewport */}
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
