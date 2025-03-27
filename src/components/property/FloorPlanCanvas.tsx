
/**
 * Floor Plan Canvas component
 * Handles canvas rendering and initialization
 */
import { useState, useEffect, useRef } from "react";
import { Canvas } from "@/components/Canvas";
import { CanvasControllerProvider } from "@/components/canvas/controller/CanvasController";
import { resetInitializationState } from "@/utils/canvas/safeCanvasInitialization";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { handleError } from "@/utils/errorHandling";

interface FloorPlanCanvasProps {
  /** Callback for canvas error */
  onCanvasError: () => void;
}

export const FloorPlanCanvas = ({ onCanvasError }: FloorPlanCanvasProps) => {
  const [isReady, setIsReady] = useState(false);
  const [initAttempt, setInitAttempt] = useState(0);
  const unmountedRef = useRef(false);
  
  // Set ready state after a short delay to ensure DOM is fully rendered
  useEffect(() => {
    // Reset canvas initialization state at the start
    resetInitializationState();
    
    // Unmount any existing canvas before trying to render a new one
    setIsReady(false);
    
    const timer = setTimeout(() => {
      if (!unmountedRef.current) {
        setIsReady(true);
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
      
      setIsReady(false);
      setInitAttempt(prev => prev + 1);
      
      // Try to re-initialize after a delay
      setTimeout(() => {
        if (!unmountedRef.current) {
          setIsReady(true);
        }
      }, 800);
    } catch (error) {
      handleError(error, {
        component: 'FloorPlanCanvas',
        operation: 'canvas-retry'
      });
    }
  };
  
  // Clean up resources when component unmounts
  useEffect(() => {
    return () => {
      unmountedRef.current = true;
      resetInitializationState();
    };
  }, []);
  
  return (
    <div 
      className="h-[800px] w-full" 
      data-testid="floor-plan-wrapper"
      data-canvas-ready={isReady ? "true" : "false"}
      data-init-attempt={initAttempt}
    > 
      {isReady && (
        <CanvasControllerProvider key={`canvas-controller-${initAttempt}`}>
          <Canvas key={`canvas-${initAttempt}`} onError={onCanvasError} />
        </CanvasControllerProvider>
      )}
      
      {initAttempt >= 2 && (
        <div className="flex flex-col items-center justify-center h-full bg-gray-50 border border-gray-200 rounded-md p-4">
          <p className="text-red-500 mb-4">Canvas initialization failed.</p>
          <Button onClick={handleCanvasRetry} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
};
