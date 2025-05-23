
import React, { useRef, useEffect, useState } from 'react';
import * as fabric from 'fabric';
import { ExtendedFabricCanvas } from '@/types/canvas-types';
import { toast } from 'sonner';

interface EnhancedCanvasProps {
  width?: number;
  height?: number;
  drawingMode?: boolean;
  brushColor?: string;
  brushWidth?: number;
  onCanvasReady?: (canvas: ExtendedFabricCanvas) => void;
  onObjectAdded?: (e: { target: any }) => void;
  onObjectModified?: (e: { target: any }) => void;
  onObjectRemoved?: (e: { target: any }) => void;
}

export const EnhancedCanvas: React.FC<EnhancedCanvasProps> = ({
  width = 800,
  height = 600,
  drawingMode = false,
  brushColor = '#000000',
  brushWidth = 2,
  onCanvasReady,
  onObjectAdded,
  onObjectModified,
  onObjectRemoved
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasInstanceRef = useRef<ExtendedFabricCanvas | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!canvasRef.current) return;

    try {
      const fabricCanvas = new fabric.Canvas(canvasRef.current, {
        width,
        height,
        backgroundColor: '#ffffff'
      }) as unknown as ExtendedFabricCanvas;

      canvasInstanceRef.current = fabricCanvas;
      setIsLoading(false);

      if (onObjectAdded) {
        fabricCanvas.on('object:added', onObjectAdded);
      }

      if (onObjectModified) {
        fabricCanvas.on('object:modified', onObjectModified);
      }

      if (onObjectRemoved) {
        fabricCanvas.on('object:removed', onObjectRemoved);
      }

      if (onCanvasReady) {
        onCanvasReady(fabricCanvas);
      }

      return () => {
        fabricCanvas.dispose();
      };
    } catch (error) {
      console.error('Failed to initialize enhanced canvas:', error);
      toast.error('Failed to initialize canvas');
      setIsLoading(false);
    }
  }, [width, height, onCanvasReady, onObjectAdded, onObjectModified, onObjectRemoved]);

  useEffect(() => {
    const canvas = canvasInstanceRef.current;
    if (!canvas) return;

    canvas.isDrawingMode = drawingMode;
    canvas.selection = !drawingMode;

    if (drawingMode) {
      canvas.selection = false;
      canvas.defaultCursor = 'crosshair';
      canvas.hoverCursor = 'crosshair';
      canvas.freeDrawingBrush.color = brushColor;
      canvas.freeDrawingBrush.width = brushWidth;
    } else {
      canvas.isDrawingMode = false;
      canvas.defaultCursor = 'default';
    }
  }, [drawingMode, brushColor, brushWidth]);

  useEffect(() => {
    const canvas = canvasInstanceRef.current;
    if (!canvas) return;

    if (canvas.getWidth() !== width || canvas.getHeight() !== height) {
      canvas.setWidth(width);
      canvas.setHeight(height);
      canvas.requestRenderAll();
    }
  }, [width, height]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className="border border-gray-200 shadow-md"
      />
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70">
          <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      )}
    </div>
  );
};

export default EnhancedCanvas;
