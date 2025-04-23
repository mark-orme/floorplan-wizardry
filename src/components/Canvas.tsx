
import React, { useEffect, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import type { DebugInfoState } from '@/types/core/DebugInfo';
import { createSimpleGrid } from '@/utils/simpleGridCreator';
import { toast } from 'sonner';
import type { DrawingMode } from '@/types/drawing-types';

export interface CanvasProps {
  width: number;
  height: number;
  backgroundColor?: string;
  onCanvasReady?: (canvas: FabricCanvas) => void;
  onError?: (error: Error) => void;
  setDebugInfo?: React.Dispatch<React.SetStateAction<DebugInfoState>>;
  style?: React.CSSProperties;
  showGridDebug?: boolean;
  tool?: DrawingMode;
}

export const Canvas: React.FC<CanvasProps> = ({
  width,
  height,
  backgroundColor = '#ffffff',
  onCanvasReady,
  onError,
  setDebugInfo,
  style,
  showGridDebug = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    try {
      // Create canvas instance
      const canvas = new FabricCanvas(canvasRef.current, {
        width,
        height,
        backgroundColor,
        selection: true,
      });
      
      // Add grid if enabled
      if (showGridDebug) {
        createSimpleGrid(canvas);
      }
      
      // Notify parent component that canvas is ready
      if (onCanvasReady) {
        onCanvasReady(canvas);
      }
      
      return () => {
        canvas.dispose();
      };
    } catch (error) {
      console.error('Canvas initialization error:', error);
      if (onError && error instanceof Error) {
        onError(error);
      } else if (error instanceof Error) {
        toast.error(`Canvas error: ${error.message}`);
      }
    }
  }, [width, height, onCanvasReady, onError, showGridDebug, backgroundColor]);
  
  return (
    <canvas 
      ref={canvasRef}
      className="border border-gray-300 rounded shadow-sm"
      data-testid="canvas-element"
    />
  );
};

export default Canvas;
