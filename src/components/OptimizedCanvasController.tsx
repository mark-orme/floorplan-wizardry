
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { OptimizedCanvas } from './OptimizedCanvas';
import { useVirtualizedCanvas } from '@/hooks/useVirtualizedCanvas';
import { useMemoizedDrawingComponents } from '@/hooks/useMemoizedDrawingComponents';
import { DrawingMode } from '@/constants/drawingModes';

// Create a type for props
interface OptimizedCanvasControllerProps {
  width?: number;
  height?: number;
  tool?: DrawingMode;
  lineColor?: string;
  lineThickness?: number;
  showGrid?: boolean;
  showGuide?: boolean;
  handleCloseGuide?: (dontShowAgain: boolean) => void;
  handleOpenGuideChange?: (open: boolean) => void;
  onCanvasReady?: (canvas: FabricCanvas) => void;
  onError?: (error: Error) => void;
  className?: string;
}

// React.memo for optimizing re-renders
export const OptimizedCanvasController = React.memo(({
  width = 800,
  height = 600,
  tool = DrawingMode.SELECT,
  lineColor = '#000000',
  lineThickness = 2,
  showGrid = true,
  showGuide = false,
  handleCloseGuide = () => {},
  handleOpenGuideChange = () => {},
  onCanvasReady,
  onError,
  className
}: OptimizedCanvasControllerProps) => {
  // Reference to the fabric canvas
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  
  // Use virtualized canvas for performance
  const { performanceMetrics, needsVirtualization, refreshVirtualization } = useVirtualizedCanvas(
    fabricCanvasRef,
    { enabled: true }
  );
  
  // Memoized handler for canvas ready event
  const handleCanvasReady = useCallback((canvas: FabricCanvas) => {
    fabricCanvasRef.current = canvas;
    refreshVirtualization();
    
    if (onCanvasReady) {
      onCanvasReady(canvas);
    }
  }, [onCanvasReady, refreshVirtualization]);
  
  // Use memoized components
  const { brushPreview, measurementGuide } = useMemoizedDrawingComponents({
    fabricCanvas: fabricCanvasRef.current,
    tool,
    lineColor,
    lineThickness,
    showGuide,
    handleCloseGuide,
    handleOpenGuideChange
  });
  
  // Memoized performance metrics display
  const perfMetricsDisplay = useMemo(() => {
    if (process.env.NODE_ENV === 'production') return null;
    
    return (
      <div className="absolute bottom-2 right-2 bg-white/80 text-xs p-1 rounded shadow">
        FPS: {performanceMetrics.fps} | 
        Objects: {performanceMetrics.objectCount} | 
        Visible: {performanceMetrics.visibleObjectCount} | 
        Virtual: {needsVirtualization ? 'Yes' : 'No'}
      </div>
    );
  }, [performanceMetrics, needsVirtualization]);
  
  return (
    <div className={`relative ${className || ''}`} data-testid="optimized-canvas-controller">
      <OptimizedCanvas
        width={width}
        height={height}
        onCanvasReady={handleCanvasReady}
        onError={onError}
        tool={tool}
        lineColor={lineColor}
        lineThickness={lineThickness}
        showGrid={showGrid}
      />
      
      {brushPreview}
      {measurementGuide}
      {perfMetricsDisplay}
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function to prevent unnecessary re-renders
  // Only re-render if these specific props change
  return (
    prevProps.width === nextProps.width &&
    prevProps.height === nextProps.height &&
    prevProps.tool === nextProps.tool &&
    prevProps.lineColor === nextProps.lineColor &&
    prevProps.lineThickness === nextProps.lineThickness &&
    prevProps.showGrid === nextProps.showGrid &&
    prevProps.showGuide === nextProps.showGuide &&
    prevProps.className === nextProps.className
  );
});

OptimizedCanvasController.displayName = 'OptimizedCanvasController';

export default OptimizedCanvasController;
