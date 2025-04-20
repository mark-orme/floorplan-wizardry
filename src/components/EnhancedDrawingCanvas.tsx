
import { useEffect, useState, useRef } from 'react';
import { Canvas } from 'fabric';
import { useStylusInput } from '@/hooks/useStylusInput'; 

interface EnhancedDrawingCanvasProps {
  canvasId?: string; // Make canvasId optional
  width: number;
  height: number;
  onCanvasReady?: (canvas: Canvas) => void;
  enableStylus?: boolean;
  className?: string;
}

export function EnhancedDrawingCanvas({
  canvasId = 'enhanced-canvas', // Default value
  width,
  height,
  onCanvasReady,
  enableStylus = true,
  className
}: EnhancedDrawingCanvasProps) {
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const [brushPressure, setBrushPressure] = useState(0.5);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Initialize fabric canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const fabricCanvas = new Canvas(canvasRef.current, {
      width,
      height,
      selection: true,
      preserveObjectStacking: true
    });
    
    setCanvas(fabricCanvas);
    if (onCanvasReady) onCanvasReady(fabricCanvas);
    
    return () => {
      fabricCanvas.dispose();
    };
  }, [width, height, onCanvasReady]);
  
  // Handle stylus input
  const { isStylus } = useStylusInput({
    isEnabled: enableStylus && !!canvas,
    onPressureChange: setBrushPressure
  });
  
  return (
    <div className={className}>
      <canvas ref={canvasRef} id={canvasId} />
      {isStylus && (
        <div className="stylus-indicator">
          Pressure: {Math.round(brushPressure * 100)}%
        </div>
      )}
    </div>
  );
}
