
import React, { useRef, useEffect } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { DebugInfoState } from '@/types/core/DebugInfo';
import { DrawingMode } from '@/constants/drawingModes';

export interface CanvasProps {
  width: number;
  height: number;
  onCanvasReady: (canvas: FabricCanvas) => void;
  onError?: (error: Error) => void;
  style?: React.CSSProperties;
  setDebugInfo?: React.Dispatch<React.SetStateAction<DebugInfoState>>;
  tool?: DrawingMode;
}

export const Canvas: React.FC<CanvasProps> = ({ 
  width,
  height,
  onCanvasReady,
  onError,
  style,
  setDebugInfo,
  tool
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    try {
      const canvas = new FabricCanvas(canvasRef.current, {
        width,
        height
      });

      // Update debug info if provided
      if (setDebugInfo) {
        setDebugInfo(prev => ({
          ...prev,
          canvasInitialized: true,
          canvasReady: true
        }));
      }

      onCanvasReady(canvas);

      return () => {
        canvas.dispose();
      };
    } catch (error) {
      console.error('Error initializing canvas:', error);
      if (onError && error instanceof Error) {
        onError(error);
      }
    }
  }, [width, height, onCanvasReady, onError, setDebugInfo]);

  return (
    <canvas 
      ref={canvasRef} 
      width={width} 
      height={height} 
      data-testid="canvas"
      data-canvas-tool={tool}
      style={style}
    />
  );
};
