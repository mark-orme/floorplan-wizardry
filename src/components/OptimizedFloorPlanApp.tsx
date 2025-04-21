
import React, { useCallback, useMemo } from 'react';
import { OptimizedCanvasController } from './OptimizedCanvasController';
import { useOptimizedFloorPlanCanvas } from '@/hooks/useOptimizedFloorPlanCanvas';
import { EnhancedMemoizedPaperSizeSelector } from './canvas/paper/EnhancedMemoizedPaperSizeSelector';
import { MemoizedToolIndicator } from './canvas/tools/MemoizedToolIndicator';
import { DrawingMode } from '@/constants/drawingModes';
import { usePaperSizeManager } from '@/hooks/usePaperSizeManager';

interface OptimizedFloorPlanAppProps {
  initialTool?: DrawingMode;
  initialLineColor?: string;
  initialLineThickness?: number;
  showGrid?: boolean;
}

export const OptimizedFloorPlanApp: React.FC<OptimizedFloorPlanAppProps> = React.memo(({
  initialTool = DrawingMode.SELECT,
  initialLineColor = "#000000",
  initialLineThickness = 2,
  showGrid = true
}) => {
  // Use our optimized floor plan canvas hook
  const {
    fabricCanvasRef,
    tool,
    lineColor,
    lineThickness,
    canvasZoom,
    layers,
    activeLayerId,
    calculatedArea,
    handleCanvasReady,
    handleCanvasError,
    calculateArea,
    performanceMetrics
  } = useOptimizedFloorPlanCanvas({
    initialTool,
    initialLineColor,
    initialLineThickness
  });
  
  // Use paper size manager
  const { 
    currentPaperSize, 
    paperSizes, 
    infiniteCanvas, 
    changePaperSize, 
    toggleInfiniteCanvas 
  } = usePaperSizeManager({ 
    fabricCanvasRef 
  });
  
  // Memoized handlers
  const handleAreaCalculation = useCallback(() => {
    calculateArea();
  }, [calculateArea]);
  
  // Memoized components render based on data
  const areaDisplay = useMemo(() => (
    <div className="absolute top-4 right-4 bg-white/80 px-3 py-2 rounded-md shadow-md">
      <div className="text-sm font-medium">
        Area: {calculatedArea.areaM2 > 0 
          ? `${calculatedArea.areaM2.toFixed(2)} m²` 
          : 'Not calculated'}
      </div>
    </div>
  ), [calculatedArea.areaM2]);
  
  const calculateButton = useMemo(() => (
    <button
      onClick={handleAreaCalculation}
      className="absolute bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md shadow-md text-sm"
    >
      Calculate Area
    </button>
  ), [handleAreaCalculation]);
  
  // Conditionally render performance metrics in development
  const performanceDisplay = useMemo(() => {
    if (process.env.NODE_ENV !== 'development') return null;
    
    return (
      <div className="absolute bottom-16 right-4 bg-white/80 text-xs p-2 rounded shadow">
        <div>FPS: {performanceMetrics?.fps || 0}</div>
        <div>Objects: {performanceMetrics?.objectCount || 0}</div>
        <div>Visible: {performanceMetrics?.visibleObjectCount || 0}</div>
      </div>
    );
  }, [performanceMetrics]);
  
  return (
    <div className="relative w-full h-full" data-testid="floor-plan-wrapper" data-canvas-ready={!!fabricCanvasRef.current}>
      <OptimizedCanvasController
        width={currentPaperSize.width}
        height={currentPaperSize.height}
        tool={tool}
        lineColor={lineColor}
        lineThickness={lineThickness}
        showGrid={showGrid}
        onCanvasReady={handleCanvasReady}
        onError={handleCanvasError}
        className="w-full h-full"
      />
      
      {/* Tool indicator */}
      <MemoizedToolIndicator activeTool={tool} />
      
      {/* Paper size selector */}
      <EnhancedMemoizedPaperSizeSelector
        currentPaperSize={currentPaperSize}
        paperSizes={paperSizes}
        infiniteCanvas={infiniteCanvas}
        onChangePaperSize={changePaperSize}
        onToggleInfiniteCanvas={toggleInfiniteCanvas}
      />
      
      {/* Area display and calculation button */}
      {areaDisplay}
      {calculateButton}
      
      {/* Performance metrics */}
      {performanceDisplay}
    </div>
  );
});

OptimizedFloorPlanApp.displayName = 'OptimizedFloorPlanApp';

export default OptimizedFloorPlanApp;
