
import { useCallback } from 'react';
import { Canvas as FabricCanvas, Line, Text } from 'fabric';
import { v4 as uuidv4 } from 'uuid';

/**
 * Hook for creating and finalizing lines
 */
export const useLineCreation = () => {
  /**
   * Create a new line on the canvas
   */
  const createLine = useCallback((
    canvas: FabricCanvas | null,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    lineColor: string = '#000000',
    lineThickness: number = 2
  ): Line | null => {
    if (!canvas) return null;
    
    try {
      // Create line
      const line = new Line([x1, y1, x2, y2], {
        stroke: lineColor,
        strokeWidth: lineThickness,
        selectable: true,
        evented: true,
        objectCaching: true
      });
      
      // Add ID for tracking
      (line as any).id = `line-${uuidv4()}`;
      
      // Add to canvas
      canvas.add(line);
      canvas.renderAll();
      
      return line;
    } catch (error) {
      console.error('Error creating line:', error);
      return null;
    }
  }, []);
  
  /**
   * Create a distance tooltip
   */
  const createDistanceTooltip = useCallback((
    canvas: FabricCanvas,
    text: string,
    x: number,
    y: number
  ): Text => {
    // Create tooltip
    const tooltip = new Text(text, {
      left: x,
      top: y,
      fontSize: 12,
      fill: '#000000',
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      padding: 5,
      selectable: false,
      evented: false
    });
    
    // Add to canvas
    canvas.add(tooltip);
    canvas.renderAll();
    
    return tooltip;
  }, []);
  
  return {
    createLine,
    createDistanceTooltip
  };
};
