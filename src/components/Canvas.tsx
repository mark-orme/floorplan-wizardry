
/**
 * Main Canvas component for floor plan drawing
 * Orchestrates the canvas setup, grid creation, and drawing tools
 * @module Canvas
 */
import { useEffect, useRef, useState } from "react";
import { LoadingErrorWrapper } from "./LoadingErrorWrapper";
import { CanvasLayout } from "./CanvasLayout";
import { CanvasControllerProvider, useCanvasController } from "./canvas/controller/CanvasController";
import { DistanceTooltip } from "./DistanceTooltip";
import { MeasurementGuideModal } from "./MeasurementGuideModal";
import { useMeasurementGuide } from "@/hooks/useMeasurementGuide";
import logger from "@/utils/logger";
import { toast } from "sonner";

interface CanvasProps {
  readonly?: boolean;
  'data-readonly'?: boolean;
}

/**
 * Inner Canvas component that uses the canvas controller context
 */
const CanvasInner = (props: CanvasProps) => {
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
    deleteSelectedObjects,
    handleLineThicknessChange,
    handleLineColorChange,
    drawingState,
    handleRetry
  } = useCanvasController();

  // Track initialization with refs 
  const isFirstMountRef = useRef<boolean>(true);
  const initTimeoutRef = useRef<number | null>(null);
  
  // Measurement guide modal state - using custom hook with safe default
  const { 
    showMeasurementGuide, 
    setShowMeasurementGuide,
    handleCloseMeasurementGuide
  } = useMeasurementGuide(tool); 
  
  // Ensure canvas initialization happens properly
  useEffect(() => {
    // Clear any existing timeout
    if (initTimeoutRef.current !== null) {
      window.clearTimeout(initTimeoutRef.current);
    }
    
    // Initialize after a short delay to ensure DOM is ready
    initTimeoutRef.current = window.setTimeout(() => {
      if (isFirstMountRef.current) {
        logger.info("Loading initial canvas data");
        loadData()
          .then(() => {
            // We default to select tool on initial load
            logger.info("Using default tool: select");
            handleToolChange("select");
            
            // Show a toast to indicate successful initialization
            toast.success("Canvas ready!", {
              id: "canvas-ready",
              duration: 3000
            });
          })
          .catch(error => {
            logger.error("Error initializing canvas:", error);
          })
          .finally(() => {
            isFirstMountRef.current = false;
          });
      }
    }, 800); // Slightly longer delay to ensure DOM is fully ready
    
    // Cleanup function
    return () => {
      if (initTimeoutRef.current !== null) {
        window.clearTimeout(initTimeoutRef.current);
      }
    };
  }, [loadData, handleToolChange]);

  // Improved tooltip visibility logic - show when drawing or in select mode with an active selection
  const isTooltipVisible = Boolean(
    // Always show during active drawing with straight line tools
    (drawingState?.isDrawing && (tool === "straightLine" || tool === "wall" || tool === "line")) ||
    // Show when hovering with these tools even if not actively drawing
    (!drawingState?.isDrawing && (tool === "straightLine" || tool === "wall" || tool === "line") && 
     drawingState?.cursorPosition != null && drawingState?.startPoint != null) ||
    // Also show when in select mode and actively manipulating objects
    (tool === "select" && drawingState?.isDrawing) ||
    // Show when selecting a line or wall
    (tool === "select" && drawingState?.selectionActive)
  );

  // Log tooltip state for debugging
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      logger.debug("Tooltip state:", { 
        isVisible: isTooltipVisible, 
        drawingState: drawingState,
        tool: tool 
      });
    }
  }, [isTooltipVisible, drawingState, tool]);

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
          onDelete={deleteSelectedObjects}
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

/**
 * Main Canvas component for floor plan drawing
 * Handles canvas setup, grid creation, and drawing tools
 * @returns {JSX.Element} Rendered component
 */
export const Canvas = (props: CanvasProps) => {
  // Error state to catch any initialization errors 
  const [errorState, setErrorState] = useState({ hasError: false, message: "" });
  
  try {
    return (
      <CanvasControllerProvider>
        <CanvasInner {...props} />
      </CanvasControllerProvider>
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error("Error rendering Canvas:", error);
    
    if (!errorState.hasError) {
      setErrorState({ hasError: true, message: errorMessage });
    }
    
    return (
      <LoadingErrorWrapper 
        isLoading={false} 
        hasError={true} 
        errorMessage={errorState.message}
        onRetry={() => window.location.reload()}
      >
        <div className="w-full h-full flex items-center justify-center">
          <p>Error initializing canvas: {errorState.message}</p>
        </div>
      </LoadingErrorWrapper>
    );
  }
};
