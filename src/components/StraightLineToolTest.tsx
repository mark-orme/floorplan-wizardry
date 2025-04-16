
import React, { useEffect, useRef, useState } from 'react';
import { Canvas, Line } from 'fabric';
import { Button } from '@/components/ui/button';
import { DrawingMode } from '@/constants/drawingModes';
import { toast } from 'sonner';

export const StraightLineToolTest: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<Canvas | null>(null);
  const [activeTool, setActiveTool] = useState<DrawingMode>(DrawingMode.SELECT);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [currentLine, setCurrentLine] = useState<Line | null>(null);
  
  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = new Canvas(canvasRef.current, {
      width: 600,
      height: 400,
      backgroundColor: '#f8f9fa'
    });
    
    setFabricCanvas(canvas);
    
    return () => {
      canvas.dispose();
    };
  }, []);
  
  // Handle tool change
  const handleToolChange = (tool: DrawingMode) => {
    setActiveTool(tool);
    
    if (!fabricCanvas) return;
    
    fabricCanvas.isDrawingMode = tool === DrawingMode.DRAW;
    
    if (tool === DrawingMode.STRAIGHT_LINE) {
      fabricCanvas.defaultCursor = 'crosshair';
      toast.info('Straight line tool activated');
    } else {
      fabricCanvas.defaultCursor = 'default';
    }
  };
  
  // Set up event handlers for straight line tool
  useEffect(() => {
    if (!fabricCanvas) return;
    
    const handleMouseDown = (e: any) => {
      if (activeTool !== DrawingMode.STRAIGHT_LINE) return;
      
      const pointer = fabricCanvas.getPointer(e);
      
      setIsDrawing(true);
      setStartPoint({ x: pointer.x, y: pointer.y });
      
      const line = new Line([pointer.x, pointer.y, pointer.x, pointer.y], {
        stroke: '#000',
        strokeWidth: 2
      });
      
      fabricCanvas.add(line);
      setCurrentLine(line);
      fabricCanvas.renderAll();
      
      console.log('Started drawing line at', pointer);
    };
    
    const handleMouseMove = (e: any) => {
      if (!isDrawing || activeTool !== DrawingMode.STRAIGHT_LINE || !currentLine) return;
      
      const pointer = fabricCanvas.getPointer(e);
      
      currentLine.set({
        x2: pointer.x,
        y2: pointer.y
      });
      
      fabricCanvas.renderAll();
    };
    
    const handleMouseUp = () => {
      if (!isDrawing || activeTool !== DrawingMode.STRAIGHT_LINE) return;
      
      console.log('Finished drawing line');
      
      setIsDrawing(false);
      setCurrentLine(null);
      toast.success('Line created!');
    };
    
    fabricCanvas.on('mouse:down', handleMouseDown);
    fabricCanvas.on('mouse:move', handleMouseMove);
    fabricCanvas.on('mouse:up', handleMouseUp);
    
    return () => {
      fabricCanvas.off('mouse:down', handleMouseDown);
      fabricCanvas.off('mouse:move', handleMouseMove);
      fabricCanvas.off('mouse:up', handleMouseUp);
    };
  }, [fabricCanvas, activeTool, isDrawing, currentLine]);
  
  return (
    <div className="space-y-4">
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
      
      <div className="border border-gray-300 rounded">
        <canvas ref={canvasRef} />
      </div>
      
      <div className="text-sm text-gray-500">
        {activeTool === DrawingMode.STRAIGHT_LINE ? (
          <>
            <p>Click and drag to draw a straight line.</p>
            <p>Status: {isDrawing ? 'Drawing line...' : 'Ready to draw'}</p>
          </>
        ) : (
          <p>Select the Straight Line tool to start drawing lines.</p>
        )}
      </div>
    </div>
  );
};

export default StraightLineToolTest;
