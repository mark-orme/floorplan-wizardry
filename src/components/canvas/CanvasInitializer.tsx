
/**
 * Canvas Initializer Component
 * Handles the initialization and setup of the canvas
 */
import { useState, useEffect, useRef } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { captureError } from "@/utils/sentryUtils";
import logger from "@/utils/logger";
import { resetGridProgress } from "@/utils/gridManager";
import { resetInitializationState } from "@/utils/canvas/safeCanvasInitialization";

interface CanvasInitializerProps {
  /** Canvas width */
  width: number;
  /** Canvas height */
  height: number;
  /** Callback for when canvas is ready */
  onCanvasReady: (canvas: FabricCanvas) => void;
  /** Callback for canvas error */
  onCanvasError?: (error: Error) => void;
  /** Child component to render inside the initializer */
  children: React.ReactNode;
}

export const CanvasInitializer: React.FC<CanvasInitializerProps> = ({
  width,
  height,
  onCanvasReady,
  onCanvasError,
  children
}) => {
  const [isReady, setIsReady] = useState(false);
  const [initAttempt, setInitAttempt] = useState(0);
  const [canvasError, setCanvasError] = useState<string | null>(null);
  const unmountedRef = useRef(false);
  
  // Set ready state after a short delay to ensure DOM is fully rendered
  useEffect(() => {
    // Reset canvas initialization state at the start
    resetInitializationState();
    resetGridProgress(); // Also reset grid progress
    
    logger.info(`Initializing Canvas, attempt: ${initAttempt}`);
    console.log(`Canvas: Initializing, attempt: ${initAttempt}`);
    
    // Unmount any existing canvas before trying to render a new one
    setIsReady(false);
    
    const timer = setTimeout(() => {
      if (!unmountedRef.current) {
        setIsReady(true);
        logger.info('Canvas: Setting ready state to true');
      }
    }, 500);
    
    return () => {
      clearTimeout(timer);
      unmountedRef.current = true;
    };
  }, [initAttempt]);
  
  /**
   * Handle canvas initialization retry
   * Resets and attempts to reinitialize the canvas
   */
  const handleCanvasRetry = () => {
    try {
      // Reset canvas initialization state
      resetInitializationState();
      resetGridProgress();
      
      // Reset state to trigger re-rendering
      setIsReady(false);
      setCanvasError(null);
      setInitAttempt(prev => prev + 1);
      
      logger.info("Retrying canvas initialization...");
      toast.info("Retrying canvas initialization...");
      
      // Try to re-initialize after a delay
      setTimeout(() => {
        if (!unmountedRef.current) {
          setIsReady(true);
        }
      }, 750);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error');
      if (onCanvasError) {
        onCanvasError(err);
      }
    }
  };
  
  /**
   * Handle canvas initialization error
   */
  const handleError = (error: Error) => {
    logger.error('Canvas initialization error', error);
    console.error('Canvas initialization error', error);
    
    setCanvasError(error.message);
    toast.error(`Canvas error: ${error.message}`);
    
    // Report detailed error to Sentry
    captureError(error, "canvas-initialization-error", {
      level: "error",
      tags: {
        component: "CanvasInitializer",
        operation: "canvas-init",
        attempt: String(initAttempt)
      },
      extra: {
        initAttempt,
        width,
        height
      }
    });
    
    if (onCanvasError) {
      onCanvasError(error);
    }
  };
  
  // Clean up resources when component unmounts
  useEffect(() => {
    return () => {
      unmountedRef.current = true;
      resetInitializationState();
      resetGridProgress();
    };
  }, []);
  
  return (
    <div 
      className="h-full w-full relative" 
      data-canvas-ready={isReady ? "true" : "false"}
      data-init-attempt={initAttempt}
    > 
      {isReady && children}
      
      {initAttempt >= 2 && canvasError && (
        <div className="flex flex-col items-center justify-center h-full bg-gray-50 border border-gray-200 rounded-md p-4">
          <p className="text-red-500 mb-2">Canvas initialization failed.</p>
          {canvasError && (
            <p className="text-sm text-gray-700 mb-4">Error: {canvasError}</p>
          )}
          <Button onClick={handleCanvasRetry} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
};
