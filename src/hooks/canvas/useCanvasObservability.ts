
import { useCallback, useEffect, useRef } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import { captureMessage } from '@/utils/sentry';
import logger from '@/utils/logger';
import { v4 as uuidv4 } from 'uuid';

export interface CanvasOperation {
  type: 'create' | 'modify' | 'delete' | 'clear' | 'zoom' | 'pan' | 'tool-change';
  timestamp: number;
  tool?: DrawingMode;
  objectCount?: number;
  objectIds?: string[];
  metadata?: Record<string, any>;
}

/**
 * Hook for tracking canvas operations and logging for observability
 * Enriches Sentry events with drawing context
 */
export const useCanvasObservability = (
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>,
  currentTool: DrawingMode
) => {
  // Create and maintain session ID for this drawing session
  const sessionIdRef = useRef<string>('');
  const operationsRef = useRef<CanvasOperation[]>([]);
  const lastToolRef = useRef<DrawingMode>(currentTool);
  
  // Initialize session tracking
  useEffect(() => {
    // Generate unique session ID if not already set
    if (!sessionIdRef.current) {
      sessionIdRef.current = uuidv4();
      
      // Store in sessionStorage for Sentry context
      window.sessionStorage.setItem('drawingSessionId', sessionIdRef.current);
      window.sessionStorage.setItem('sessionStartTime', Date.now().toString());
      window.sessionStorage.setItem('canvasOperationsCount', '0');
      
      // Initialize tracking in global window object for Sentry access
      if (typeof window !== 'undefined') {
        // Ensure app_state exists
        window.__app_state = window.__app_state || {};
        window.__app_state.drawing = window.__app_state.drawing || {};
        window.__app_state.drawing.currentTool = currentTool;
        
        // Initialize canvas state
        window.__canvas_state = window.__canvas_state || {};
      }
      
      logger.info('Canvas session initialized', {
        sessionId: sessionIdRef.current,
        initialTool: currentTool
      });
      
      // Log to Sentry for session tracking
      captureMessage(
        'Drawing session started',
        'drawing-session-start',
        {
          tags: {
            sessionId: sessionIdRef.current,
            initialTool: currentTool
          },
          extra: {
            timestamp: Date.now(),
            userAgent: navigator.userAgent
          }
        }
      );
    }
    
    // Cleanup on unmount
    return () => {
      // Log session end
      const operationCount = operationsRef.current.length;
      logger.info('Canvas session ended', {
        sessionId: sessionIdRef.current,
        operationCount,
        sessionDuration: Date.now() - Number(window.sessionStorage.getItem('sessionStartTime') || 0)
      });
      
      // Clear session storage
      window.sessionStorage.removeItem('drawingSessionId');
      window.sessionStorage.removeItem('sessionStartTime');
      window.sessionStorage.removeItem('canvasOperationsCount');
    };
  }, [currentTool]);
  
  // Track tool changes
  useEffect(() => {
    if (lastToolRef.current !== currentTool) {
      // Update global state for Sentry
      if (window.__app_state?.drawing) {
        window.__app_state.drawing.currentTool = currentTool;
      }
      
      // Log tool change
      trackOperation({
        type: 'tool-change',
        timestamp: Date.now(),
        tool: currentTool,
        metadata: {
          previousTool: lastToolRef.current
        }
      });
      
      lastToolRef.current = currentTool;
    }
  }, [currentTool]);
  
  // Update canvas dimensions for Sentry whenever the canvas changes
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    const updateCanvasDimensions = () => {
      // Update global state for Sentry access
      if (window.__canvas_state) {
        window.__canvas_state.width = canvas.width;
        window.__canvas_state.height = canvas.height;
        window.__canvas_state.zoom = canvas.getZoom();
        window.__canvas_state.objectCount = canvas.getObjects().length;
      }
    };
    
    // Initial update
    updateCanvasDimensions();
    
    // Set up event listeners for dimension changes
    canvas.on('object:added', updateCanvasDimensions);
    canvas.on('object:removed', updateCanvasDimensions);
    canvas.on('canvas:resized', updateCanvasDimensions);
    canvas.on('zoom:changed', updateCanvasDimensions);
    
    return () => {
      // Remove event listeners on cleanup
      canvas.off('object:added', updateCanvasDimensions);
      canvas.off('object:removed', updateCanvasDimensions);
      canvas.off('canvas:resized', updateCanvasDimensions);
      canvas.off('zoom:changed', updateCanvasDimensions);
    };
  }, [fabricCanvasRef.current]);
  
  /**
   * Track a canvas operation for logging and observability
   */
  const trackOperation = useCallback((operation: CanvasOperation) => {
    // Add to operations history
    operationsRef.current.push(operation);
    
    // Update session storage for Sentry access
    const count = operationsRef.current.length;
    window.sessionStorage.setItem('canvasOperationsCount', count.toString());
    
    // Log the operation
    logger.info(`Canvas operation: ${operation.type}`, {
      sessionId: sessionIdRef.current,
      tool: operation.tool || currentTool,
      objectCount: operation.objectCount,
      operationCount: count,
      ...operation.metadata
    });
    
    // For significant operations, send to Sentry
    if (['clear', 'tool-change'].includes(operation.type)) {
      captureMessage(
        `Canvas ${operation.type}`,
        `canvas-${operation.type}`,
        {
          level: 'info',
          tags: {
            sessionId: sessionIdRef.current,
            tool: operation.tool || currentTool,
            operationType: operation.type
          },
          extra: {
            operation,
            operationCount: count,
            timestamp: Date.now()
          }
        }
      );
    }
  }, [currentTool]);
  
  /**
   * Log an object creation event
   */
  const logObjectCreated = useCallback((object: FabricObject) => {
    trackOperation({
      type: 'create',
      timestamp: Date.now(),
      tool: currentTool,
      objectIds: [object.id?.toString() || ''],
      metadata: {
        objectType: object.type,
        properties: {
          left: object.left,
          top: object.top,
          width: object.width,
          height: object.height
        }
      }
    });
  }, [currentTool, trackOperation]);
  
  /**
   * Log an object modification event
   */
  const logObjectModified = useCallback((object: FabricObject) => {
    trackOperation({
      type: 'modify',
      timestamp: Date.now(),
      tool: currentTool,
      objectIds: [object.id?.toString() || ''],
      metadata: {
        objectType: object.type,
        properties: {
          left: object.left,
          top: object.top,
          width: object.width,
          height: object.height
        }
      }
    });
  }, [currentTool, trackOperation]);
  
  /**
   * Log a canvas cleared event
   */
  const logCanvasCleared = useCallback(() => {
    trackOperation({
      type: 'clear',
      timestamp: Date.now(),
      tool: currentTool,
      objectCount: 0
    });
  }, [currentTool, trackOperation]);
  
  /**
   * Log a zoom event
   */
  const logZoomChanged = useCallback((zoom: number) => {
    trackOperation({
      type: 'zoom',
      timestamp: Date.now(),
      tool: currentTool,
      metadata: {
        zoomLevel: zoom
      }
    });
  }, [currentTool, trackOperation]);
  
  /**
   * Get the current session ID
   */
  const getSessionId = useCallback(() => {
    return sessionIdRef.current;
  }, []);
  
  /**
   * Get operation statistics
   */
  const getOperationStats = useCallback(() => {
    const operations = operationsRef.current;
    const createCount = operations.filter(op => op.type === 'create').length;
    const modifyCount = operations.filter(op => op.type === 'modify').length;
    const deleteCount = operations.filter(op => op.type === 'delete').length;
    
    return {
      total: operations.length,
      createCount,
      modifyCount,
      deleteCount,
      toolChanges: operations.filter(op => op.type === 'tool-change').length,
      sessionDuration: Date.now() - Number(window.sessionStorage.getItem('sessionStartTime') || 0)
    };
  }, []);
  
  return {
    trackOperation,
    logObjectCreated,
    logObjectModified,
    logCanvasCleared,
    logZoomChanged,
    getSessionId,
    getOperationStats
  };
};
