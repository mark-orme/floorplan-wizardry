
/**
 * Canvas initialization hook
 * Handles additional canvas initialization logic and error monitoring
 * @module useCanvasInit
 */
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { captureMessage, captureError } from '@/utils/sentryUtils';
import { markInitialized } from '@/utils/healthMonitoring';
import { 
  generateCanvasDiagnosticReport, 
  checkFabricJsLoading,
  safeCanvasInitialization
} from '@/utils/canvas/canvasErrorMonitoring';

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
  const [initChecked, setInitChecked] = useState<boolean>(false);
  const [canvasElementReady, setCanvasElementReady] = useState<boolean>(false);
  
  // Check if DOM is ready for canvas operations
  useEffect(() => {
    const checkDocumentReady = () => {
      if (document.readyState === 'complete') {
        setCanvasElementReady(true);
        return true;
      }
      return false;
    };

    // Try immediately
    if (!checkDocumentReady()) {
      // Set up event listener if document not ready
      const handleReadyStateChange = () => {
        if (checkDocumentReady()) {
          document.removeEventListener('readystatechange', handleReadyStateChange);
        }
      };
      
      document.addEventListener('readystatechange', handleReadyStateChange);
      return () => {
        document.removeEventListener('readystatechange', handleReadyStateChange);
      };
    }
  }, []);
  
  // Check Fabric.js loading during initialization
  useEffect(() => {
    // This runs once on mount to check Fabric.js loading status
    if (initChecked || !canvasElementReady) return;
    
    // Verify DOM is fully loaded before checking Fabric
    if (document.readyState !== 'complete') {
      const timer = setTimeout(() => {
        setInitChecked(false); // Force re-run when document is ready
      }, 500);
      return () => clearTimeout(timer);
    }
    
    const fabricStatus = checkFabricJsLoading();
    
    captureMessage(
      fabricStatus.fabricDetected 
        ? `Fabric.js detected: ${fabricStatus.fabricVersion}` 
        : 'Fabric.js not detected during initialization',
      'fabric-load-check', 
      {
        level: fabricStatus.fabricDetected ? 'info' : 'error',
        tags: {
          component: 'useCanvasInit',
          fabricLoaded: String(fabricStatus.fabricDetected),
          fabricVersion: fabricStatus.fabricVersion || 'unknown'
        },
        extra: fabricStatus
      }
    );
    
    // If Fabric.js is not loaded correctly, log an error
    if (!fabricStatus.fabricDetected || fabricStatus.fabricProblem) {
      console.error("⚠️ Fabric.js loading issue:", fabricStatus.fabricProblem);
      
      captureError(
        new Error(`Fabric.js loading issue: ${fabricStatus.fabricProblem}`),
        'fabric-load-error',
        {
          level: 'error',
          tags: {
            component: 'useCanvasInit',
            operation: 'initialization'
          },
          extra: {
            fabricStatus,
            documentState: document.readyState,
            scripts: Array.from(document.querySelectorAll('script')).map(s => s.src || 'inline')
          }
        }
      );
    }
    
    setInitChecked(true);
  }, [initChecked, canvasElementReady]);
  
  // Track canvas initialization status
  useEffect(() => {
    if (!canvasElementReady || !initChecked) return;
    
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
            diagnostics: generateCanvasDiagnosticReport(),
            documentReady: document.readyState,
            canvasElements: {
              count: document.querySelectorAll('canvas').length,
              ids: Array.from(document.querySelectorAll('canvas')).map(c => c.id || 'no-id')
            },
            fabricStatus: checkFabricJsLoading()
          }
        });
      }
    }, 5000);
    
    return () => {
      window.removeEventListener('canvas-init-success', handleCanvasInitSuccess as EventListener);
      clearTimeout(initTimeout);
    };
  }, [canvasId, canvasElementReady, initChecked]);
  
  // Listen for canvas initialization errors
  useEffect(() => {
    if (!canvasElementReady) return;
    
    const handleCanvasInitError = (event: CustomEvent) => {
      errorCountRef.current += 1;
      const { error, isFatal, specific } = event.detail || {};
      
      console.error("Canvas initialization error:", error);
      
      // Capture specific internal details about the error
      const extractErrorDetails = (error: any): Record<string, any> => {
        if (!error) return { noError: true };
        
        return {
          message: error.message || 'No message',
          stack: error.stack || 'No stack',
          name: error.name || 'No name',
          code: error.code,
          lowerElementMissing: error.message?.includes('elements.lower.el') || false,
          // Add any fabric-specific error properties
          fabricSpecific: error.fabricSpecificError || false
        };
      };
      
      // Detect common problems in the DOM that might cause canvas initialization issues
      const detectDomProblems = (): Record<string, any> => {
        const problems: Record<string, any> = {
          missingCanvasElement: document.querySelectorAll('canvas').length === 0,
          multipleFabricInstances: false,
          cssProblems: false,
          visibilityIssues: false
        };
        
        // Check for CSS visibility issues
        const canvases = document.querySelectorAll('canvas');
        if (canvases.length > 0) {
          const hiddenCanvas = Array.from(canvases).some(canvas => {
            const style = window.getComputedStyle(canvas);
            return style.display === 'none' || 
                  style.visibility === 'hidden' || 
                  style.opacity === '0' ||
                  canvas.width === 0 || 
                  canvas.height === 0;
          });
          problems.visibilityIssues = hiddenCanvas;
        }
        
        // Check for multiple fabric instances
        if (typeof window !== 'undefined') {
          const fabricInstances = Object.keys(window).filter(key => 
            key.startsWith('fabric') || 
            (window as any)[key]?.Canvas || 
            (window as any)[key]?.Object
          );
          problems.multipleFabricInstances = fabricInstances.length > 1;
          if (problems.multipleFabricInstances) {
            problems.fabricInstanceKeys = fabricInstances;
          }
        }
        
        return problems;
      };
      
      // Report error context to Sentry with enhanced diagnostics
      captureError(error || new Error('Unknown canvas init error'), 'canvas-init-error-event', {
        level: isFatal ? 'fatal' : 'error',
        tags: {
          component: 'useCanvasInit',
          operation: 'initialization',
          errorCount: String(errorCountRef.current),
          canvasId,
          lowerElementError: error?.message?.includes('elements.lower.el') ? 'true' : 'false',
          specificError: specific || 'unknown'
        },
        extra: {
          isFatal,
          errorDetails: extractErrorDetails(error),
          fabricStatus: checkFabricJsLoading(),
          domProblems: detectDomProblems(),
          diagnostics: generateCanvasDiagnosticReport(),
          elementsInspection: {
            canvasCount: document.querySelectorAll('canvas').length,
            canvasParents: Array.from(document.querySelectorAll('canvas')).map(c => 
              c.parentElement ? c.parentElement.tagName + (c.parentElement.id ? `#${c.parentElement.id}` : '') : 'no-parent'
            ),
            lowerCanvasPresent: document.querySelectorAll('.lower-canvas').length > 0
          }
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
  }, [onError, canvasId, canvasElementReady]);
  
  return;
};
