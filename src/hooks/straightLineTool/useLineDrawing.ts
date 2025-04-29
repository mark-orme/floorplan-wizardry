
import { useCallback } from 'react';
import { Canvas, Line, Text } from 'fabric';
import { v4 as uuidv4 } from 'uuid';
import { Point } from '@/types/core/Point';

/**
 * Hook for creating, updating, and finalizing lines
 */
export const useLineDrawing = (
  fabricCanvasRef: React.MutableRefObject<Canvas | null>,
  lineColor: string = '#000000',
  lineThickness: number = 2,
  saveCurrentState?: () => void
) => {
  // Create a new line
  const createLine = useCallback((startPoint: Point, endPoint: Point): Line | null => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return null;
    
    try {
      // Create a new fabric Line
      const line = new Line([
        startPoint.x, 
        startPoint.y, 
        endPoint.x, 
        endPoint.y
      ], {
        stroke: lineColor,
        strokeWidth: lineThickness,
        selectable: true,
        evented: true,
        objectCaching: true
      });
      
      // Add a unique ID to the line
      line.id = `line-${uuidv4()}`;
      
      // Add line to canvas
      canvas.add(line);
      canvas.renderAll();
      
      return line;
    } catch (error) {
      console.error('Error creating line:', error);
      return null;
    }
  }, [fabricCanvasRef, lineColor, lineThickness]);
  
  // Update an existing line
  const updateLine = useCallback((line: Line, endPoint: Point): boolean => {
    if (!line) return false;
    
    try {
      // Get the original x1, y1 coordinates
      const x1 = line.x1 || 0;
      const y1 = line.y1 || 0;
      
      // Update the line's x2, y2 coordinates
      line.set({
        x2: endPoint.x,
        y2: endPoint.y
      });
      
      // Force the canvas to re-render
      const canvas = fabricCanvasRef.current;
      if (canvas) {
        canvas.renderAll();
      }
      
      return true;
    } catch (error) {
      console.error('Error updating line:', error);
      return false;
    }
  }, [fabricCanvasRef]);
  
  // Remove a line from the canvas
  const removeLine = useCallback((line: Line): boolean => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !line) return false;
    
    try {
      canvas.remove(line);
      canvas.renderAll();
      return true;
    } catch (error) {
      console.error('Error removing line:', error);
      return false;
    }
  }, [fabricCanvasRef]);
  
  // Finalize a line (apply any final adjustments, save state)
  const finalizeLine = useCallback((line: Line): boolean => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !line) return false;
    
    try {
      // Apply any final adjustments to the line here if needed
      line.setCoords?.();
      
      // Save canvas state if saveCurrentState is provided
      if (saveCurrentState) {
        saveCurrentState();
      }
      
      return true;
    } catch (error) {
      console.error('Error finalizing line:', error);
      return false;
    }
  }, [fabricCanvasRef, saveCurrentState]);
  
  // Create a distance tooltip
  const createTooltip = useCallback((text: string, position: Point): Text | null => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return null;
    
    try {
      // Create text object for the tooltip
      const tooltip = new Text(text, {
        left: position.x,
        top: position.y,
        fontSize: 12,
        fill: lineColor,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        padding: 5,
        selectable: false
      });
      
      // We must use property assignment for Text objects to avoid type errors
      if (tooltip) {
        tooltip.evented = false;
      }
      
      // Add to canvas
      canvas.add(tooltip);
      canvas.renderAll();
      
      return tooltip;
    } catch (error) {
      console.error('Error creating tooltip:', error);
      return null;
    }
  }, [fabricCanvasRef, lineColor]);
  
  return {
    createLine,
    updateLine,
    removeLine,
    finalizeLine,
    createTooltip
  };
};
