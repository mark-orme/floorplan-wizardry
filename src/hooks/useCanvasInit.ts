
/**
 * Canvas initialization hook
 * Handles additional canvas initialization logic and error monitoring
 * @module useCanvasInit
 */
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { captureMessage, captureError } from '@/utils/sentryUtils';
import { markInitialized } from '@/utils/healthMonitoring';
import { generateCanvasDiagnosticReport } from '@/utils/canvas/canvasErrorMonitoring';

interface UseCanvasInitProps {
  onError?: () => void;
  canvasId?: string;
}

/**
 * Hook for canvas initialization with enhanced error monitoring
 * 
 * @param {UseCanvasInitProps} props - Hook properties
 * @returns {void}
 */
export const useCanvasInit = ({ onError, canvasId = 'unknown' }: UseCanvasInitProps): void => {
  const errorCountRef = useRef<number>(0);
  const canvasInitializedRef = useRef<boolean>(false);
  
  // Track canvas initialization status
  useEffect(() => {
    // Mark canvas as not yet initialized
    markInitialized('canvas', false);
    
    // Create a function to mark successful initialization
    const markCanvasInitialized = () => {
      canvasInitializedRef.current = true;
      markInitialized('canvas', true);
      
      captureMessage('Canvas initialization confirmed by hook', 'canvas-init-confirmed', {
        level: 'info',
        tags: {
          component: 'useCanvasInit',
          canvasId
        }
      });
    };
    
    // Handle initialization success (via custom event that could be dispatched from Canvas)
    const handleCanvasInitSuccess = () => {
      markCanvasInitialized();
    };
    
    // Listen for initialization events (could be added to Canvas component)
    window.addEventListener('canvas-init-success', handleCanvasInitSuccess as EventListener);
    
    // After a reasonable delay, check if canvas has initialized
    const initTimeout = setTimeout(() => {
      if (!canvasInitializedRef.current) {
        captureMessage('Canvas did not report initialization within expected timeframe', 'canvas-init-timeout', {
          level: 'warning',
          tags: {
            component: 'useCanvasInit',
            canvasId
          },
          extra: {
            diagnostics: generateCanvasDiagnosticReport()
          }
        });
      }
    }, 5000);
    
    return () => {
      window.removeEventListener('canvas-init-success', handleCanvasInitSuccess as EventListener);
      clearTimeout(initTimeout);
    };
  }, [canvasId]);
  
  // Listen for canvas initialization errors
  useEffect(() => {
    const handleCanvasInitError = (event: CustomEvent) => {
      errorCountRef.current += 1;
      const { error, isFatal } = event.detail || {};
      
      console.error("Canvas initialization error:", error);
      
      // Report error context to Sentry
      captureError(error || new Error('Unknown canvas init error'), 'canvas-init-error-event', {
        level: isFatal ? 'fatal' : 'error',
        tags: {
          component: 'useCanvasInit',
          operation: 'initialization',
          errorCount: String(errorCountRef.current),
          canvasId
        },
        extra: {
          isFatal,
          errorDetails: error ? { 
            message: error.message,
            stack: error.stack
          } : 'No error details available',
          diagnostics: generateCanvasDiagnosticReport()
        }
      });
      
      // Call onError callback
      if (onError) {
        onError();
      }
      
      // Show user notification for fatal errors
      if (isFatal) {
        toast.error('Unable to initialize canvas. Please refresh the page.', {
          duration: 10000, // Show longer for fatal errors
          action: {
            label: 'Refresh',
            onClick: () => window.location.reload()
          }
        });
      }
    };
    
    // Add event listener
    window.addEventListener('canvas-init-error', handleCanvasInitError as EventListener);
    
    console.log("Canvas initialization error monitoring attached");
    
    // Cleanup function
    return () => {
      window.removeEventListener('canvas-init-error', handleCanvasInitError as EventListener);
    };
  }, [onError, canvasId]);
  
  return;
};
