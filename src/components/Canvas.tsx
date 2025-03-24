
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
import { CanvasProvider } from "@/context/CanvasContext";

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
  const canvasController = CanvasController();
  
  const {
    tool,
    setTool,
    zoomLevel,
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
  } = canvasController;

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
    
    console.log("Loading initial data");
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
    console.log("Tooltip visibility check:", {
      isDrawing: !!drawingState?.isDrawing,
      tool,
      isVisible: isTooltipVisible
    });
  }, [drawingState?.isDrawing, tool, isTooltipVisible]);

  // Create a complete context value with all required properties
  const contextValue = {
    tool,
    setTool,
    zoomLevel,
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
    drawingState,
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
    handleRetry
  };

  return (
    <CanvasProvider value={contextValue}>
      <LoadingErrorWrapper
        isLoading={isLoading}
        hasError={hasError}
        errorMessage={errorMessage}
        onRetry={handleRetry}
      >
        <div className="relative w-full h-full">
          <CanvasLayout />
          
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
    </CanvasProvider>
  );
};
