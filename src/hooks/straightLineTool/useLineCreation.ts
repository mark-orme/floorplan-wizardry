
import { useCallback } from 'react';
import { Canvas as FabricCanvas, Line, Text } from 'fabric';

/**
 * Hook for creating and managing line objects
 */
export const useLineCreation = () => {
  /**
   * Create a new line on the canvas
   * @param canvas - The fabric canvas
   * @param startX - Starting X coordinate
   * @param startY - Starting Y coordinate
   * @param endX - End X coordinate
   * @param endY - End Y coordinate
   * @param lineColor - Line color
   * @param lineThickness - Line thickness
   * @returns The created line object
   */
  const createLine = useCallback((
    canvas: FabricCanvas | null,
    startX: number, 
    startY: number, 
    endX: number, 
    endY: number,
    lineColor: string,
    lineThickness: number
  ) => {
    if (!canvas) return null;
    
    try {
      // Create initial line
      const line = new Line(
        [startX, startY, endX, endY],
        {
          stroke: lineColor,
          strokeWidth: lineThickness,
          selectable: false,
          evented: false,
          objectType: 'straight-line'
        }
      );
      
      // Add to canvas
      canvas.add(line);
      canvas.requestRenderAll();
      
      return line;
    } catch (error) {
      console.error("Error creating line", error);
      return null;
    }
  }, []);
  
  /**
   * Create or update a distance tooltip
   * @param canvas - The fabric canvas
   * @param text - Text to display
   * @param x - X position
   * @param y - Y position
   * @returns The created or updated tooltip
   */
  const createDistanceTooltip = useCallback((
    canvas: FabricCanvas | null,
    text: string,
    x: number,
    y: number
  ) => {
    if (!canvas) return null;
    
    try {
      // Create new tooltip
      const tooltip = new Text(text, {
        left: x,
        top: y,
        fontSize: 12,
        fill: '#000000',
        backgroundColor: 'rgba(255,255,255,0.7)',
        padding: 2,
        objectType: 'measurement',
        selectable: false,
        originX: 'center',
        originY: 'bottom'
      });
      
      canvas.add(tooltip);
      return tooltip;
    } catch (error) {
      console.error("Error creating tooltip", error);
      return null;
    }
  }, []);

  return {
    createLine,
    createDistanceTooltip
  };
};
