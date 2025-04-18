
import React, { useRef, useEffect, useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
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
          const gridObjects = createSimpleGrid(canvas, width, height);
          canvas.renderAll();
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

  // Simple grid creation function
  const createSimpleGrid = (canvas: FabricCanvas, width: number, height: number) => {
    const gridSize = 20;
    const gridColor = 'rgba(200, 200, 200, 0.5)';
    const gridObjects = [];
    
    // Create horizontal lines
    for (let i = 0; i <= height; i += gridSize) {
      const line = new fabric.Line([0, i, width, i], {
        stroke: gridColor,
        selectable: false,
        evented: false,
        strokeWidth: 1
      });
      
      // Add metadata to identify grid objects
      (line as any).isGrid = true;
      (line as any).objectType = 'grid';
      
      canvas.add(line);
      // Move to back instead of using sendToBack which might not be available
      canvas.moveTo(line, 0);
      gridObjects.push(line);
    }
    
    // Create vertical lines
    for (let i = 0; i <= width; i += gridSize) {
      const line = new fabric.Line([i, 0, i, height], {
        stroke: gridColor,
        selectable: false,
        evented: false,
        strokeWidth: 1
      });
      
      // Add metadata to identify grid objects
      (line as any).isGrid = true;
      (line as any).objectType = 'grid';
      
      canvas.add(line);
      // Move to back instead of using sendToBack
      canvas.moveTo(line, 0);
      gridObjects.push(line);
    }
    
    return gridObjects;
  };

  return <canvas ref={canvasRef} />;
};
