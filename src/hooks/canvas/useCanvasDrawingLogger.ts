
/**
 * Hook that provides structured logging for canvas operations
 * Uses the improved logger utility to avoid excessive logs in production
 */
import { useCallback } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import logger from '@/utils/logger';

interface UseCanvasDrawingLoggerOptions {
  debugEnabled?: boolean;
}

export const useCanvasDrawingLogger = ({ 
  debugEnabled = false 
}: UseCanvasDrawingLoggerOptions = {}) => {
  // Log initialization
  const logInitialization = useCallback((canvas: FabricCanvas | null) => {
    if (!canvas) {
      logger.warn('Canvas initialization failed - canvas is null');
      return;
    }
    
    const dimensions = {
      width: canvas.width,
      height: canvas.height,
      zoom: canvas.getZoom(),
      objects: canvas.getObjects().length
    };
    
    logger.info('Canvas initialization complete', dimensions);
    
    if (debugEnabled) {
      logger.debug('Canvas debug details', {
        viewportTransform: canvas.viewportTransform,
        renderOnAddRemove: canvas.renderOnAddRemove,
        selection: canvas.selection
      });
    }
  }, [debugEnabled]);
  
  // Log object operations
  const logObjectAction = useCallback((action: string, obj: FabricObject | null) => {
    if (!obj) return;
    
    const objInfo = {
      type: obj.type,
      id: (obj as any).id || 'unknown',
      position: { left: obj.left, top: obj.top },
      visible: obj.visible
    };
    
    logger.debug(`Canvas object ${action}`, objInfo);
  }, []);
  
  // Log state changes
  const logStateChange = useCallback((action: string, details: Record<string, any>) => {
    logger.info(`Canvas state ${action}`, details);
  }, []);
  
  return {
    logInitialization,
    logObjectAction,
    logStateChange
  };
};

export default useCanvasDrawingLogger;
