
import React, { useRef, useEffect, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import { useOptimizedDrawing } from '@/hooks/useOptimizedDrawing';

interface OptimizedCanvasProps {
  width: number;
  height: number;
  tool?: DrawingMode;
  lineColor?: string;
  lineThickness?: number;
  onCanvasReady?: (canvas: FabricCanvas) => void;
}

export const OptimizedCanvas: React.FC<OptimizedCanvasProps> = ({
  width,
  height,
  tool = DrawingMode.DRAW,
  lineColor = '#000000',
  lineThickness = 2,
  onCanvasReady
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Canvas state and handlers from custom hook
  const {
    isDrawing,
    objectCount,
    metrics,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  } = useOptimizedDrawing({
    canvas,
    tool,
    lineColor,
    lineThickness
  });
  
  // Initialize canvas
  useEffect(() => {
    if (canvasRef.current && !canvas) {
      const fabricCanvas = new FabricCanvas(canvasRef.current, {
        width,
        height,
        selection: tool === DrawingMode.SELECT,
        isDrawingMode: tool === DrawingMode.DRAW
      });
      
      // Set canvas
      setCanvas(fabricCanvas);
      
      // Notify parent
      if (onCanvasReady) {
        onCanvasReady(fabricCanvas);
      }
      
      setIsLoaded(true);
    }
  }, [canvas, width, height, tool, onCanvasReady]);
  
  // Update canvas options when tool changes
  useEffect(() => {
    if (canvas) {
      canvas.isDrawingMode = tool === DrawingMode.DRAW;
      canvas.selection = tool === DrawingMode.SELECT;
      
      if (canvas.isDrawingMode) {
        canvas.freeDrawingBrush.color = lineColor;
        canvas.freeDrawingBrush.width = lineThickness;
      }
    }
  }, [canvas, tool, lineColor, lineThickness]);
  
  // Add event handlers
  useEffect(() => {
    if (!canvas) return;
    
    const handleCanvasMouseDown = (e: MouseEvent) => handleMouseDown(e, canvas);
    const handleCanvasMouseMove = (e: MouseEvent) => handleMouseMove(e, canvas);
    const handleCanvasMouseUp = (e: MouseEvent) => handleMouseUp(e, canvas);
    
    canvas.wrapperEl.addEventListener('mousedown', handleCanvasMouseDown);
    canvas.wrapperEl.addEventListener('mousemove', handleCanvasMouseMove);
    canvas.wrapperEl.addEventListener('mouseup', handleCanvasMouseUp);
    
    return () => {
      canvas.wrapperEl.removeEventListener('mousedown', handleCanvasMouseDown);
      canvas.wrapperEl.removeEventListener('mousemove', handleCanvasMouseMove);
      canvas.wrapperEl.removeEventListener('mouseup', handleCanvasMouseUp);
    };
  }, [canvas, handleMouseDown, handleMouseMove, handleMouseUp]);
  
  return (
    <div className="relative">
      <canvas ref={canvasRef} />
      
      {isLoaded && (
        <div className="absolute bottom-2 right-2 bg-white bg-opacity-70 text-xs p-1 rounded">
          {isDrawing && <span className="mr-2">Drawing...</span>}
          <span>Objects: {objectCount}</span>
          {metrics && <span className="ml-2">FPS: {metrics.fps}</span>}
        </div>
      )}
    </div>
  );
};

export default OptimizedCanvas;
