
/**
 * Optimized Canvas Component
 * Performance-optimized canvas with virtualization and memoization
 */
import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { useCanvasOptimization } from '@/hooks/useCanvasOptimization';
import { OptimizedGridLayer } from '@/components/canvas/OptimizedGridLayer';
import { canvasLogger } from '@/utils/logger';
import { DrawingMode } from '@/constants/drawingModes';

interface OptimizedCanvasProps {
  width?: number;
  height?: number;
  onCanvasReady?: (canvas: FabricCanvas) => void;
  onError?: (error: Error) => void;
  tool?: DrawingMode;
  lineColor?: string;
  lineThickness?: number;
  showGrid?: boolean;
  className?: string;
}

export const OptimizedCanvas = React.memo(({
  width = 800,
  height = 600,
  onCanvasReady,
  onError,
  tool = DrawingMode.SELECT,
  lineColor = '#000000',
  lineThickness = 2,
  showGrid = true,
  className = ''
}: OptimizedCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Performance optimization hook
  const { 
    performanceMetrics,
    needsVirtualization,
    forceOptimize
  } = useCanvasOptimization({
    fabricCanvasRef,
    viewportWidth: width,
    viewportHeight: height
  });
  
  // Memoized canvas initialization
  const initializeCanvas = useCallback(() => {
    if (!canvasRef.current) return;
    
    try {
      // Create Fabric.js canvas
      const canvas = new FabricCanvas(canvasRef.current, {
        width,
        height,
        backgroundColor: '#FFFFFF',
        selection: tool === DrawingMode.SELECT,
        preserveObjectStacking: true,
        renderOnAddRemove: false, // Optimize rendering
        enableRetinaScaling: true
      });
      
      // Store canvas in ref
      fabricCanvasRef.current = canvas;
      
      // Configure for current tool
      configureForTool(canvas, tool);
      
      // Mark as initialized
      setIsInitialized(true);
      
      // Call ready callback
      if (onCanvasReady) {
        onCanvasReady(canvas);
      }
      
      canvasLogger.info('Canvas initialized successfully');
      return canvas;
    } catch (error) {
      canvasLogger.error('Failed to initialize canvas', error);
      if (onError && error instanceof Error) {
        onError(error);
      }
      return null;
    }
  }, [width, height, tool, onCanvasReady, onError]);
  
  // Configure canvas for specific tool
  const configureForTool = useCallback((canvas: FabricCanvas, selectedTool: DrawingMode) => {
    if (!canvas) return;
    
    // Reset canvas modes
    canvas.isDrawingMode = false;
    canvas.selection = false;
    
    // Configure based on tool
    switch (selectedTool) {
      case DrawingMode.SELECT:
        canvas.selection = true;
        canvas.defaultCursor = 'default';
        canvas.hoverCursor = 'move';
        break;
        
      case DrawingMode.DRAW:
        canvas.isDrawingMode = true;
        if (canvas.freeDrawingBrush) {
          canvas.freeDrawingBrush.color = lineColor;
          canvas.freeDrawingBrush.width = lineThickness;
        }
        canvas.defaultCursor = 'crosshair';
        break;
        
      case DrawingMode.STRAIGHT_LINE:
        canvas.defaultCursor = 'crosshair';
        canvas.hoverCursor = 'crosshair';
        break;
        
      default:
        canvas.defaultCursor = 'default';
    }
    
    canvasLogger.debug('Canvas configured for tool', { tool: selectedTool });
  }, [lineColor, lineThickness]);
  
  // Initialize canvas on mount
  useEffect(() => {
    const canvas = initializeCanvas();
    
    // Clean up on unmount
    return () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
      }
    };
  }, [initializeCanvas]);
  
  // Handle tool changes
  useEffect(() => {
    if (fabricCanvasRef.current) {
      configureForTool(fabricCanvasRef.current, tool);
    }
  }, [tool, configureForTool]);
  
  // Handle line appearance changes
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !canvas.freeDrawingBrush) return;
    
    canvas.freeDrawingBrush.color = lineColor;
    canvas.freeDrawingBrush.width = lineThickness;
  }, [lineColor, lineThickness]);
  
  // Re-optimize when needed
  useEffect(() => {
    if (isInitialized) {
      forceOptimize();
    }
  }, [isInitialized, forceOptimize]);
  
  // Display performance metrics in development
  const perfDebug = useMemo(() => process.env.NODE_ENV !== 'production' && (
    <div className="absolute bottom-2 left-2 text-xs text-gray-500 bg-white/80 p-1 rounded">
      FPS: {performanceMetrics.fps} | 
      Objects: {performanceMetrics.objectCount} | 
      Visible: {performanceMetrics.visibleObjectCount} |
      Virtual: {needsVirtualization ? 'Yes' : 'No'}
    </div>
  ), [performanceMetrics, needsVirtualization]);
  
  return (
    <div className={`relative ${className}`}>
      <canvas 
        ref={canvasRef}
        className="border border-gray-200 shadow"
        data-testid="optimized-canvas"
      />
      
      {isInitialized && fabricCanvasRef.current && (
        <OptimizedGridLayer
          canvas={fabricCanvasRef.current}
          showGrid={showGrid}
        />
      )}
      
      {perfDebug}
    </div>
  );
});

OptimizedCanvas.displayName = 'OptimizedCanvas';

export default OptimizedCanvas;
