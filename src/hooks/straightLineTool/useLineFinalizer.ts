
import { useCallback } from 'react';
import { Canvas as FabricCanvas, Line } from 'fabric';
import { toast } from 'sonner';
import logger from '@/utils/logger';

export const useLineFinalizer = (
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>,
  saveCurrentState: () => void
) => {
  const finalizeLine = useCallback((line: Line) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !line) return;

    try {
      // Ensure line is selectable and visible
      line.set({
        selectable: true,
        evented: true,
        objectType: 'wall'
      });

      canvas.requestRenderAll();
      saveCurrentState();
      logger.debug('Line finalized', { lineId: line.id });
    } catch (error) {
      logger.error('Error finalizing line:', error);
      toast.error('Error completing line draw');
    }
  }, [fabricCanvasRef, saveCurrentState]);

  const removeLine = useCallback((line: Line) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !line) return;

    try {
      canvas.remove(line);
      canvas.requestRenderAll();
      saveCurrentState();
      logger.debug('Line removed', { lineId: line.id });
    } catch (error) {
      logger.error('Error removing line:', error);
      toast.error('Error removing line');
    }
  }, [fabricCanvasRef, saveCurrentState]);

  return {
    finalizeLine,
    removeLine
  };
};
