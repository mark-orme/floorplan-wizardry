
import { useCallback, useEffect, useRef } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import { useCanvasObservability } from './useCanvasObservability';
import { captureMessage } from '@/utils/sentry';
import { registerCanvasForDebugging } from '@/utils/diagnostics/drawingToolValidator';
import logger from '@/utils/logger';

/**
 * Hook that integrates observability and logging into canvas drawing operations
 * This provides enhanced monitoring capabilities for drawing tools
 */
export const useCanvasDrawingLogger = (
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>,
  tool: DrawingMode,
  lineThickness: number,
  lineColor: string
) => {
  // Set up observability tools
  const {
    trackOperation,
    logObjectCreated,
    logObjectModified,
    logCanvasCleared,
    logZoomChanged,
    getSessionId,
    getOperationStats
  } = useCanvasObservability(fabricCanvasRef, tool);
  
  // Store the last operation time to avoid duplicate logs
  const lastOperationTimeRef = useRef<number>(0);
  
  // Register canvas for debugging when first initialized
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (canvas) {
      // Register for debugging
      registerCanvasForDebugging(canvas);
      
      // Log initialization
      logger.info('Canvas initialized for drawing', {
        width: canvas.width,
        height: canvas.height,
        tool,
        lineThickness,
        lineColor,
        sessionId: getSessionId()
      });
      
      // Update app state for Sentry
      if (window.__app_state?.drawing) {
        window.__app_state.drawing.lineColor = lineColor;
        window.__app_state.drawing.lineThickness = lineThickness;
      }
      
      // Report to Sentry
      captureMessage(
        'Canvas initialized for drawing',
        'canvas-initialized',
        {
          tags: {
            tool,
            sessionId: getSessionId()
          },
          extra: {
            dimensions: {
              width: canvas.width,
              height: canvas.height
            },
            settings: {
              lineColor,
              lineThickness
            }
          }
        }
      );
    }
  }, [fabricCanvasRef.current]);
  
  // Set up event listeners for drawing events
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Track object creation
    const handleObjectAdded = (e: { target: FabricObject }) => {
      const now = Date.now();
      // Debounce to avoid duplicate logs
      if (now - lastOperationTimeRef.current < 100) return;
      
      lastOperationTimeRef.current = now;
      
      // Skip grid objects
      if ((e.target as any).isGrid || (e.target as any).objectType === 'grid') return;
      
      logObjectCreated(e.target);
    };
    
    // Track object modification
    const handleObjectModified = (e: { target: FabricObject }) => {
      const now = Date.now();
      // Debounce to avoid duplicate logs
      if (now - lastOperationTimeRef.current < 100) return;
      
      lastOperationTimeRef.current = now;
      
      // Skip grid objects
      if ((e.target as any).isGrid || (e.target as any).objectType === 'grid') return;
      
      logObjectModified(e.target);
    };
    
    // Track zoom changes
    const handleZoomChanged = (e: { scale: number }) => {
      const now = Date.now();
      // Debounce to avoid duplicate logs
      if (now - lastOperationTimeRef.current < 100) return;
      
      lastOperationTimeRef.current = now;
      
      // Update zoom level in global state for Sentry
      if (window.__canvas_state) {
        window.__canvas_state.zoom = e.scale;
      }
      
      logZoomChanged(e.scale);
    };
    
    // Register event listeners
    canvas.on('object:added', handleObjectAdded);
    canvas.on('object:modified', handleObjectModified);
    canvas.on('zoom:changed', handleZoomChanged);
    
    // Clean up listeners on unmount
    return () => {
      canvas.off('object:added', handleObjectAdded);
      canvas.off('object:modified', handleObjectModified);
      canvas.off('zoom:changed', handleZoomChanged);
    };
  }, [fabricCanvasRef.current, logObjectCreated, logObjectModified, logZoomChanged]);
  
  // Update line properties in global state for Sentry
  useEffect(() => {
    if (window.__app_state?.drawing) {
      window.__app_state.drawing.lineColor = lineColor;
      window.__app_state.drawing.lineThickness = lineThickness;
    }
  }, [lineColor, lineThickness]);
  
  /**
   * Log canvas clear operation
   */
  const handleClearLog = useCallback(() => {
    logCanvasCleared();
  }, [logCanvasCleared]);
  
  /**
   * Get detailed debugging information about the canvas
   */
  const getDebugInfo = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return null;
    
    return {
      canvas: {
        width: canvas.width,
        height: canvas.height,
        zoom: canvas.getZoom(),
        isDrawingMode: canvas.isDrawingMode,
        objectCount: canvas.getObjects().length,
        hasSelection: canvas.getActiveObjects().length > 0
      },
      drawing: {
        tool,
        lineColor,
        lineThickness
      },
      session: {
        id: getSessionId(),
        ...getOperationStats()
      }
    };
  }, [fabricCanvasRef, tool, lineColor, lineThickness, getSessionId, getOperationStats]);
  
  /**
   * Log debug information
   */
  const logDebugInfo = useCallback(() => {
    const debugInfo = getDebugInfo();
    if (!debugInfo) return;
    
    logger.debug('Canvas debug information', debugInfo);
    
    // Report to Sentry
    captureMessage(
      'Canvas debug snapshot',
      'canvas-debug-snapshot',
      {
        tags: {
          tool,
          sessionId: getSessionId()
        },
        extra: debugInfo
      }
    );
  }, [getDebugInfo, tool, getSessionId]);
  
  return {
    trackOperation,
    logObjectCreated,
    logObjectModified,
    handleClearLog,
    logZoomChanged,
    getSessionId,
    getDebugInfo,
    logDebugInfo
  };
};
