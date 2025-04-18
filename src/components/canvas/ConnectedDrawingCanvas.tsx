
import React, { useRef, useEffect, useCallback } from 'react';
import { Canvas as FabricCanvas, Line } from 'fabric';
import { createGrid } from '@/utils/gridCreator';

interface ConnectedDrawingCanvasProps {
  width: number;
  height: number;
  showGrid?: boolean;
  onCanvasReady?: (canvas: FabricCanvas) => void;
}

export const ConnectedDrawingCanvas: React.FC<ConnectedDrawingCanvasProps> = ({
  width,
  height,
  showGrid = false,
  onCanvasReady
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    console.info('Initializing canvas');
    
    try {
      // Create canvas instance
      const canvas = new FabricCanvas(canvasRef.current, {
        width,
        height,
        backgroundColor: '#ffffff',
        selection: true,
        preserveObjectStacking: true
      });
      
      fabricCanvasRef.current = canvas;
      
      // Create grid if needed
      if (showGrid) {
        console.info('Creating grid for initialized canvas');
        try {
          const gridObjects = createGrid(canvas, width, height);
          canvas.renderAll();
          console.info(`Grid created with ${gridObjects.length} objects`);
        } catch (error) {
          console.error('Error creating grid:', error);
        }
      }
      
      // Notify parent component
      if (onCanvasReady) {
        onCanvasReady(canvas);
      }
    } catch (error) {
      console.error('Failed to initialize canvas', error);
    }
    
    // Cleanup function
    return () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
      }
    };
  }, [width, height, showGrid, onCanvasReady]);

  return <canvas ref={canvasRef} />;
};
