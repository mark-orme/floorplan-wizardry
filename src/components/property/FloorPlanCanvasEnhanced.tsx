
import React, { useRef, useEffect, useMemo, useCallback } from "react";
import { EnhancedCanvas } from "@/components/EnhancedCanvas";
import { CanvasControllerProvider } from "@/components/canvas/controller/CanvasController";
import { useEnhancedSnapToGrid } from "@/hooks/useEnhancedSnapToGrid";
import { useTouchGestures } from "@/hooks/useTouchGestures";
import { usePaperSizeManager } from "@/hooks/usePaperSizeManager";
import { DrawingLayers } from "@/components/canvas/DrawingLayers";
import { DrawingMode } from "@/constants/drawingModes";
import { PaperSizeSelector } from "@/components/canvas/PaperSizeSelector";
import { CanvasDiagnostics } from "@/components/canvas/CanvasDiagnostics";
import { useFloorPlanCanvas } from "@/hooks/useFloorPlanCanvas";
import { AreaCalculationDisplay } from "./AreaCalculationDisplay";
import { MemoizedToolIndicator } from "../canvas/tools/MemoizedToolIndicator";
import { CalculateAreaButton } from "./CalculateAreaButton";
import { useRealtimeCanvasSync } from "@/hooks/useRealtimeCanvasSync";
import { CanvasCollaborationIndicator } from "@/components/canvas/app/CanvasCollaborationIndicator";
import { MemoizedPaperSizeSelector } from "../canvas/paper/MemoizedPaperSizeSelector";

interface FloorPlanCanvasEnhancedProps {
  /** Callback for canvas error */
  onCanvasError?: (error: Error) => void;
  /** Initial tool */
  initialTool?: DrawingMode;
  /** Initial line color */
  initialLineColor?: string;
  /** Initial line thickness */
  initialLineThickness?: number;
  /** Whether to show grid */
  showGrid?: boolean;
  /** Whether to enable realtime sync */
  enableSync?: boolean;
}

export const FloorPlanCanvasEnhanced: React.FC<FloorPlanCanvasEnhancedProps> = ({
  onCanvasError,
  initialTool = DrawingMode.SELECT,
  initialLineColor = "#000000",
  initialLineThickness = 2,
  showGrid = true,
  enableSync = true
}) => {
  // Canvas container reference
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  
  // Use our extracted hook for canvas operations
  const {
    fabricCanvasRef,
    tool,
    lineColor,
    lineThickness,
    canvasZoom,
    setCanvasZoom,
    layers,
    setLayers,
    activeLayerId,
    setActiveLayerId,
    calculatedArea,
    handleCanvasReady,
    handleCanvasError,
    handleUndo,
    calculateArea
  } = useFloorPlanCanvas({
    initialTool,
    initialLineColor,
    initialLineThickness,
    onCanvasError
  });
  
  // Set up real-time sync if enabled - with memoized handlers
  const syncCanvas = useCallback((sender: string) => {
    // Implement sync logic with transferables
    // This will be called by the hook when changes are detected
  }, []);
  
  const { collaborators } = useRealtimeCanvasSync({
    canvas: fabricCanvasRef.current,
    enabled: enableSync,
    onRemoteUpdate: useCallback((sender: string, timestamp: number) => {
      console.log(`Canvas updated by ${sender} at ${new Date(timestamp).toLocaleString()}`);
    }, [])
  });
  
  // Sync canvas on significant changes
  useEffect(() => {
    if (enableSync && fabricCanvasRef.current) {
      const syncTimer = setTimeout(() => {
        syncCanvas('User');
      }, 1000);
      
      return () => clearTimeout(syncTimer);
    }
  }, [layers, activeLayerId, enableSync, syncCanvas]);
  
  // Use paper size manager hook
  const { currentPaperSize, paperSizes, infiniteCanvas, changePaperSize, toggleInfiniteCanvas } = 
    usePaperSizeManager({ fabricCanvasRef });
  
  // Memoized handlers
  const handleZoomChange = useCallback((zoom: number) => {
    setCanvasZoom(zoom);
  }, [setCanvasZoom]);
  
  const memoizedCalculateArea = useCallback(() => {
    calculateArea();
  }, [calculateArea]);
  
  return (
    <div 
      ref={canvasContainerRef}
      className="h-full w-full relative overflow-hidden"
      data-testid="enhanced-floor-plan-wrapper"
    >
      <CanvasControllerProvider>
        <EnhancedCanvas
          width={currentPaperSize.width}
          height={currentPaperSize.height}
          onCanvasReady={handleCanvasReady}
          onError={handleCanvasError}
          tool={tool}
          lineColor={lineColor}
          lineThickness={lineThickness}
          snapToGrid={true}
          autoStraighten={true}
          onZoomChange={handleZoomChange}
          onUndo={handleUndo}
          showGrid={showGrid}
          infiniteCanvas={infiniteCanvas}
          paperSize={infiniteCanvas ? undefined : currentPaperSize}
        />
        
        {/* Canvas diagnostics component */}
        {fabricCanvasRef.current && (
          <CanvasDiagnostics 
            canvas={fabricCanvasRef.current}
            currentTool={tool}
            runOnMount={true}
            monitoringInterval={30000}
          />
        )}
        
        {/* Layer management */}
        <DrawingLayers
          fabricCanvasRef={fabricCanvasRef}
          layers={layers}
          setLayers={setLayers}
          activeLayerId={activeLayerId}
          setActiveLayerId={setActiveLayerId}
        />
        
        {/* Collaboration indicator */}
        <CanvasCollaborationIndicator 
          collaborators={collaborators}
          enabled={enableSync}
        />
        
        {/* Area calculation display - extracted to component */}
        <AreaCalculationDisplay areaM2={calculatedArea.areaM2} />
        
        {/* Paper size controls - now using memoized version */}
        <MemoizedPaperSizeSelector
          currentPaperSize={currentPaperSize}
          paperSizes={paperSizes}
          infiniteCanvas={infiniteCanvas}
          onChangePaperSize={changePaperSize}
          onToggleInfiniteCanvas={toggleInfiniteCanvas}
        />
        
        {/* Tool selection indicators - now using memoized version */}
        <MemoizedToolIndicator activeTool={tool} />
        
        {/* Calculate Area button - extracted to component */}
        <CalculateAreaButton onClick={memoizedCalculateArea} />
      </CanvasControllerProvider>
    </div>
  );
};
