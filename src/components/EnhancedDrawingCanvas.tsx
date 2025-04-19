
import React, { useRef } from 'react';
import { OptimizedCanvas } from './OptimizedCanvas';
import { useStylusInput } from '@/hooks/useStylusInput';
import { usePredictiveDrawing } from '@/hooks/usePredictiveDrawing';
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
  const canvasRef = useRef<FabricCanvas | null>(null);

  const handleCanvasReady = (canvas: FabricCanvas) => {
    canvasRef.current = canvas;
    if (onCanvasReady) {
      onCanvasReady(canvas);
    }
  };

  // Use our optimized input hooks
  useStylusInput({
    fabricCanvas: canvasRef.current,
    baseWidth,
    baseColor
  });

  // Use predictive drawing for lower latency
  const { handlePointerMove, predictionEnabled, togglePrediction } = usePredictiveDrawing(canvasRef.current);

  return (
    <div className="relative">
      <OptimizedCanvas
        width={width}
        height={height}
        onCanvasReady={handleCanvasReady}
        onPointerMove={handlePointerMove}
      />
      {/* Optional prediction toggle */}
      <div 
        className="absolute top-2 right-2 bg-white/80 text-xs px-2 py-1 rounded cursor-pointer hover:bg-white"
        onClick={() => togglePrediction()}
      >
        Prediction: {predictionEnabled ? 'On' : 'Off'}
      </div>
    </div>
  );
};
