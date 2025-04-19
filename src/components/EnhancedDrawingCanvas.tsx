
import React from 'react';
import { OptimizedCanvas } from './OptimizedCanvas';
import { useStylusInput } from '@/hooks/useStylusInput';
import { Canvas as FabricCanvas } from 'fabric';

interface EnhancedDrawingCanvasProps {
  width?: number;
  height?: number;
  onCanvasReady?: (canvas: FabricCanvas) => void;
  baseWidth?: number;
  baseColor?: string;
}

export const EnhancedDrawingCanvas: React.FC<EnhancedDrawingCanvasProps> = ({
  width = 800,
  height = 600,
  onCanvasReady,
  baseWidth = 2,
  baseColor = "#000000"
}) => {
  const canvasRef = React.useRef<FabricCanvas | null>(null);

  const handleCanvasReady = (canvas: FabricCanvas) => {
    canvasRef.current = canvas;
    if (onCanvasReady) {
      onCanvasReady(canvas);
    }
  };

  // Use our new stylus input hook
  useStylusInput({
    fabricCanvas: canvasRef.current,
    baseWidth,
    baseColor
  });

  return (
    <OptimizedCanvas
      width={width}
      height={height}
      onCanvasReady={handleCanvasReady}
    />
  );
};
