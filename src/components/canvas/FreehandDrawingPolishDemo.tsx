
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Canvas, PencilBrush } from 'fabric';
import { Button } from '@/components/ui/button';
import { useFreehandDrawingPolish } from '@/hooks/useFreehandDrawingPolish';
import { DrawingMode } from '@/constants/drawingModes';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { saveCanvasToLocalStorage, loadCanvasFromLocalStorage, clearSavedCanvasData } from '@/utils/autosave/canvasAutoSave';
import { MeasurementGuideModal } from '@/components/MeasurementGuideModal';
import { useCanvasOptimization } from '@/hooks/useCanvasOptimization';
import { useMemoizedDrawingComponents } from '@/hooks/useMemoizedDrawingComponents';

export const FreehandDrawingPolishDemo: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<Canvas | null>(null);
  const [tool, setTool] = useState<DrawingMode>(DrawingMode.DRAW);
  const [lineColor, setLineColor] = useState('#000000');
  const [lineThickness, setLineThickness] = useState(2);
  const [autoStraighten, setAutoStraighten] = useState(true);
  const [smoothing, setSmoothing] = useState(true);
  const [showGuide, setShowGuide] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  // Canvas performance optimization hook
  const { performanceMetrics, needsVirtualization } = useCanvasOptimization({
    fabricCanvasRef,
    viewportWidth: 500,
    viewportHeight: 300,
    objectLimit: 500
  });
  
  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current || fabricCanvasRef.current) return;
    
    const canvas = new Canvas(canvasRef.current, {
      width: 500,
      height: 300,
      backgroundColor: '#f0f0f0',
      isDrawingMode: true,
      renderOnAddRemove: false // Performance optimization
    });
    
    const brush = new PencilBrush(canvas);
    brush.color = lineColor;
    brush.width = lineThickness;
    canvas.freeDrawingBrush = brush;
    
    fabricCanvasRef.current = canvas;

    // Attempt to load saved state
    if (loadCanvasFromLocalStorage(canvas)) {
      toast.success("Drawing restored from previous session");
    }
    
    return () => {
      canvas.dispose();
      fabricCanvasRef.current = null;
    };
  }, [lineColor, lineThickness]);
  
  // Use our freehand drawing polish hook with proper parameters
  const { brushCursorRef } = useFreehandDrawingPolish({
    canvas: fabricCanvasRef.current,
    autoStraighten,
    simplificationThreshold: smoothing ? 2.5 : 0
  }) || { brushCursorRef: null };
  
  // Update drawing settings
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    canvas.isDrawingMode = tool === DrawingMode.DRAW;
    canvas.freeDrawingBrush.color = lineColor;
    canvas.freeDrawingBrush.width = lineThickness;
  }, [tool, lineColor, lineThickness]);
  
  // Handlers
  const handleClear = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    canvas.clear();
    canvas.backgroundColor = '#f0f0f0';
    canvas.renderAll();
    toast.success("Canvas cleared");
  }, []);

  const handleSave = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    if (saveCanvasToLocalStorage(canvas)) {
      setLastSaved(new Date());
      toast.success("Drawing saved");
    } else {
      toast.error("Failed to save drawing");
    }
  }, []);
  
  const handleOpenGuide = useCallback(() => {
    setShowGuide(true);
  }, []);

  const handleCloseGuide = useCallback((dontShowAgain: boolean) => {
    setShowGuide(false);
    
    if (dontShowAgain) {
      localStorage.setItem('dontShowMeasurementGuide', 'true');
    }
  }, []);
  
  // Use memoized components for better performance
  const { brushPreview, measurementGuide } = useMemoizedDrawingComponents({
    fabricCanvas: fabricCanvasRef.current,
    tool,
    lineColor,
    lineThickness,
    showGuide,
    handleCloseGuide,
    handleOpenGuideChange: setShowGuide
  });
  
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

        <Button variant="outline" onClick={handleSave}>
          Save
        </Button>

        <Button variant="outline" onClick={handleOpenGuide}>
          Measurement Guide
        </Button>
      </div>
      
      <div className="relative border rounded-md overflow-hidden">
        <canvas ref={canvasRef} className="touch-manipulation" />
        
        {brushPreview}
        
        {lastSaved && (
          <div className="absolute top-2 left-2 text-xs text-gray-500 bg-white/80 px-2 py-1 rounded">
            Last saved: {lastSaved.toLocaleTimeString()}
          </div>
        )}
        
        {process.env.NODE_ENV !== 'production' && (
          <div className="absolute bottom-2 right-2 text-xs text-gray-500 bg-white/80 px-2 py-1 rounded">
            Objects: {performanceMetrics.objectCount} | 
            Virtualized: {needsVirtualization ? 'Yes' : 'No'} |
            FPS: {performanceMetrics.fps}
          </div>
        )}
      </div>
      
      <div className="text-sm text-gray-500">
        <p>Drawing polish features:</p>
        <ul className="list-disc list-inside ml-2">
          <li>Path simplification using Douglas-Peucker algorithm</li>
          <li>Auto-straightening of nearly straight lines</li>
          <li>Brush preview cursor matching line thickness</li>
          <li>Persistent saving of drawings</li>
          <li>Performance optimization with virtualized rendering</li>
          <li>Web Worker for intensive geometry calculations</li>
        </ul>
      </div>

      {measurementGuide}
    </div>
  );
};
