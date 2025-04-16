
import { useState, useRef } from 'react';
import { Canvas as FabricCanvas, Line } from 'fabric';
import { Point } from '@/types/core/Point';
import logger from '@/utils/logger';

interface LineStateProps {
  fabricCanvasRef: { current: FabricCanvas | null };
  lineColor: string;
  lineThickness: number;
  saveCurrentState: () => void;
}

export const useLineState = ({
  fabricCanvasRef,
  lineColor,
  lineThickness,
  saveCurrentState
}: LineStateProps) => {
  // Line drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [isToolInitialized, setIsToolInitialized] = useState(false);
  
  // Current line being drawn
  const [currentLine, setCurrentLine] = useState<Line | null>(null);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [currentPoint, setCurrentPoint] = useState<Point | null>(null);
  
  // Distance tooltip reference
  const distanceTooltipRef = useRef<any>(null);
  
  // Start drawing a new line
  const startDrawing = (point: Point) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    setIsDrawing(true);
    setStartPoint(point);
    setCurrentPoint(point);
    
    // Create new line object
    const line = new Line([point.x, point.y, point.x, point.y], {
      stroke: lineColor,
      strokeWidth: lineThickness,
      selectable: true
    });
    
    // Add custom data for identification
    line.set('id', `line-${Date.now()}`);
    line.set('data', { type: 'straight-line' });
    
    canvas.add(line);
    setCurrentLine(line);
    
    // Create distance tooltip if it doesn't exist
    if (!distanceTooltipRef.current) {
      const tooltip = document.createElement('div');
      tooltip.className = 'absolute px-2 py-1 bg-black bg-opacity-75 text-white text-xs rounded pointer-events-none z-50';
      document.body.appendChild(tooltip);
      distanceTooltipRef.current = tooltip;
    }
    
    logger.info('Started drawing line', { point });
  };
  
  // Update the line as drawing continues
  const continueDrawing = (point: Point) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !isDrawing || !currentLine || !startPoint) return;
    
    setCurrentPoint(point);
    
    // Update line coordinates
    currentLine.set({
      x1: startPoint.x,
      y1: startPoint.y,
      x2: point.x,
      y2: point.y
    });
    
    canvas.renderAll();
    
    // Calculate distance for tooltip
    const dx = point.x - startPoint.x;
    const dy = point.y - startPoint.y;
    const distance = Math.round(Math.sqrt(dx * dx + dy * dy));
    
    // Update tooltip position and content
    if (distanceTooltipRef.current) {
      const zoom = canvas.getZoom();
      const offset = canvas.calcOffset();
      const canvasElement = canvas.getElement();
      const rect = canvasElement.getBoundingClientRect();
      
      // Position tooltip in the middle of the line
      const tooltipX = rect.left + ((startPoint.x + point.x) / 2 * zoom) + offset.left;
      const tooltipY = rect.top + ((startPoint.y + point.y) / 2 * zoom) + offset.top - 20;
      
      distanceTooltipRef.current.style.left = `${tooltipX}px`;
      distanceTooltipRef.current.style.top = `${tooltipY}px`;
      distanceTooltipRef.current.style.display = 'block';
      distanceTooltipRef.current.textContent = `${distance}px`;
    }
  };
  
  // Complete the line drawing
  const completeDrawing = (point: Point) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !isDrawing) return;
    
    // Update final point
    setCurrentPoint(point);
    
    if (currentLine && startPoint) {
      // Update line with final coordinates
      currentLine.set({
        x1: startPoint.x,
        y1: startPoint.y,
        x2: point.x,
        y2: point.y
      });
      
      canvas.renderAll();
      
      // Hide distance tooltip
      if (distanceTooltipRef.current) {
        distanceTooltipRef.current.style.display = 'none';
      }
      
      // Save canvas state for undo/redo
      saveCurrentState();
      
      logger.info('Completed drawing line', { 
        start: startPoint, 
        end: point,
        lineId: currentLine.get('id')
      });
    }
    
    // Reset drawing state
    setIsDrawing(false);
    setCurrentLine(null);
  };
  
  // Cancel the current drawing operation
  const cancelDrawing = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !isDrawing) return;
    
    // Remove the current line if it exists
    if (currentLine) {
      canvas.remove(currentLine);
      canvas.renderAll();
    }
    
    // Hide distance tooltip
    if (distanceTooltipRef.current) {
      distanceTooltipRef.current.style.display = 'none';
    }
    
    // Reset drawing state
    setIsDrawing(false);
    setCurrentLine(null);
    setStartPoint(null);
    setCurrentPoint(null);
    
    logger.info('Drawing cancelled');
  };
  
  return {
    isDrawing,
    isActive,
    isToolInitialized,
    startPoint,
    currentPoint,
    currentLine,
    startDrawing,
    continueDrawing,
    completeDrawing,
    cancelDrawing,
    setIsToolInitialized
  };
};
