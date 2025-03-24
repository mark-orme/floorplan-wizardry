
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
  // Track initialization with refs instead of module-level variables
  const appInitializedRef = useRef(false);
  const initialDataLoadedRef = useRef(false);
  const isFirstMountRef = useRef(true);
  
  // Define all hooks at the top level, never conditionally
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

  // We now default to select tool on initial load
  useEffect(() => {
    if (isFirstMountRef.current && !isLoading && debugInfo.canvasInitialized) {
      if (process.env.NODE_ENV === 'development') {
        console.log("Using default tool: select");
      }
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
    
    if (process.env.NODE_ENV === 'development') {
      console.log("Loading initial data");
    }
    loadData();
    appInitializedRef.current = true;
    initialDataLoadedRef.current = true;
  }, [loadData]);

  // Determine tooltip visibility - show when drawing or in select mode with an active selection
  const isTooltipVisible = 
    // Always show during active drawing with straightLine or room tools
    (drawingState?.isDrawing && (tool === "straightLine" || tool === "room")) ||
    // Also show when in select mode and actively manipulating a line
    (tool === "select" && drawingState?.isDrawing);
  
  // Log tooltip visibility for debugging
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log("Tooltip visibility check:", {
        isDrawing: !!drawingState?.isDrawing,
        tool,
        isVisible: isTooltipVisible
      });
    }
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
