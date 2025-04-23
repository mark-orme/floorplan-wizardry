import React, { useEffect, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { OptimizedCanvas } from './OptimizedCanvas';
import { DrawingMode } from '@/constants/drawingModes';
import { createSimpleGrid, ensureGridVisible } from '@/utils/simpleGridCreator';
import { isPressureSupported, isTiltSupported } from '@/utils/canvas/pointerEvents';
import { toast } from 'sonner';
import { SimpleGridLayer } from './canvas/SimpleGridLayer';

export interface OptimizedCanvasControllerProps {
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
    try {
      // Set fabricCanvasRef for external use
      fabricCanvasRef.current = canvas;
      
      // Set up proper tool based on the current drawing mode
      canvas.isDrawingMode = tool === DrawingMode.DRAW;
      canvas.selection = tool === DrawingMode.SELECT;
      
      if (canvas.isDrawingMode) {
        canvas.freeDrawingBrush.color = lineColor;
        canvas.freeDrawingBrush.width = lineThickness;
        
        // Check for enhanced input capabilities
        const hasAdvancedInput = isPressureSupported() || isTiltSupported();
        
        // Set brush to respond to pressure
        if (hasAdvancedInput) {
          console.log('Enhanced input capabilities detected');
        }
      }
      
      // Create grid for the canvas
      if (showGrid) {
        const gridObjects = createSimpleGrid(canvas, 50, '#e0e0e0');
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
    } catch (error) {
      console.error("Error in canvas initialization:", error);
      if (onError && error instanceof Error) {
        onError(error);
      }
    }
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
      const gridObjects = createSimpleGrid(canvas, 50, '#e0e0e0');
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
        width={width}
        height={height}
        onCanvasReady={handleCanvasReady}
        fabricCanvasRef={fabricCanvasRef}
      />
      
      {fabricCanvasRef.current && showGrid && (
        <SimpleGridLayer
          canvas={fabricCanvasRef.current}
          visible={showGrid}
          gridSize={50}
        />
      )}
    </div>
  );
};

export default OptimizedCanvasController;
