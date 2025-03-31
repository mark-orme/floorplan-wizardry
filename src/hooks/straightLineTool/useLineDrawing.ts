import { useCallback } from 'react';
import { Canvas as FabricCanvas, Line, Text } from 'fabric';
import { toast } from 'sonner';
import { useSnapToGrid } from '../useSnapToGrid';
import { captureMessage, captureError } from '@/utils/sentry';
import logger from '@/utils/logger';

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
  
  /**
   * Create a new line on the canvas
   * @param startX - Starting X coordinate
   * @param startY - Starting Y coordinate
   * @returns The created line object
   */
  const createLine = useCallback((startX: number, startY: number) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return null;
    
    try {
      // Create initial line
      const line = new Line(
        [startX, startY, startX, startY],
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
      captureError(error as Error, "straight-line-creation-error");
      logger.error("Error creating line", error);
      return null;
    }
  }, [fabricCanvasRef, lineColor, lineThickness]);
  
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
      
      // Calculate distance for tooltip
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const distanceInMeters = (distance / 100).toFixed(1); // 100px = 1m
      
      // Position for tooltip (midpoint of line)
      const midX = (start.x + end.x) / 2;
      const midY = (start.y + end.y) / 2 - 10; // Position slightly above the line
      
      return {
        distance,
        distanceInMeters,
        tooltipPosition: { x: midX, y: midY }
      };
    } catch (error) {
      captureError(error as Error, "straight-line-update-error");
      logger.error("Error updating line", error);
      return null;
    }
  }, [snapLineToGrid]);
  
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
      captureError(error as Error, "tooltip-creation-error");
      logger.error("Error creating/updating tooltip", error);
      return null;
    }
  }, [fabricCanvasRef]);
  
  /**
   * Finalize the line drawing
   * @param line - The line object
   * @param tooltip - The tooltip object
   * @param distance - The line distance
   * @returns Whether the operation succeeded
   */
  const finalizeLine = useCallback((
    line: Line,
    tooltip: Text | null,
    distance: number
  ) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !line) return false;
    
    try {
      // Only keep the line if it has a meaningful length
      if (distance > 5) {
        // Save current state for undo
        saveCurrentState();
        
        // Convert to meters (assuming 100 pixels = 1 meter)
        const distanceInMeters = (distance / 100).toFixed(1);
        
        // Update line properties
        line.set({
          selectable: true,
          evented: true,
          objectType: 'straight-line',
          measurement: `${distanceInMeters}m`
        });
        
        // Keep tooltip
        if (tooltip) {
          tooltip.set({
            selectable: false,
            evented: true,
            objectType: 'measurement'
          });
        }
        
        toast.success(`Line created: ${distanceInMeters}m`);
        return true;
      } else {
        // Line too short, remove it
        canvas.remove(line);
        if (tooltip) {
          canvas.remove(tooltip);
        }
        captureMessage("Straight line discarded (too short)", "straight-line-discarded");
        return false;
      }
    } catch (error) {
      captureError(error as Error, "straight-line-finalize-error");
      logger.error("Error finalizing line", error);
      return false;
    }
  }, [fabricCanvasRef, saveCurrentState]);
  
  /**
   * Remove line and tooltip from canvas
   * @param line - The line object
   * @param tooltip - The tooltip object
   */
  const removeLine = useCallback((
    line: Line | null,
    tooltip: Text | null
  ) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    try {
      // Remove the line being drawn
      if (line) {
        canvas.remove(line);
      }
      
      // Remove the tooltip
      if (tooltip) {
        canvas.remove(tooltip);
      }
      
      canvas.requestRenderAll();
    } catch (error) {
      captureError(error as Error, "straight-line-removal-error");
      logger.error("Error removing line", error);
    }
  }, [fabricCanvasRef]);
  
  return {
    snapPointToGrid,
    createLine,
    updateLine,
    createOrUpdateTooltip,
    finalizeLine,
    removeLine
  };
};
