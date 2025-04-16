import { useCallback } from 'react';
import { Canvas as FabricCanvas, Line, Text } from 'fabric';
import { toast } from 'sonner';
import { captureMessage, captureError } from '@/utils/sentry';
import logger from '@/utils/logger';

/**
 * Hook for finalizing line drawing
 */
export const useLineFinalizer = (
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>,
  saveCurrentState: () => void
) => {
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
    finalizeLine,
    removeLine
  };
};
