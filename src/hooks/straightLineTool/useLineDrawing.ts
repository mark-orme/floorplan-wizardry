
import { useCallback } from 'react';
import { Canvas as FabricCanvas, Line, Text } from 'fabric';
import { Point } from '@/types/core/Point';
import { useSnapToGrid } from '../useSnapToGrid';
import { useLineCreation } from './useLineCreation';
import { useMeasurementCalculation } from './useMeasurementCalculation';
import { useLineFinalizer } from './useLineFinalizer';

/**
 * Hook for line drawing operations
 */
export const useLineDrawing = (
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>,
  lineColor: string,
  lineThickness: number,
  saveCurrentState: () => void
) => {
  const { snapPointToGrid, snapLineToGrid } = useSnapToGrid();
  const { createLine, createDistanceTooltip } = useLineCreation();
  const { calculateMeasurement } = useMeasurementCalculation();
  const { finalizeLine, removeLine } = useLineFinalizer(fabricCanvasRef, saveCurrentState);
  
  /**
   * Create a new line on the canvas
   * @param startX - Starting X coordinate
   * @param startY - Starting Y coordinate
   * @returns The created line object
   */
  const createNewLine = useCallback((startX: number, startY: number) => {
    return createLine(
      fabricCanvasRef.current,
      startX,
      startY,
      startX,
      startY,
      lineColor,
      lineThickness
    );
  }, [fabricCanvasRef, lineColor, lineThickness, createLine]);
  
  /**
   * Update an existing line with new end coordinates
   * @param line - The line to update
   * @param startX - Start X coordinate
   * @param startY - Starting Y coordinate
   * @param endX - End X coordinate
   * @param endY - End Y coordinate
   * @returns Measurement information
   */
  const updateLine = useCallback((
    line: Line, 
    startX: number, 
    startY: number, 
    endX: number, 
    endY: number
  ) => {
    if (!line) return null;
    
    try {
      // Apply additional constraints (like straight horizontal/vertical lines)
      const { start, end } = snapLineToGrid(
        { x: startX, y: startY },
        { x: endX, y: endY }
      );
      
      // Update the line
      line.set({
        x2: end.x,
        y2: end.y
      });
      
      // Calculate measurement data
      return calculateMeasurement(start, end);
    } catch (error) {
      console.error("Error updating line", error);
      return null;
    }
  }, [snapLineToGrid, calculateMeasurement]);
  
  /**
   * Create or update the distance tooltip
   * @param tooltipRef - Reference to the tooltip object
   * @param text - Text to display
   * @param x - X position
   * @param y - Y position
   * @returns The created or updated tooltip
   */
  const createOrUpdateTooltip = useCallback((
    tooltipRef: React.MutableRefObject<Text | null>,
    text: string,
    x: number,
    y: number
  ) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return null;
    
    try {
      if (!tooltipRef.current) {
        // Create new tooltip
        const tooltip = createDistanceTooltip(canvas, text, x, y);
        return tooltip;
      } else {
        // Update existing tooltip
        tooltipRef.current.set({
          text,
          left: x,
          top: y
        });
        return tooltipRef.current;
      }
    } catch (error) {
      console.error("Error creating/updating tooltip", error);
      return null;
    }
  }, [fabricCanvasRef, createDistanceTooltip]);
  
  return {
    snapPointToGrid,
    createLine: createNewLine,
    updateLine,
    createOrUpdateTooltip,
    finalizeLine,
    removeLine
  };
};
