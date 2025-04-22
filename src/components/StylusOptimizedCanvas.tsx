
import React, { useRef, useEffect, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { useOptimizedStylusDrawing } from '@/hooks/useOptimizedStylusDrawing';
import { DrawingMode } from '@/constants/drawingModes';
import { toast } from 'sonner';

interface StylusOptimizedCanvasProps {
  width: number;
  height: number;
  tool?: DrawingMode;
  lineColor?: string;
  lineThickness?: number;
  onCanvasReady?: (canvas: FabricCanvas) => void;
}

export const StylusOptimizedCanvas: React.FC<StylusOptimizedCanvasProps> = ({
  width,
  height,
  tool = DrawingMode.DRAW,
  lineColor = '#000000',
  lineThickness = 2,
  onCanvasReady
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
  const [fps, setFps] = useState(0);
  
  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    
    console.log('Initializing stylus-optimized canvas');
    
    // Create Fabric canvas with optimized settings
    const fabricCanvas = new FabricCanvas(canvasRef.current, {
      width,
      height,
      selection: tool === DrawingMode.SELECT,
      isDrawingMode: tool === DrawingMode.DRAW,
      renderOnAddRemove: false, // Reduce renders
      enableRetinaScaling: false, // Better performance
      fireMiddleClick: false, // No need for this
      stopContextMenu: true, // Prevent right-click menu
    });
    
    // Optimize initial brush
    if (fabricCanvas.freeDrawingBrush) {
      fabricCanvas.freeDrawingBrush.color = lineColor;
      fabricCanvas.freeDrawingBrush.width = lineThickness;
      // Fix: Remove the decimate property as it doesn't exist on BaseBrush type
      // Instead configure other properties that do exist
      fabricCanvas.freeDrawingBrush.limitedToCanvasSize = true;
    }
    
    setCanvas(fabricCanvas);
    
    // Notify parent
    if (onCanvasReady) {
      onCanvasReady(fabricCanvas);
      toast.success('Stylus-optimized canvas ready', {
        id: 'canvas-ready',
        duration: 2000
      });
    }
    
    // Load WASM modules if needed
    fetch('/wasm/geometry.wasm')
      .then(response => response.arrayBuffer())
      .then(bytes => WebAssembly.instantiate(bytes))
      .then(results => {
        const wasmExports = results.instance.exports;
        console.log('WebAssembly module loaded for optimized geometry calculations');
      })
      .catch(err => {
        console.warn('Failed to load WebAssembly module:', err);
      });
    
    return () => {
      fabricCanvas.dispose();
    };
  }, [width, height, lineColor, lineThickness, tool, onCanvasReady]);
  
  // Use optimized stylus drawing
  const { isPenMode, pressure } = useOptimizedStylusDrawing({
    canvas,
    enabled: tool === DrawingMode.DRAW,
    lineColor,
    lineThickness,
    onPerformanceReport: setFps
  });
  
  // Update canvas options when tool changes
  useEffect(() => {
    if (!canvas) return;
    
    canvas.isDrawingMode = tool === DrawingMode.DRAW;
    canvas.selection = tool === DrawingMode.SELECT;
    
    if (canvas.isDrawingMode) {
      canvas.freeDrawingBrush.color = lineColor;
      canvas.freeDrawingBrush.width = lineThickness;
    }
  }, [canvas, tool, lineColor, lineThickness]);
  
  return (
    <div className="relative">
      <canvas ref={canvasRef} className="stylus-optimized-canvas" />
      
      {isPenMode && (
        <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
          Pen Mode (Pressure: {Math.round(pressure * 100)}%)
        </div>
      )}
      
      {fps > 0 && (
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
          {fps.toFixed(1)} FPS {fps < 60 ? '⚠️' : '✓'}
        </div>
      )}
    </div>
  );
};

export default StylusOptimizedCanvas;
