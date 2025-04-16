
import { useCallback } from 'react';
import { Canvas as FabricCanvas, Line, Text } from 'fabric';

/**
 * Hook for creating and managing line objects
 */
export const useLineCreation = () => {
  // Create a line
  const createLine = useCallback((
    canvas: FabricCanvas | null,
    x1: number, 
    y1: number, 
    x2: number, 
    y2: number,
    lineColor: string,
    lineThickness: number
  ) => {
    if (!canvas) return null;
    
    try {
      const line = new Line([x1, y1, x2, y2], {
        stroke: lineColor,
        strokeWidth: lineThickness,
        selectable: true,
        evented: true,
        objectType: 'straight-line'
      });
      
      canvas.add(line);
      return line;
    } catch (error) {
      console.error('Error creating line:', error);
      return null;
    }
  }, []);
  
  // Create a distance tooltip
  const createDistanceTooltip = useCallback((
    canvas: FabricCanvas | null,
    x: number, 
    y: number, 
    distance: number
  ) => {
    if (!canvas) return null;
    
    try {
      // Convert distance to meters (assuming 100px = 1m)
      const meters = (distance / 100).toFixed(1);
      
      const tooltip = new Text(`${meters}m`, {
        left: x,
        top: y - 10,  // Position above the line
        fontSize: 12,
        fill: '#000000',
        backgroundColor: 'rgba(255,255,255,0.7)',
        padding: 2,
        selectable: false,
        evented: false,
        objectType: 'measurement'
      });
      
      canvas.add(tooltip);
      return tooltip;
    } catch (error) {
      console.error('Error creating tooltip:', error);
      return null;
    }
  }, []);

  return {
    createLine,
    createDistanceTooltip
  };
};
