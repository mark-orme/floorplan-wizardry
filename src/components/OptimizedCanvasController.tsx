
import React, { useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { OptimizedCanvas } from './OptimizedCanvas';
import { DrawingMode } from '@/constants/drawingModes';

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
  
  const handleCanvasReady = (canvas: FabricCanvas) => {
    fabricCanvasRef.current = canvas;
    
    // Set up proper tool based on the current drawing mode
    canvas.isDrawingMode = tool === DrawingMode.DRAW;
    canvas.selection = tool === DrawingMode.SELECT;
    
    if (canvas.isDrawingMode) {
      canvas.freeDrawingBrush.color = lineColor;
      canvas.freeDrawingBrush.width = lineThickness;
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

  return (
    <div className={`relative w-full h-full ${className}`} data-testid="canvas-controller">
      <OptimizedCanvas
        fabricCanvasRef={fabricCanvasRef}
        width={width}
        height={height}
        onCanvasReady={handleCanvasReady}
        onError={onError}
        tool={tool}
        lineColor={lineColor}
        lineThickness={lineThickness}
        showGrid={showGrid}
      />
    </div>
  );
};

export default OptimizedCanvasController;
