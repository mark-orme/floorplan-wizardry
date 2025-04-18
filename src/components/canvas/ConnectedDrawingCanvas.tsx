
import React, { useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { createSimpleGrid } from '@/utils/simpleGridCreator';
import { useDrawingContext } from '@/contexts/DrawingContext';
import { DrawingMode } from '@/constants/drawingModes';
import { MobileCanvasOptimizer } from './MobileCanvasOptimizer';

interface ConnectedDrawingCanvasProps {
  width?: number;
  height?: number;
  showGrid?: boolean;
  tool?: DrawingMode;
  lineColor?: string;
  lineThickness?: number;
  onCanvasReady?: (canvas: FabricCanvas) => void;
}

export const ConnectedDrawingCanvas: React.FC<ConnectedDrawingCanvasProps> = ({
  width = 800,
  height = 600,
  showGrid = true,
  tool = DrawingMode.SELECT,
  lineColor = '#000000',
  lineThickness = 2,
  onCanvasReady
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const gridObjectsRef = useRef<any[]>([]);
  const { setCanUndo, setCanRedo } = useDrawingContext();
  const initializeAttempted = useRef(false);

  // Initialize canvas only once
  useEffect(() => {
    if (canvasRef.current && !initializeAttempted.current) {
      initializeAttempted.current = true;
      try {
        console.log("Initializing canvas");
        const fabricCanvas = new FabricCanvas(canvasRef.current, {
          width,
          height,
          backgroundColor: '#ffffff',
          selection: tool === DrawingMode.SELECT,
          isDrawingMode: tool === DrawingMode.DRAW
        });
        
        // Configure freeDrawingBrush
        if (fabricCanvas.freeDrawingBrush) {
          fabricCanvas.freeDrawingBrush.color = lineColor;
          fabricCanvas.freeDrawingBrush.width = lineThickness;
        }
        
        // Track changes for undo/redo state
        fabricCanvas.on('object:added', () => {
          setCanUndo(true);
        });
        
        fabricCanvas.on('object:removed', () => {
          // Check if there are still objects left
          setCanUndo(fabricCanvas.getObjects().length > 0);
        });
        
        setCanvas(fabricCanvas);
        setIsInitialized(true);
        
        if (onCanvasReady) {
          onCanvasReady(fabricCanvas);
        }
      } catch (error) {
        console.error("Failed to initialize canvas:", error);
      }
    }
    
    return () => {
      if (canvas) {
        canvas.dispose();
      }
    };
  }, [canvasRef.current]); // Only run when canvas ref is available

  // Create grid separately after canvas is initialized
  useEffect(() => {
    if (canvas && showGrid && gridObjectsRef.current.length === 0) {
      console.log("Creating grid for initialized canvas");
      const gridObjects = createSimpleGrid(canvas);
      gridObjectsRef.current = gridObjects;
    }
  }, [canvas, showGrid]);

  // Update grid visibility when showGrid changes
  useEffect(() => {
    if (canvas && gridObjectsRef.current.length > 0) {
      gridObjectsRef.current.forEach(obj => {
        obj.set('visible', showGrid);
      });
      canvas.requestRenderAll();
    }
  }, [canvas, showGrid]);

  // Update tool settings when they change
  useEffect(() => {
    if (canvas) {
      canvas.isDrawingMode = tool === DrawingMode.DRAW;
      canvas.selection = tool === DrawingMode.SELECT;
      
      if (canvas.isDrawingMode && canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.color = lineColor;
        canvas.freeDrawingBrush.width = lineThickness;
      }
      
      canvas.renderAll();
    }
  }, [canvas, tool, lineColor, lineThickness]);

  return (
    <div className="relative w-full h-full" data-testid="canvas-container">
      <canvas 
        ref={canvasRef} 
        className="border rounded shadow-sm touch-optimized-canvas"
      />
      {canvas && <MobileCanvasOptimizer canvas={canvas} />}
    </div>
  );
};
