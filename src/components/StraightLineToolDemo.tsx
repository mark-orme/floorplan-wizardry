
import React, { useEffect, useRef, useState } from 'react';
import { Canvas, Object as FabricObject } from 'fabric';
import { Button } from '@/components/ui/button';
import { useStraightLineTool } from '@/hooks/straightLineTool/useStraightLineTool';
import { DrawingMode } from '@/constants/drawingModes';
import logger from '@/utils/logger';

export const StraightLineToolDemo: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<Canvas | null>(null);
  const [activeTool, setActiveTool] = useState<DrawingMode>(DrawingMode.SELECT);
  const [lineColor, setLineColor] = useState('#000000');
  const [lineThickness, setLineThickness] = useState(2);
  
  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    
    logger.info('Initializing canvas');
    
    const canvas = new Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: '#f8f9fa'
    });
    
    setFabricCanvas(canvas);
    
    return () => {
      canvas.dispose();
    };
  }, []);
  
  // Handle save state function for undo support
  const saveCurrentState = () => {
    logger.info('Saving canvas state');
    // In a real application, you'd save the state for undo/redo
  };
  
  // Use our straight line tool
  const straightLineTool = useStraightLineTool({
    canvas: fabricCanvas,
    enabled: activeTool === DrawingMode.STRAIGHT_LINE,
    lineColor,
    lineThickness,
    saveCurrentState
  });
  
  // Handle tool change
  const handleToolChange = (tool: DrawingMode) => {
    logger.info(`Changing tool to ${tool}`);
    setActiveTool(tool);
    
    if (!fabricCanvas) return;
    
    if (tool === DrawingMode.STRAIGHT_LINE) {
      fabricCanvas.isDrawingMode = false;
      fabricCanvas.selection = false;
    } else if (tool === DrawingMode.DRAW) {
      fabricCanvas.isDrawingMode = true;
      fabricCanvas.selection = false;
    } else {
      fabricCanvas.isDrawingMode = false;
      fabricCanvas.selection = true;
    }
  };
  
  // Set up event handlers for straight line tool
  useEffect(() => {
    if (!fabricCanvas) return;
    
    // Configure canvas based on selected tool
    if (activeTool === DrawingMode.DRAW) {
      fabricCanvas.isDrawingMode = true;
      fabricCanvas.freeDrawingBrush.color = lineColor;
      fabricCanvas.freeDrawingBrush.width = lineThickness;
    } else {
      fabricCanvas.isDrawingMode = false;
    }
    
    fabricCanvas.requestRenderAll();
  }, [fabricCanvas, activeTool, lineColor, lineThickness]);
  
  return (
    <div className="space-y-4 p-4">
      <div className="flex space-x-2">
        <Button 
          onClick={() => handleToolChange(DrawingMode.SELECT)}
          variant={activeTool === DrawingMode.SELECT ? "default" : "outline"}
        >
          Select
        </Button>
        <Button 
          onClick={() => handleToolChange(DrawingMode.STRAIGHT_LINE)}
          variant={activeTool === DrawingMode.STRAIGHT_LINE ? "default" : "outline"}
        >
          Straight Line
        </Button>
        <Button 
          onClick={() => handleToolChange(DrawingMode.DRAW)}
          variant={activeTool === DrawingMode.DRAW ? "default" : "outline"}
        >
          Draw
        </Button>
      </div>
      
      <div className="flex space-x-4">
        <div>
          <label className="block text-sm mb-1">Line Color:</label>
          <input 
            type="color" 
            value={lineColor} 
            onChange={(e) => setLineColor(e.target.value)}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Line Thickness:</label>
          <input 
            type="range" 
            min="1" 
            max="10" 
            value={lineThickness} 
            onChange={(e) => setLineThickness(parseInt(e.target.value))}
            className="w-full"
          />
          <span className="text-sm">{lineThickness}px</span>
        </div>
      </div>
      
      <div className="border border-gray-300 rounded">
        <canvas ref={canvasRef} />
      </div>
      
      <div className="text-sm text-gray-500">
        {activeTool === DrawingMode.STRAIGHT_LINE ? (
          <>
            <p>Click and drag to draw a straight line.</p>
            <p>Status: {straightLineTool.isDrawing ? 'Drawing line...' : 'Ready to draw'}</p>
            <p>Grid snapping: {straightLineTool.snapEnabled ? 'Enabled' : 'Disabled'}</p>
            <p>Angle snapping: {straightLineTool.anglesEnabled ? 'Enabled' : 'Disabled'}</p>
            <div className="mt-2">
              <Button size="sm" variant="outline" onClick={straightLineTool.toggleGridSnapping}>
                Toggle Grid Snap
              </Button>
              <Button size="sm" variant="outline" onClick={straightLineTool.toggleAngles} className="ml-2">
                Toggle Angle Snap
              </Button>
            </div>
          </>
        ) : (
          <p>Select the Straight Line tool to start drawing lines.</p>
        )}
      </div>
    </div>
  );
};

export default StraightLineToolDemo;
