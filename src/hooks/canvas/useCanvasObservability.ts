
/**
 * Canvas Observability Hook
 * Provides comprehensive monitoring and reporting for canvas activity
 */
import { useEffect, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import { captureMessage, captureError } from '@/utils/sentry';
import { getDrawingSessionId } from '@/features/drawing/state/drawingMetrics';
import logger from '@/utils/logger';
import { useToolMonitoring } from '@/features/drawing/hooks/useToolMonitoring';
import DOMPurify from 'dompurify';

// Define canvas event types for type safety
interface CanvasEvents {
  'object:added': { target: any };
  'object:modified': { target: any };
  'object:removed': { target: any };
  'path:created': { path: any };
  'selection:created': { selected: any[] };
  'selection:updated': { selected: any[] };
  'selection:cleared': { deselected: any[] };
  'mouse:down': { e: MouseEvent; pointer: { x: number; y: number } };
  'mouse:move': { e: MouseEvent; pointer: { x: number; y: number } };
  'mouse:up': { e: MouseEvent; pointer: { x: number; y: number } };
  'zoom:changed': { zoom: number };
}

interface UseCanvasObservabilityProps {
  canvas: FabricCanvas | null;
  tool: DrawingMode;
  lineThickness?: number;
  lineColor?: string;
  wallThickness?: number;
  wallColor?: string;
}

/**
 * Hook to provide observability for canvas activities
 */
export const useCanvasObservability = ({
  canvas,
  tool,
  lineThickness,
  lineColor,
  wallThickness,
  wallColor
}: UseCanvasObservabilityProps) => {
  const sessionIdRef = useRef<string>(getDrawingSessionId());
  const operationCountRef = useRef<Record<string, number>>({});
  const errorCountRef = useRef<number>(0);
  const lastRenderTimeRef = useRef<number>(0);
  
  // Use the tool monitoring hook
  useToolMonitoring(tool);
  
  // Initialize canvas monitoring
  useEffect(() => {
    if (!canvas) return;
    
    const now = Date.now();
    lastRenderTimeRef.current = now;
    
    // Update window.__canvas_state for improved debugging
    if (typeof window !== 'undefined') {
      window.__canvas_state = {
        width: canvas.width,
        height: canvas.height,
        zoom: canvas.getZoom(),
        objectCount: canvas.getObjects().length,
        gridVisible: canvas.getObjects().some((obj: any) => obj.isGrid),
        lastOperation: 'initialize'
      };
    }
    
    logger.info('Canvas observability initialized', {
      timestamp: now,
      sessionId: sessionIdRef.current,
      canvasWidth: canvas.width,
      canvasHeight: canvas.height,
      initialZoom: canvas.getZoom(),
      initialObjectCount: canvas.getObjects().length
    });
    
    // Report canvas initialization to Sentry
    captureMessage(
      'Canvas initialized',
      'canvas-initialized',
      {
        level: 'info',
        tags: {
          drawingSession: sessionIdRef.current,
          initialTool: tool
        },
        extra: {
          dimensions: `${canvas.width}x${canvas.height}`,
          initialZoom: canvas.getZoom(),
          timestamp: new Date().toISOString()
        }
      }
    );
  }, [canvas]);
  
  // Monitor canvas rendering performance
  useEffect(() => {
    if (!canvas) return;
    
    const trackRenderingPerformance = () => {
      const now = Date.now();
      const renderTime = now - lastRenderTimeRef.current;
      lastRenderTimeRef.current = now;
      
      // Log only if significant render time (> 16ms) to avoid noise
      if (renderTime > 16) {
        logger.info('Canvas render performance', {
          renderTimeMs: renderTime,
          objectCount: canvas.getObjects().length,
          zoom: canvas.getZoom()
        });
      }
    };
    
    // Track after render event
    canvas.on('after:render', trackRenderingPerformance);
    
    // Handle resize events
    const handleResize = () => {
      if (canvas) {
        logger.info('Canvas resized', {
          width: canvas.width,
          height: canvas.height,
          sessionId: sessionIdRef.current
        });
        
        // Update window.__canvas_state
        if (typeof window !== 'undefined' && window.__canvas_state) {
          window.__canvas_state.width = canvas.width;
          window.__canvas_state.height = canvas.height;
        }
      }
    };
    
    // Use standard event listener for resize
    window.addEventListener('resize', handleResize);
    
    return () => {
      canvas.off('after:render', trackRenderingPerformance);
      window.removeEventListener('resize', handleResize);
    };
  }, [canvas]);
  
  // Monitor canvas errors
  useEffect(() => {
    if (!canvas) return;
    
    const handleError = (error: Error) => {
      errorCountRef.current++;
      
      // Log the error
      logger.error('Canvas operation error', {
        error: error.message,
        stack: error.stack,
        tool,
        sessionId: sessionIdRef.current,
        errorCount: errorCountRef.current
      });
      
      // Report to Sentry
      captureError(error, 'canvas-operation-error', {
        level: 'error',
        tags: {
          tool,
          drawingSession: sessionIdRef.current
        },
        extra: {
          errorCount: errorCountRef.current,
          canvasState: window.__canvas_state || {}
        }
      });
    };
    
    // Set up global error handlers related to canvas
    const originalWindowErrorHandler = window.onerror;
    window.onerror = function(message, source, lineno, colno, error) {
      // Only capture errors that might be canvas-related
      if (
        error && 
        (message.toString().includes('canvas') || 
         message.toString().includes('fabric') ||
         source?.includes('fabric'))
      ) {
        handleError(error);
      }
      
      // Call original handler if exists
      if (originalWindowErrorHandler) {
        return originalWindowErrorHandler(message, source, lineno, colno, error);
      }
      return false;
    };
    
    return () => {
      window.onerror = originalWindowErrorHandler;
    };
  }, [canvas, tool]);
  
  return null;
};

export default useCanvasObservability;
