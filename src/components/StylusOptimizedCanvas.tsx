import React, { useRef, useEffect, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { useOptimizedStylusDrawing } from '@/hooks/useOptimizedStylusDrawing';
import { DrawingMode } from '@/constants/drawingModes';
import { toast } from 'sonner';
import { useEnhancedStylusInput } from '@/hooks/useEnhancedStylusInput';

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
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    console.log('Initializing stylus-optimized canvas');
    
    const fabricCanvas = new FabricCanvas(canvasRef.current, {
      width,
      height,
      selection: tool === DrawingMode.SELECT,
      isDrawingMode: tool === DrawingMode.DRAW,
      renderOnAddRemove: false,
      enableRetinaScaling: false,
      fireMiddleClick: false,
      stopContextMenu: true
    });
    
    if (fabricCanvas.freeDrawingBrush) {
      fabricCanvas.freeDrawingBrush.color = lineColor;
      fabricCanvas.freeDrawingBrush.width = lineThickness;
      fabricCanvas.freeDrawingBrush.limitedToCanvasSize = true;
    }
    
    setCanvas(fabricCanvas);
    
    if (onCanvasReady) {
      onCanvasReady(fabricCanvas);
      toast.success('Stylus-optimized canvas ready', {
        id: 'canvas-ready',
        duration: 2000
      });
    }
    
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
  
  const { 
    isPenMode, 
    pressure, 
    tiltX, 
    tiltY, 
    activeProfile, 
    adjustedThickness, 
    smoothedPoints 
  } = useEnhancedStylusInput({
    canvas,
    enabled: tool === DrawingMode.DRAW,
    lineColor,
    lineThickness,
    onPerformanceReport: setFps
  });
  
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
          <span>Pen Mode</span>
          <div className="text-xs opacity-80">
            {activeProfile.name} • Pressure: {Math.round(pressure * 100)}%
            {(tiltX !== 0 || tiltY !== 0) && ` • Tilt: ${Math.round(Math.sqrt(tiltX * tiltX + tiltY * tiltY))}°`}
          </div>
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
