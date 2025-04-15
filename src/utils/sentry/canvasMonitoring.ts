/**
 * Canvas Monitoring Utilities for Sentry
 * Provides tools for tracking canvas-related issues and reporting them to Sentry
 */
import { Canvas as FabricCanvas } from 'fabric';
import * as Sentry from '@sentry/react';
import { captureMessage, captureError } from '@/utils/sentryUtils';
import logger from '@/utils/logger';

// Create a specialized transaction for canvas operations
export function startCanvasTransaction(operation: string): {
  finish: (status?: 'ok' | 'error') => void;
  addData: (data: Record<string, any>) => void;
} {
  const transaction = Sentry.startTransaction({
    name: `canvas.${operation}`,
    op: 'canvas',
  });
  
  const span = transaction.startChild({
    op: 'canvas.operation',
    description: `Canvas ${operation} operation`,
  });
  
  // Add initial context to transaction
  Sentry.setContext('canvas.operation', {
    name: operation,
    startTime: new Date().toISOString(),
  });
  
  return {
    finish: (status: 'ok' | 'error' = 'ok') => {
      // Add finish info to span
      span.setTag('status', status);
      span.finish();
      
      // Add finish time to transaction
      Sentry.setContext('canvas.operation', {
        name: operation,
        finishTime: new Date().toISOString(),
        status,
      });
      
      // Finish transaction
      transaction.finish();
    },
    addData: (data: Record<string, any>) => {
      // Add data to span
      Object.entries(data).forEach(([key, value]) => {
        span.setData(key, value);
      });
      
      // Update context with operation data
      Sentry.setContext('canvas.operation.data', data);
    }
  };
}

/**
 * Monitor grid visibility and report issues to Sentry
 * @param canvas The fabric canvas to monitor
 * @param gridLayerRef Reference to grid objects
 * @returns Cleanup function
 */
export function monitorGridVisibility(
  canvas: FabricCanvas | null,
  gridLayerRef: React.MutableRefObject<unknown[]>
): () => void {
  // Set initial context
  Sentry.setTag('monitoring.grid', 'active');
  
  // Set up periodic checks
  const checkInterval = setInterval(() => {
    if (!canvas) return;
    
    try {
      const gridObjects = gridLayerRef.current;
      if (!gridObjects || gridObjects.length === 0) {
        // No grid objects available
        Sentry.setContext('grid.state', {
          timestamp: new Date().toISOString(),
          status: 'missing',
          gridObjectCount: 0,
          canvasObjectCount: canvas.getObjects().length,
        });
        
        // Report missing grid
        captureMessage(
          'Grid objects missing or empty',
          'grid-missing',
          {
            level: 'warning',
            tags: {
              component: 'canvas',
              feature: 'grid',
              status: 'missing'
            }
          }
        );
        
        logger.warn('Grid monitoring detected missing grid objects');
        return;
      }
      
      // Check grid visibility
      const gridOnCanvas = gridObjects.filter(obj => canvas.contains(obj as any));
      const visibleGrid = gridObjects.filter(obj => 
        canvas.contains(obj as any) && (obj as any).visible
      );
      
      // Prepare grid state data
      const gridState = {
        timestamp: new Date().toISOString(),
        totalGridObjects: gridObjects.length,
        gridObjectsOnCanvas: gridOnCanvas.length,
        visibleGridObjects: visibleGrid.length,
        missingGridObjects: gridObjects.length - gridOnCanvas.length,
        invisibleGridObjects: gridOnCanvas.length - visibleGrid.length,
        canvasWidth: canvas.width,
        canvasHeight: canvas.height,
        totalCanvasObjects: canvas.getObjects().length,
      };
      
      // Update Sentry context
      Sentry.setContext('grid.state', gridState);
      
      // Report issues if needed
      if (gridState.missingGridObjects > 0 || gridState.invisibleGridObjects > 0) {
        captureMessage(
          `Grid visibility issue: ${gridState.missingGridObjects} missing, ${gridState.invisibleGridObjects} invisible`,
          'grid-visibility-issue',
          {
            level: 'warning',
            tags: {
              component: 'canvas',
              feature: 'grid',
              status: 'issue'
            },
            extra: {
              gridState
            }
          }
        );
        
        logger.warn('Grid visibility issue detected', gridState);
      }
    } catch (error) {
      // Report error in monitoring
      captureError(error, 'grid-monitoring-error', {
        level: 'error',
        tags: {
          component: 'canvas',
          feature: 'grid-monitoring'
        }
      });
      
      logger.error('Error in grid visibility monitoring', error);
    }
  }, 10000); // Check every 10 seconds
  
  // Return cleanup function
  return () => {
    clearInterval(checkInterval);
    Sentry.setTag('monitoring.grid', null);
  };
}

/**
 * Capture canvas rendering performance metrics
 * @param canvas The fabric canvas to monitor
 * @returns Cleanup function
 */
