
import React, { useRef, useEffect, useMemo, useCallback } from "react";
import { EnhancedCanvas } from "@/components/EnhancedCanvas";
import { CanvasControllerProvider } from "@/components/canvas/controller/CanvasController";
import { useEnhancedSnapToGrid } from "@/hooks/useEnhancedSnapToGrid";
import { useTouchGestures } from "@/hooks/useTouchGestures";
import { usePaperSizeManager } from "@/hooks/usePaperSizeManager";
import { DrawingLayers } from "@/components/canvas/DrawingLayers";
import { DrawingMode } from "@/constants/drawingModes";
import { CanvasDiagnostics } from "@/components/canvas/CanvasDiagnostics";
import { useFloorPlanCanvas } from "@/hooks/useFloorPlanCanvas";
import { AreaCalculationDisplay } from "./AreaCalculationDisplay";
import { MemoizedToolIndicator } from "../canvas/tools/MemoizedToolIndicator";
import { CalculateAreaButton } from "./CalculateAreaButton";
import { useRealtimeCanvasSync } from "@/hooks/useRealtimeCanvasSync";
import { CanvasCollaborationIndicator } from "@/components/canvas/app/CanvasCollaborationIndicator";
import { EnhancedMemoizedPaperSizeSelector } from "../canvas/paper/EnhancedMemoizedPaperSizeSelector";
import { useVirtualizedCanvas } from "@/hooks/useVirtualizedCanvas";

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

export const FloorPlanCanvasEnhanced: React.FC<FloorPlanCanvasEnhancedProps> = React.memo(({
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
  
  // Use virtualized canvas for performance optimization
  const { performanceMetrics, refreshVirtualization } = useVirtualizedCanvas(
    fabricCanvasRef,
    { enabled: true }
  );
  
  // Set up real-time sync if enabled - with memoized handlers
  const syncCanvas = useCallback(() => {
    // Use transferable objects for better performance
    if (fabricCanvasRef.current) {
      refreshVirtualization();
    }
  }, [refreshVirtualization]);
  
  const { collaborators } = useRealtimeCanvasSync({
    canvas: fabricCanvasRef.current,
    enabled: enableSync,
    onRemoteUpdate: () => {
      console.log(`Canvas updated at ${new Date().toLocaleString()}`);
      refreshVirtualization();
    }
  });
  
  // Use paper size manager hook
  const { currentPaperSize, paperSizes, infiniteCanvas, changePaperSize, toggleInfiniteCanvas } = 
    usePaperSizeManager({ fabricCanvasRef });
  
  // Memoized handlers
  const handleZoomChange = useCallback((zoom: number) => {
    setCanvasZoom(zoom);
    refreshVirtualization();
  }, [setCanvasZoom, refreshVirtualization]);
  
  const memoizedCalculateArea = useCallback(() => {
    calculateArea();
  }, [calculateArea]);
  
  // Memoized performance metric display
  const performanceDisplay = useMemo(() => {
    if (process.env.NODE_ENV === 'production') return null;
    
    return (
      <div className="absolute bottom-16 right-4 bg-white/80 text-xs p-2 rounded shadow">
        <div>FPS: {performanceMetrics.fps}</div>
        <div>Objects: {performanceMetrics.objectCount}</div>
        <div>Visible: {performanceMetrics.visibleObjectCount}</div>
      </div>
    );
  }, [performanceMetrics]);
  
  return (
    <div 
      ref={canvasContainerRef}
      className="h-full w-full relative overflow-hidden"
      data-testid="enhanced-floor-plan-wrapper"
      data-canvas-ready={!!fabricCanvasRef.current}
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
        
        {/* Paper size controls - using optimized version */}
        <EnhancedMemoizedPaperSizeSelector
          currentPaperSize={currentPaperSize}
          paperSizes={paperSizes}
          infiniteCanvas={infiniteCanvas}
          onChangePaperSize={changePaperSize}
          onToggleInfiniteCanvas={toggleInfiniteCanvas}
        />
        
        {/* Tool selection indicators - using memoized version */}
        <MemoizedToolIndicator activeTool={tool} />
        
        {/* Calculate Area button - extracted to component */}
        <CalculateAreaButton onClick={memoizedCalculateArea} />
        
        {/* Performance metrics display */}
        {performanceDisplay}
      </CanvasControllerProvider>
    </div>
  );
});

FloorPlanCanvasEnhanced.displayName = 'FloorPlanCanvasEnhanced';

export default FloorPlanCanvasEnhanced;
