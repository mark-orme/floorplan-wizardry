
import React, { useRef, useEffect, useState } from 'react';
import { Canvas, PencilBrush } from 'fabric';
import { Button } from '@/components/ui/button';
import { useFreehandDrawingPolish } from '@/hooks/useFreehandDrawingPolish';
import { BrushCursorPreview } from './BrushCursorPreview';
import { DrawingMode } from '@/constants/drawingModes';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export const FreehandDrawingPolishDemo: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<Canvas | null>(null);
  const [tool, setTool] = useState<DrawingMode>(DrawingMode.DRAW);
  const [lineColor, setLineColor] = useState('#000000');
  const [lineThickness, setLineThickness] = useState(2);
  const [autoStraighten, setAutoStraighten] = useState(true);
  const [smoothing, setSmoothing] = useState(true);
  
  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current || fabricCanvasRef.current) return;
    
    const canvas = new Canvas(canvasRef.current, {
      width: 500,
      height: 300,
      backgroundColor: '#f0f0f0',
      isDrawingMode: true
    });
    
    const brush = new PencilBrush(canvas);
    brush.color = lineColor;
    brush.width = lineThickness;
    canvas.freeDrawingBrush = brush;
    
    fabricCanvasRef.current = canvas;
    
    return () => {
      canvas.dispose();
      fabricCanvasRef.current = null;
    };
  }, [lineColor, lineThickness]);
  
  // Use our freehand drawing polish hook
  const { brushCursorRef } = useFreehandDrawingPolish({
    fabricCanvasRef,
    autoStraighten,
    simplificationThreshold: smoothing ? 2.5 : 0,
    brushPreviewSize: lineThickness * 2
  });
  
  // Update drawing settings
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    canvas.isDrawingMode = tool === DrawingMode.DRAW;
    canvas.freeDrawingBrush.color = lineColor;
    canvas.freeDrawingBrush.width = lineThickness;
  }, [tool, lineColor, lineThickness]);
  
  // Handle clear canvas
  const handleClear = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    canvas.clear();
    canvas.backgroundColor = '#f0f0f0';
    canvas.renderAll();
  };
  
  return (
    <div className="space-y-4">
      <div className="flex space-x-3 items-center">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <Label htmlFor="auto-straighten">Auto-straighten lines</Label>
            <Switch
              id="auto-straighten"
              checked={autoStraighten}
              onCheckedChange={setAutoStraighten}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Label htmlFor="smoothing">Path smoothing</Label>
            <Switch
              id="smoothing"
              checked={smoothing}
              onCheckedChange={setSmoothing}
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Label htmlFor="line-thickness">Thickness</Label>
          <input
            id="line-thickness"
            type="range"
            min="1"
            max="10"
            value={lineThickness}
            onChange={(e) => setLineThickness(parseInt(e.target.value))}
            className="w-24"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Label htmlFor="line-color">Color</Label>
          <input
            id="line-color"
            type="color"
            value={lineColor}
            onChange={(e) => setLineColor(e.target.value)}
            className="w-8 h-8"
          />
        </div>
        
        <Button variant="outline" onClick={handleClear}>
          Clear
        </Button>
      </div>
      
      <div className="relative border rounded-md overflow-hidden">
        <canvas ref={canvasRef} className="touch-manipulation" />
        
        <BrushCursorPreview 
          fabricCanvas={fabricCanvasRef.current} 
          tool={tool}
          lineColor={lineColor}
          lineThickness={lineThickness}
        />
      </div>
      
      <div className="text-sm text-gray-500">
        <p>Drawing polish features:</p>
        <ul className="list-disc list-inside ml-2">
          <li>Path simplification using Douglas-Peucker algorithm</li>
          <li>Auto-straightening of nearly straight lines</li>
          <li>Brush preview cursor matching line thickness</li>
          <li>Grid snapping (when enabled)</li>
        </ul>
      </div>
    </div>
  );
};
