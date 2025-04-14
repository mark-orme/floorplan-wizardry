
/**
 * Canvas Drawing Logger Hook
 * Tracks and logs drawing events for observability
 */
import { useEffect, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import { captureMessage } from '@/utils/sentry';
import logger from '@/utils/logger';
import { getDrawingSessionId } from '@/features/drawing/state/drawingMetrics';

interface UseCanvasDrawingLoggerProps {
  canvas: FabricCanvas | null;
  tool: DrawingMode;
  lineThickness?: number;
  lineColor?: string;
}

/**
 * Hook to track and log drawing events
 */
export const useCanvasDrawingLogger = ({
  canvas,
  tool,
  lineThickness,
  lineColor
}: UseCanvasDrawingLoggerProps) => {
  const prevToolRef = useRef<DrawingMode | null>(null);
  const sessionIdRef = useRef<string>(getDrawingSessionId());
  const eventCountRef = useRef<Record<string, number>>({});
  
  // Log tool changes
  useEffect(() => {
    if (!canvas || prevToolRef.current === tool) return;
    
    // Track and log tool changes
    logger.info('[tool-change] Drawing tool changed', {
      previousTool: prevToolRef.current,
      newTool: tool,
      lineThickness,
      lineColor,
      sessionId: sessionIdRef.current
    });
    
    // Report significant tool changes to Sentry
    captureMessage(
      'Drawing tool changed',
      'tool-change',
      {
        level: 'info',
        tags: {
          previousTool: prevToolRef.current || 'none',
          newTool: tool,
          drawingSession: sessionIdRef.current
        },
        extra: {
          lineSettings: {
            thickness: lineThickness,
            color: lineColor
          }
        }
      }
    );
    
    prevToolRef.current = tool;
  }, [canvas, tool, lineThickness, lineColor]);
  
  // Track object events
  useEffect(() => {
    if (!canvas) return;
    
    const trackEvent = (eventName: string, obj: any) => {
      // Increment event counter
      eventCountRef.current[eventName] = (eventCountRef.current[eventName] || 0) + 1;
      
      // Log event
      logger.info(`[canvas-event] ${eventName}`, {
        objectType: obj?.type || 'unknown',
        tool,
        sessionId: sessionIdRef.current,
        count: eventCountRef.current[eventName]
      });
    };
    
    // Add canvas object event listeners
    const objectAddedHandler = (e: any) => trackEvent('object:added', e.target);
    const objectModifiedHandler = (e: any) => trackEvent('object:modified', e.target);
    const objectRemovedHandler = (e: any) => trackEvent('object:removed', e.target);
    
    canvas.on('object:added', objectAddedHandler);
    canvas.on('object:modified', objectModifiedHandler);
    canvas.on('object:removed', objectRemovedHandler);
    
    // Add drawing event listeners
    const pathCreatedHandler = () => trackEvent('path:created', { type: 'path' });
    canvas.on('path:created', pathCreatedHandler);
    
    // Add zoom event listeners
    const zoomChangedHandler = (e: { zoom: number }) => {
      logger.info('[canvas-event] zoom:changed', {
        zoomLevel: e.zoom,
        sessionId: sessionIdRef.current
      });
    };
    
    // Use the correct event name and handler type for zoom
    canvas.on('zoom:changed', zoomChangedHandler);
    
    // Cleanup
    return () => {
      canvas.off('object:added', objectAddedHandler);
      canvas.off('object:modified', objectModifiedHandler);
      canvas.off('object:removed', objectRemovedHandler);
      canvas.off('path:created', pathCreatedHandler);
      canvas.off('zoom:changed', zoomChangedHandler);
    };
  }, [canvas, tool]);
  
  return null;
};

export default useCanvasDrawingLogger;
