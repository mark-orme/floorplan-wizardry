
import React, { useEffect, useRef, useState } from 'react';
import { Canvas, Line } from 'fabric';
import { Button } from '@/components/ui/button';
import logger from '@/utils/logger';

export const StraightLineToolDemo: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<Canvas | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lineStart, setLineStart] = useState<{ x: number, y: number } | null>(null);
  const [currentLine, setCurrentLine] = useState<Line | null>(null);
  const [lineColor, setLineColor] = useState('#000000');
  const [lineThickness, setLineThickness] = useState(2);
  
  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    
    try {
      logger.info('Initializing canvas for straight line tool demo');
      
      const canvas = new Canvas(canvasRef.current, {
        width: 800,
        height: 600,
        backgroundColor: '#f8f9fa',
        selection: false
      });
      
      setFabricCanvas(canvas);
      
      return () => {
        canvas.dispose();
      };
    } catch (error) {
      console.error('Error initializing canvas:', error);
    }
  }, []);
  
  // Set up event handlers
  useEffect(() => {
    if (!fabricCanvas) return;
    
    const handleMouseDown = (e: any) => {
      const pointer = fabricCanvas.getPointer(e.e);
      console.log('Mouse down at:', pointer);
      
      setIsDrawing(true);
      setLineStart({ x: pointer.x, y: pointer.y });
      
      // Create initial line
      const line = new Line([pointer.x, pointer.y, pointer.x, pointer.y], {
        stroke: lineColor,
        strokeWidth: lineThickness,
        selectable: true
      });
      
      fabricCanvas.add(line);
      setCurrentLine(line);
      fabricCanvas.renderAll();
      
      logger.info('Started drawing line', { x: pointer.x, y: pointer.y });
    };
    
    const handleMouseMove = (e: any) => {
      if (!isDrawing || !lineStart || !currentLine) return;
      
      const pointer = fabricCanvas.getPointer(e.e);
      
      // Update line endpoint
      currentLine.set({
        x2: pointer.x,
        y2: pointer.y
      });
      
      fabricCanvas.renderAll();
      console.log('Drawing line to:', pointer);
    };
    
    const handleMouseUp = () => {
      if (!isDrawing || !currentLine) return;
      
      setIsDrawing(false);
      setLineStart(null);
      setCurrentLine(null);
      
      fabricCanvas.renderAll();
      logger.info('Finished drawing line');
    };
    
    // Attach event listeners
    fabricCanvas.on('mouse:down', handleMouseDown);
    fabricCanvas.on('mouse:move', handleMouseMove);
    fabricCanvas.on('mouse:up', handleMouseUp);
    
    // Set cursor
    fabricCanvas.defaultCursor = 'crosshair';
    
    return () => {
      // Remove event listeners
      fabricCanvas.off('mouse:down', handleMouseDown);
      fabricCanvas.off('mouse:move', handleMouseMove);
      fabricCanvas.off('mouse:up', handleMouseUp);
    };
  }, [fabricCanvas, isDrawing, lineStart, currentLine, lineColor, lineThickness]);
  
  const clearCanvas = () => {
    if (!fabricCanvas) return;
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = '#f8f9fa';
    fabricCanvas.renderAll();
  };
  
  return (
    <div className="space-y-4 p-4">
      <h2 className="text-xl font-bold">Straight Line Drawing Tool</h2>
      
      <div className="flex space-x-4 mb-4">
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
      
      <div className="border border-gray-300 rounded bg-white">
        <canvas ref={canvasRef} />
      </div>
      
      <div className="flex space-x-2">
        <Button onClick={clearCanvas} variant="outline">Clear Canvas</Button>
      </div>
      
      <div className="text-sm text-gray-500">
        <p>Click and drag to draw a straight line.</p>
        <p>Status: {isDrawing ? 'Drawing line...' : 'Ready to draw'}</p>
      </div>
    </div>
  );
};

export default StraightLineToolDemo;
