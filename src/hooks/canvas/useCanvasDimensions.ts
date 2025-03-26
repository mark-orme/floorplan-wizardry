
/**
 * Hook for managing canvas dimensions
 * Handles setting up and tracking canvas sizing
 * @module canvas/useCanvasDimensions
 */
import { useEffect, useRef, useState } from "react";
import logger from "@/utils/logger";
import { captureError } from "@/utils/sentryUtils";
import { handleError } from "@/utils/errorHandling";
import { measurePerformance } from "@/utils/performance";
import { 
  DEFAULT_CANVAS_HEIGHT,
  DEFAULT_CANVAS_WIDTH
} from "@/constants/numerics";

interface UseCanvasDimensionsProps {
  canvasReference: React.RefObject<HTMLCanvasElement>;
  containerRef: React.RefObject<HTMLDivElement>;
}

interface DimensionSetupHistory {
  attempt: number;
  timestamp: string;
  containerSize: { width: number; height: number } | null;
  canvasSize: { width: number; height: number } | null;
}

/**
 * Hook for managing canvas dimensions setup
 * @param {UseCanvasDimensionsProps} props - Hook properties
 * @returns Dimension setup state and functions
 */
export const useCanvasDimensions = ({ 
  canvasReference, 
  containerRef 
}: UseCanvasDimensionsProps) => {
  const [canvasReady, setCanvasReady] = useState(false);
  const [dimensionsSetupAttempt, setDimensionsSetupAttempt] = useState(0);
  const setupTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const dimensionSetupHistoryRef = useRef<Array<DimensionSetupHistory>>([]);

  // Force initialization after render to ensure canvas has dimensions
  useEffect(() => {
    const setupCanvasDimensions = () => {
      if (canvasReference.current && containerRef.current) {
        try {
          // Measure performance of the container size calculation
          const [containerRect] = measurePerformance(
            'Get container dimensions', 
            () => containerRef.current!.getBoundingClientRect(),
            { attempt: dimensionsSetupAttempt }
          );
          
          // Track this attempt for debugging
          dimensionSetupHistoryRef.current.push({
            attempt: dimensionsSetupAttempt,
            timestamp: new Date().toISOString(),
            containerSize: containerRect ? { 
              width: containerRect.width, 
              height: containerRect.height 
            } : null,
            canvasSize: canvasReference.current ? {
              width: canvasReference.current.width,
              height: canvasReference.current.height
            } : null
          });
          
          // Keep history within reasonable size
          if (dimensionSetupHistoryRef.current.length > 10) {
            dimensionSetupHistoryRef.current.shift();
          }
          
          // Only proceed if we have valid dimensions
          if (containerRect.width > 0 && containerRect.height > 0) {
            logger.info(`Setting canvas dimensions to ${containerRect.width}x${Math.max(containerRect.height, DEFAULT_CANVAS_HEIGHT)}`);
            
            // Measure performance of the dimension setting
            const [, dimensionSetMeasurement] = measurePerformance(
              'Set canvas dimensions', 
              () => {
                // Set canvas dimensions explicitly based on container
                canvasReference.current!.width = containerRect.width;
                canvasReference.current!.height = Math.max(containerRect.height, DEFAULT_CANVAS_HEIGHT);
                
                // Also set style dimensions to match
                canvasReference.current!.style.width = `${containerRect.width}px`;
                canvasReference.current!.style.height = `${Math.max(containerRect.height, DEFAULT_CANVAS_HEIGHT)}px`;
                
                // Force a reflow to ensure dimensions are applied
                return canvasReference.current!.getBoundingClientRect();
              }
            );
            
            // Signal that canvas is ready after dimensions are set
            setCanvasReady(true);
            
            // Log success for debugging
            console.log("✅ Canvas dimensions set successfully:", {
              width: canvasReference.current.width,
              height: canvasReference.current.height,
              containerWidth: containerRect.width,
              containerHeight: containerRect.height,
              setTime: dimensionSetMeasurement.duration.toFixed(2) + 'ms'
            });
          } else {
            // Use fallback dimensions if container dimensions aren't available
            logger.warn("Container dimensions are zero, using fallback dimensions", {
              containerRect: containerRect ? {
                width: containerRect.width,
                height: containerRect.height
              } : 'No container rect',
              fallbackWidth: DEFAULT_CANVAS_WIDTH,
              fallbackHeight: DEFAULT_CANVAS_HEIGHT,
              attempt: dimensionsSetupAttempt
            });
            
            canvasReference.current.width = DEFAULT_CANVAS_WIDTH;
            canvasReference.current.height = DEFAULT_CANVAS_HEIGHT;
            canvasReference.current.style.width = `${DEFAULT_CANVAS_WIDTH}px`;
            canvasReference.current.style.height = `${DEFAULT_CANVAS_HEIGHT}px`;
            
            // Signal that canvas is ready even with fallback dimensions
            setCanvasReady(true);
            
            // Report to Sentry on persistent dimension issues
            if (dimensionsSetupAttempt >= 3) {
              captureError(
                new Error(`Canvas container dimensions issue after ${dimensionsSetupAttempt} attempts`),
                'canvas-container-dimensions',
                {
                  level: 'warning',
                  extra: {
                    setupHistory: dimensionSetupHistoryRef.current,
                    timeElapsed: Date.now() - startTimeRef.current
                  }
                }
              );
            }
            
            // Try again later if container dimensions are zero and we haven't tried too many times
            if (dimensionsSetupAttempt < 5) {
              setupTimeoutRef.current = setTimeout(() => {
                setDimensionsSetupAttempt(prev => prev + 1);
              }, 300);
            }
          }
        } catch (error) {
          handleError(error, {
            component: 'useCanvasDimensions',
            operation: 'setup-canvas-dimensions',
            data: {
              attempt: dimensionsSetupAttempt,
              setupHistory: dimensionSetupHistoryRef.current
            }
          });
          
          // Set fallback dimensions on error
          if (canvasReference.current) {
            canvasReference.current.width = DEFAULT_CANVAS_WIDTH;
            canvasReference.current.height = DEFAULT_CANVAS_HEIGHT;
            setCanvasReady(true);
          }
        }
      }
    };
    
    // Run the setup function
    setupCanvasDimensions();
    
    // Clean up timeout
    return () => {
      if (setupTimeoutRef.current) {
        clearTimeout(setupTimeoutRef.current);
      }
    };
  }, [canvasReference, containerRef, dimensionsSetupAttempt]);

  return {
    canvasReady,
    dimensionsSetupAttempt,
    startTimeRef,
    setDimensionsSetupAttempt
  };
};
