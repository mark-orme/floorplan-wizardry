
/**
 * Floor Plan Canvas component
 * Handles canvas rendering and initialization
 */
import { useState, useEffect, useRef } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { CanvasControllerProvider } from "@/components/canvas/controller/CanvasController";
import { ReliableCanvasContainer } from "@/components/canvas/ReliableCanvasContainer";
import { resetInitializationState } from "@/utils/canvas/safeCanvasInitialization";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { handleError } from "@/utils/errorHandling";

// Constants for component
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const INIT_DELAY = 500; // ms

interface FloorPlanCanvasProps {
  /** Callback for canvas error */
  onCanvasError?: () => void;
}

export const FloorPlanCanvas = ({ onCanvasError }: FloorPlanCanvasProps) => {
  const [isReady, setIsReady] = useState(false);
  const [initAttempt, setInitAttempt] = useState(0);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
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
        console.log('FloorPlanCanvas: Setting ready state to true');
      }
    }, INIT_DELAY);
    
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
      
      // Reset state to trigger re-rendering
      setIsReady(false);
      setFabricCanvas(null);
      setInitAttempt(prev => prev + 1);
      
      toast.info("Retrying canvas initialization...");
      console.log('FloorPlanCanvas: Retrying canvas initialization');
      
      // Try to re-initialize after a delay
      setTimeout(() => {
        if (!unmountedRef.current) {
          setIsReady(true);
        }
      }, INIT_DELAY * 1.5);
    } catch (error) {
      handleError(error, {
        component: 'FloorPlanCanvas',
        operation: 'canvas-retry'
      });
    }
  };
  
  /**
   * Handle successful canvas initialization
   */
  const handleCanvasReady = (canvas: FabricCanvas) => {
    console.log('FloorPlanCanvas: Canvas ready callback received');
    setFabricCanvas(canvas);
    toast.success("Canvas initialized successfully");
  };
  
  /**
   * Handle canvas initialization error
   */
  const handleCanvasInitError = (error: Error) => {
    console.error('FloorPlanCanvas: Canvas initialization error', error);
    toast.error(`Canvas error: ${error.message}`);
    
    if (onCanvasError) {
      onCanvasError();
    }
  };
  
  // Clean up resources when component unmounts
  useEffect(() => {
    return () => {
      unmountedRef.current = true;
      resetInitializationState();
      
      // Clean up the canvas if it exists
      if (fabricCanvas) {
        try {
          fabricCanvas.dispose();
        } catch (err) {
          console.error('Error disposing canvas:', err);
        }
      }
    };
  }, [fabricCanvas]);
  
  return (
    <div 
      className="h-[800px] w-full" 
      data-testid="floor-plan-wrapper"
      data-canvas-ready={isReady ? "true" : "false"}
      data-init-attempt={initAttempt}
    > 
      {isReady && (
        <CanvasControllerProvider key={`canvas-controller-${initAttempt}`}>
          <ReliableCanvasContainer
            key={`canvas-container-${initAttempt}`}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            onCanvasReady={handleCanvasReady}
            onCanvasError={handleCanvasInitError}
          >
            <Canvas key={`canvas-${initAttempt}`} onError={onCanvasError} />
          </ReliableCanvasContainer>
        </CanvasControllerProvider>
      )}
      
      {initAttempt >= 2 && !fabricCanvas && (
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
