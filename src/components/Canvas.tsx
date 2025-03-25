
/**
 * Main Canvas component for floor plan drawing
 * Orchestrates the canvas setup, grid creation, and drawing tools
 * @module Canvas
 */
import { useEffect, useRef, useState } from "react";
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
  // Track initialization with refs instead of module-level variables - ALL refs must be declared first
  const appInitializedRef = useRef<boolean>(false);
  const initialDataLoadedRef = useRef<boolean>(false);
  const isFirstMountRef = useRef<boolean>(true);
  const controllerRef = useRef<ReturnType<typeof CanvasController> | null>(null);
  
  // IMPORTANT: All useState calls must be declared unconditionally at the top level after all refs
  const [initialized, setInitialized] = useState(false);
  const [controllerLoaded, setControllerLoaded] = useState(false);
  const [errorState, setErrorState] = useState({ hasError: false, message: "" });
  const [tool, setToolState] = useState<string>("select"); // Default tool state for safety
  
  // Initialize controller only once using useEffect to ensure consistent hook order
  useEffect(() => {
    if (!controllerRef.current) {
      try {
        controllerRef.current = CanvasController();
        setInitialized(true);
        setControllerLoaded(true);
        // Set initial tool state after controller is loaded
        if (controllerRef.current && controllerRef.current.tool) {
          setToolState(controllerRef.current.tool);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        logger.error("Error initializing canvas controller:", error);
        setErrorState({ hasError: true, message: errorMessage });
      }
    }
  }, []);
  
  // Update tool state when controller tool changes
  useEffect(() => {
    if (controllerRef.current && controllerRef.current.tool) {
      setToolState(controllerRef.current.tool);
    }
  }, [controllerLoaded]);
  
  // Measurement guide modal state - using custom hook with safe default
  const { 
    showMeasurementGuide, 
    setShowMeasurementGuide,
    handleCloseMeasurementGuide
  } = useMeasurementGuide(tool as any); // Safe cast with default value
  
  // Bail out early if controller isn't ready yet or if there's an error
  if (errorState.hasError) {
    return <LoadingErrorWrapper isLoading={false} hasError={true} errorMessage={errorState.message} onRetry={() => window.location.reload()}>
      <div className="w-full h-full flex items-center justify-center">
        <p>Error initializing canvas: {errorState.message}</p>
      </div>
    </LoadingErrorWrapper>;
  }
  
  if (!controllerRef.current || !controllerLoaded) {
    return <LoadingErrorWrapper isLoading={true} hasError={false} errorMessage="" onRetry={() => {}}>
      <div className="w-full h-full flex items-center justify-center">
        <p>Initializing canvas...</p>
      </div>
    </LoadingErrorWrapper>;
  }
  
  // Extract controller properties - only after controller is guaranteed to exist
  const {
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
  
  // We now default to select tool on initial load
  useEffect(() => {
    if (isFirstMountRef.current && !isLoading && debugInfo?.canvasInitialized) {
      logger.info("Using default tool: select");
      handleToolChange("select");
      isFirstMountRef.current = false;
    }
  }, [isLoading, debugInfo?.canvasInitialized, handleToolChange]);

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
