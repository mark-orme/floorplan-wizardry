
import { useCallback, useEffect } from 'react';
import * as Sentry from '@sentry/react';
import { Canvas as FabricCanvas } from 'fabric';

interface UseSentryCanvasMonitoringProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  enabled?: boolean;
}

export const useSentryCanvasMonitoring = ({
  fabricCanvasRef,
  enabled = true
}: UseSentryCanvasMonitoringProps) => {
  // Set up canvas error monitoring
  useEffect(() => {
    if (!enabled) return;
    
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    const handleError = (error: Error) => {
      console.error('[Canvas Error]', error);
      
      // Log to Sentry without the extra property
      Sentry.captureException(error, {
        tags: {
          component: 'Canvas',
          operation: 'FabricOperation'
        }
      });
    };
    
    // Add error handler to canvas
    // Use fabric's native error events
    canvas.on('object:error', handleError as any);
    
    return () => {
      // Remove handler on cleanup
      if (canvas) {
        canvas.off('object:error', handleError as any);
      }
    };
  }, [fabricCanvasRef, enabled]);
  
  // Function to track canvas performance
  const trackCanvasPerformance = useCallback((operation: string, duration: number) => {
    if (!enabled) return;
    
    try {
      Sentry.addBreadcrumb({
        category: 'canvas.performance',
        message: `Canvas operation: ${operation}`,
        data: {
          operation,
          duration,
          timestamp: Date.now()
        },
        level: 'info'
      });
      
      // Track as custom measurement
      Sentry.setMeasurement(`canvas.${operation}`, duration, 'millisecond');
    } catch (error) {
      console.error('Error tracking canvas performance:', error);
    }
  }, [enabled]);
  
  // Function to report canvas issues
  const reportCanvasIssue = useCallback((issue: {
    type: string;
    message: string;
    details?: Record<string, any>;
  }) => {
    if (!enabled) return;
    
    try {
      Sentry.captureMessage(`Canvas Issue: ${issue.message}`, {
        level: 'warning',
        tags: {
          component: 'Canvas',
          issueType: issue.type
        },
        contexts: {
          canvas: {
            ...issue.details
          }
        }
      });
    } catch (error) {
      console.error('Error reporting canvas issue:', error);
    }
  }, [enabled]);
  
  return {
    trackCanvasPerformance,
    reportCanvasIssue
  };
};
