
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
    onCanvasReady(canvas);
  };

  return (
    <div className={`relative w-full h-full ${className}`}>
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
