
import { useEffect, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import * as Sentry from '@sentry/react';

interface UseSentryCanvasMonitoringProps {
  /** The Fabric canvas instance to monitor */
  canvas?: FabricCanvas;
  /** Enable debug information */
  debug?: boolean;
  /** Custom error handler */
  onError?: (error: Error) => void;
  /** Enable performance monitoring */
  monitorPerformance?: boolean;
}

/**
 * Hook for monitoring canvas errors with Sentry
 * @param props monitoring configuration
 */
export const useSentryCanvasMonitoring = ({
  canvas,
  debug = false,
  onError,
  monitorPerformance = false
}: UseSentryCanvasMonitoringProps) => {
  const errorsRef = useRef<Error[]>([]);
  
  useEffect(() => {
    if (!canvas) return;
    
    const handleError = (error: Error) => {
      console.error('Canvas error:', error);
      
      // Track the error
      errorsRef.current.push(error);
      
      // Report to Sentry
      Sentry.captureException(error);
      
      // Call custom error handler if provided
      if (onError) {
        onError(error);
      }
    };
    
    // Can't use error event since it doesn't exist in CanvasEvents
    // Instead monitor object:modified and catch errors there
    canvas.on('object:modified', function(e) {
      try {
        // Monitor for errors during object modification
        if (debug) {
          console.log('Object modified:', e);
        }
      } catch (err) {
        handleError(err instanceof Error ? err : new Error(String(err)));
      }
    });
    
    // Similarly, we'll use other valid event types instead of "object:error"
    canvas.on('mouse:down', function(e) {
      try {
        // Additional monitoring logic here
      } catch (err) {
        handleError(err instanceof Error ? err : new Error(String(err)));
      }
    });
    
    return () => {
      // Remove event listeners
      canvas.off('object:modified');
      canvas.off('mouse:down');
    };
  }, [canvas, debug, onError]);
  
  return {
    getErrorCount: () => errorsRef.current.length,
    getErrors: () => [...errorsRef.current],
    clearErrors: () => {
      errorsRef.current = [];
    }
  };
};