export function monitorCanvasPerformance(
  canvas: FabricCanvas | null
): () => void {
  if (!canvas) return () => {};
  
  // Set initial context
  Sentry.setTag('monitoring.performance', 'active');
  
  // Track render times
  const renderTimes: number[] = [];
  const renderSizes: number[] = [];
  let lastRenderTime = performance.now();
  
  // Set up canvas render event listener
  const handleRender = () => {
    const now = performance.now();
    const renderDuration = now - lastRenderTime;
    lastRenderTime = now;
    
    // Only track non-initial renders
    if (renderDuration < 1000) {
      renderTimes.push(renderDuration);
      renderSizes.push(canvas.getObjects().length);
      
      // Keep only the last 20 render times
      if (renderTimes.length > 20) {
        renderTimes.shift();
        renderSizes.shift();
      }
      
      // Report slow renders
      if (renderDuration > 100) {
        logger.warn('Slow canvas render detected', {
          renderDuration,
          objectCount: canvas.getObjects().length
        });
        
        // Only send to Sentry if really slow
        if (renderDuration > 500) {
          captureMessage(
            `Slow canvas render: ${renderDuration.toFixed(2)}ms`,
            'canvas-slow-render',
            {
              level: 'warning',
              tags: {
                component: 'canvas',
                feature: 'performance'
              },
              extra: {
                renderDuration,
                objectCount: canvas.getObjects().length,
                canvasWidth: canvas.width,
                canvasHeight: canvas.height
              }
            }
          );
        }
      }
    }
  };
  
  // Set up the event listener
  canvas.on('after:render', handleRender);
  
  // Periodically send performance metrics to Sentry
  const metricsInterval = setInterval(() => {
    if (renderTimes.length === 0) return;
    
    // Calculate average render time
    const avgRenderTime = renderTimes.reduce((sum, time) => sum + time, 0) / renderTimes.length;
    const maxRenderTime = Math.max(...renderTimes);
    const avgObjectCount = renderSizes.reduce((sum, size) => sum + size, 0) / renderSizes.length;
    
    // Update Sentry context
    Sentry.setContext('canvas.performance', {
      timestamp: new Date().toISOString(),
      averageRenderTimeMs: avgRenderTime,
      maxRenderTimeMs: maxRenderTime,
      renderSamples: renderTimes.length,
      averageObjectCount: avgObjectCount
    });
    
    // Log metrics
    logger.info('Canvas performance metrics', {
      avgRenderTime: avgRenderTime.toFixed(2) + 'ms',
      maxRenderTime: maxRenderTime.toFixed(2) + 'ms',
      avgObjectCount: Math.round(avgObjectCount)
    });
  }, 60000); // Once per minute
  
  // Return cleanup function
  return () => {
    if (canvas) {
      canvas.off('after:render', handleRender);
    }
    clearInterval(metricsInterval);
    Sentry.setTag('monitoring.performance', null);
  };
}

/**
 * Set up comprehensive canvas monitoring
 * @param canvas The fabric canvas to monitor
 * @param gridLayerRef Reference to grid objects
 * @returns Cleanup function
 */
export function setupCanvasMonitoring(
  canvas: FabricCanvas | null,
  gridLayerRef: React.MutableRefObject<unknown[]>
): () => void {
  if (!canvas) return () => {};
  
  // Initialize global canvas info in Sentry
  Sentry.setContext('canvas.info', {
    width: canvas.width,
    height: canvas.height,
    objectCount: canvas.getObjects().length,
    timestamp: new Date().toISOString()
  });
  
  // Set up grid visibility monitoring
  const gridMonitorCleanup = monitorGridVisibility(canvas, gridLayerRef);
  
  // Set up performance monitoring
  const performanceMonitorCleanup = monitorCanvasPerformance(canvas);
  
  // Add canvas reference to window for debugging
  if (typeof window !== 'undefined') {
    (window as any).debugCanvas = canvas;
    (window as any).debugGridLayer = gridLayerRef.current;
    
    // Add debugging helper functions
    (window as any).dumpCanvasState = () => {
      const canvasObjects = canvas.getObjects();
      const gridObjects = gridLayerRef.current;
      
      return {
        canvas: {
          width: canvas.width,
          height: canvas.height,
          objectCount: canvasObjects.length,
          zoom: canvas.getZoom(),
          viewportTransform: canvas.viewportTransform
        },
        grid: {
          totalObjects: gridObjects.length,
          onCanvas: gridObjects.filter(obj => canvas.contains(obj as any)).length,
          visible: gridObjects.filter(obj => 
            canvas.contains(obj as any) && (obj as any).visible
          ).length
        },
        objects: canvasObjects.map(obj => ({
          type: obj.type,
          id: (obj as any).id,
          objectType: (obj as any).objectType,
          visible: obj.visible,
          selectable: obj.selectable,
          top: obj.top,
          left: obj.left
        }))
      };
    };
  }
  
  // Return combined cleanup function
  return () => {
    gridMonitorCleanup();
    performanceMonitorCleanup();
    
    if (typeof window !== 'undefined') {
      delete (window as any).debugCanvas;
      delete (window as any).debugGridLayer;
      delete (window as any).dumpCanvasState;
    }
  };
}
