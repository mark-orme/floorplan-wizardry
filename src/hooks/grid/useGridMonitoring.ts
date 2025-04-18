
import { useCallback, useEffect, useRef } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { toast } from 'sonner';
import logger from '@/utils/logger';

interface UseGridMonitoringProps {
  canvas: FabricCanvas | null;
  gridObjects: FabricObject[];
  onGridError?: (error: Error) => void;
}

export const useGridMonitoring = ({ 
  canvas, 
  gridObjects,
  onGridError 
}: UseGridMonitoringProps) => {
  const monitoringIntervalRef = useRef<number>();
  
  const checkGridHealth = useCallback(() => {
    if (!canvas) return;
    
    try {
      const visibleGridObjects = gridObjects.filter(obj => obj.visible);
      
      if (visibleGridObjects.length === 0) {
        logger.warn('Grid visibility issue detected');
        gridObjects.forEach(obj => {
          obj.visible = true;
        });
        canvas.requestRenderAll();
      }
      
      const misalignedObjects = gridObjects.filter(obj => {
        const bounds = obj.getBoundingRect();
        return bounds.left < 0 || bounds.top < 0;
      });
      
      if (misalignedObjects.length > 0) {
        logger.warn('Grid alignment issue detected');
        misalignedObjects.forEach(obj => {
          obj.setPositionByOrigin({ x: 0, y: 0 }, 'left', 'top');
        });
        canvas.requestRenderAll();
      }
    } catch (error) {
      logger.error('Grid monitoring error:', error);
      onGridError?.(error as Error);
    }
  }, [canvas, gridObjects, onGridError]);
  
  useEffect(() => {
    // Start monitoring interval
    monitoringIntervalRef.current = window.setInterval(checkGridHealth, 5000);
    
    return () => {
      if (monitoringIntervalRef.current) {
        clearInterval(monitoringIntervalRef.current);
      }
    };
  }, [checkGridHealth]);
  
  return { checkGridHealth };
};
