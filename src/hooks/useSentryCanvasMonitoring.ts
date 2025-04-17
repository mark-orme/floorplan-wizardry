import { useEffect, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import * as Sentry from '@sentry/react';
import { startPerformanceTransaction } from '@/utils/sentry/performance';
import { captureError } from '@/utils/sentry/errorCapture';
import { isSentryInitialized } from '@/utils/sentry/core';
import logger from '@/utils/logger';

interface UseSentryCanvasMonitoringProps {
  canvas: FabricCanvas | null;
  enabled?: boolean;
}

/**
 * Hook to monitor canvas performance and errors using Sentry
 */
export const useSentryCanvasMonitoring = ({
  canvas,
  enabled = true
}: UseSentryCanvasMonitoringProps) => {
  const renderTimesRef = useRef<number[]>([]);
  const lastRenderTimeRef = useRef<number>(performance.now());
  const monitoringIntervalRef = useRef<number | null>(null);
  
  useEffect(() => {
    if (!enabled || !canvas || !isSentryInitialized()) return;
    
    // Set up canvas context in Sentry
    const updateSentryCanvasContext = () => {
      if (!canvas) return;
      
      try {
        Sentry.setContext('canvas', {
          dimensions: {
            width: canvas.width,
            height: canvas.height,
            zoom: canvas.getZoom(),
          },
          objects: {
            total: canvas.getObjects().length,
            visible: canvas.getObjects().filter(obj => obj.visible).length,
          },
          selection: canvas.getActiveObjects().length > 0,
        });
      } catch (error) {
        logger.error('Error updating Sentry canvas context:', error);
      }
    };
    
    // Track render times
    const handleAfterRender = () => {
      const now = performance.now();
      const renderTime = now - lastRenderTimeRef.current;
      lastRenderTimeRef.current = now;
      
      // Only track non-initial renders (below 1000ms)
      if (renderTime < 1000) {
        renderTimesRef.current.push(renderTime);
        
        // Keep only the last 20 render times
        if (renderTimesRef.current.length > 20) {
          renderTimesRef.current.shift();
        }
        
        // Report slow renders
        if (renderTime > 100) {
          const transaction = startPerformanceTransaction('canvas.slow-render', {
            renderTime,
            objectCount: canvas.getObjects().length,
          });
          
          transaction.finish('warning');
          
          logger.warn('Slow canvas render detected', {
            renderTime: `${renderTime.toFixed(2)}ms`,
            objectCount: canvas.getObjects().length,
          });
        }
      }
    };
    
    // Track canvas errors
    const handleCanvasError = (event: ErrorEvent) => {
      captureError(
        event.error || new Error(event.message),
        'canvas-runtime-error',
        {
          extra: {
            canvasWidth: canvas.width,
            canvasHeight: canvas.height,
            objectCount: canvas.getObjects().length,
            selection: canvas.getActiveObjects().length > 0,
          },
        }
      );
    };
    
    // Set up event listeners
    canvas.on('after:render', handleAfterRender);
    window.addEventListener('error', handleCanvasError);
    
    // Set up periodic performance reporting
    monitoringIntervalRef.current = window.setInterval(() => {
      if (renderTimesRef.current.length === 0) return;
      
      // Calculate average render time
      const avgRenderTime = renderTimesRef.current.reduce((sum, time) => sum + time, 0) / renderTimesRef.current.length;
      const maxRenderTime = Math.max(...renderTimesRef.current);
      
      // Update Sentry context
      Sentry.setContext('canvas.performance', {
        averageRenderTimeMs: avgRenderTime.toFixed(2),
        maxRenderTimeMs: maxRenderTime.toFixed(2),
        renderSamples: renderTimesRef.current.length,
        timestamp: new Date().toISOString(),
      });
      
      // Log metrics
      logger.debug('Canvas performance metrics', {
        avgRenderTime: `${avgRenderTime.toFixed(2)}ms`,
        maxRenderTime: `${maxRenderTime.toFixed(2)}ms`,
        samples: renderTimesRef.current.length,
      });
      
    }, 60000); // Report every minute
    
    // Immediately update context
    updateSentryCanvasContext();
    
    // Clean up event listeners and interval
    return () => {
      canvas.off('after:render', handleAfterRender);
      window.removeEventListener('error', handleCanvasError);
      
      if (monitoringIntervalRef.current !== null) {
        clearInterval(monitoringIntervalRef.current);
        monitoringIntervalRef.current = null;
      }
    };
  }, [canvas, enabled]);
  
  return {
    // Method to manually capture canvas state
    captureCanvasState: () => {
      if (!canvas || !isSentryInitialized()) return;
      
      const transaction = startPerformanceTransaction('canvas.state-capture', {});
      
      try {
        // Update Sentry context with current canvas state
        Sentry.setContext('canvas.state', {
          dimensions: {
            width: canvas.width,
            height: canvas.height,
            zoom: canvas.getZoom(),
          },
          objects: {
            total: canvas.getObjects().length,
            visible: canvas.getObjects().filter(obj => obj.visible).length,
            types: canvas.getObjects().reduce((acc, obj) => {
              const type = obj.type || 'unknown';
              acc[type] = (acc[type] || 0) + 1;
              return acc;
            }, {} as Record<string, number>),
          },
          timestamp: new Date().toISOString(),
        });
        
        transaction.finish('ok');
      } catch (error) {
        transaction.finish('error');
        captureError(error as Error, 'canvas-state-capture-error');
      }
    },
  };
};
