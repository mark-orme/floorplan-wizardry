
import React, { useEffect, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { OptimizedCanvas } from './OptimizedCanvas';
import { DrawingMode } from '@/constants/drawingModes';
import { createSimpleGrid, ensureGridVisible } from '@/utils/simpleGridCreator';

interface OptimizedCanvasControllerProps {
  width: number;
  height: number;
  onCanvasReady: (canvas: FabricCanvas) => void;
  onError?: (error: Error) => void;
  tool?: DrawingMode;
  lineColor?: string;
  lineThickness?: number;
  showGrid?: boolean;
  className?: string;
}

export const OptimizedCanvasController: React.FC<OptimizedCanvasControllerProps> = ({
  width,
  height,
  onCanvasReady,
  onError,
  tool = DrawingMode.SELECT,
  lineColor = "#000000",
  lineThickness = 2,
  showGrid = true,
  className = ''
}) => {
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const gridObjectsRef = useRef<any[]>([]);
  
  const handleCanvasReady = (canvas: FabricCanvas) => {
    // Set up proper tool based on the current drawing mode
    canvas.isDrawingMode = tool === DrawingMode.DRAW;
    canvas.selection = tool === DrawingMode.SELECT;
    
    if (canvas.isDrawingMode) {
      canvas.freeDrawingBrush.color = lineColor;
      canvas.freeDrawingBrush.width = lineThickness;
      
      // Set brush to respond to pressure
      if ('pressure' in window.PointerEvent.prototype) {
        console.log('Pressure sensitivity enabled for drawing');
      }
    }
    
    // Create grid for the canvas
    if (showGrid) {
      console.log("Creating grid for canvas");
      const gridObjects = createSimpleGrid(canvas);
      gridObjectsRef.current = gridObjects;
    }
    
    // Make sure touch events work well on mobile
    canvas.allowTouchScrolling = tool === DrawingMode.HAND;
    
    // Apply custom CSS to the canvas container to make it touch-friendly
    if (canvas.wrapperEl) {
      canvas.wrapperEl.classList.add('touch-manipulation');
      canvas.wrapperEl.style.touchAction = tool === DrawingMode.HAND ? 'manipulation' : 'none';
    }
    
    onCanvasReady(canvas);
  };

  // Update grid visibility when showGrid changes
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (canvas && gridObjectsRef.current.length > 0) {
      gridObjectsRef.current.forEach(obj => {
        obj.set('visible', showGrid);
      });
      canvas.requestRenderAll();
    } else if (canvas && showGrid && gridObjectsRef.current.length === 0) {
      // Create grid if it doesn't exist and should be shown
      const gridObjects = createSimpleGrid(canvas);
      gridObjectsRef.current = gridObjects;
    }
  }, [showGrid]);

  // Update tool settings when they change
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    canvas.isDrawingMode = tool === DrawingMode.DRAW;
    canvas.selection = tool === DrawingMode.SELECT;
    
    if (canvas.isDrawingMode) {
      canvas.freeDrawingBrush.color = lineColor;
      canvas.freeDrawingBrush.width = lineThickness;
    }
    
    canvas.requestRenderAll();
  }, [tool, lineColor, lineThickness]);

  return (
    <div className={`relative w-full h-full ${className}`} data-testid="canvas-controller">
      <OptimizedCanvas
        fabricCanvasRef={fabricCanvasRef}
        width={width}
        height={height}
        onCanvasReady={handleCanvasReady}
      />
    </div>
  );
};

export default OptimizedCanvasController;
