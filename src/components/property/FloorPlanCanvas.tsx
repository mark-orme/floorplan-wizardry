
/**
 * Floor Plan Canvas component
 * Handles canvas rendering and initialization
 */
import { useState, useEffect, useRef } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric"; 
import { CanvasControllerProvider } from "@/components/canvas/controller/CanvasController";
import { ReliableCanvasContainer } from "@/components/canvas/ReliableCanvasContainer";
import { resetInitializationState } from "@/utils/canvas/safeCanvasInitialization";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { handleError } from "@/utils/errorHandling";
import { Canvas as CanvasComponent } from "@/components/Canvas";
import { GridDebugPanel } from "@/components/canvas/grid/GridDebugPanel";
import { SimpleGrid } from "@/components/canvas/grid/SimpleGrid";
import { captureError } from "@/utils/sentryUtils";
import logger from "@/utils/logger";

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
  const [showDebug, setShowDebug] = useState(true); // Show debug panel by default
  const [canvasError, setCanvasError] = useState<string | null>(null);
  const unmountedRef = useRef(false);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const gridLayerRef = useRef<FabricObject[]>([]);
  
  // Set ready state after a short delay to ensure DOM is fully rendered
  useEffect(() => {
    // Reset canvas initialization state at the start
    resetInitializationState();
    logger.info(`Initializing FloorPlanCanvas, attempt: ${initAttempt}`);
    
    // Unmount any existing canvas before trying to render a new one
    setIsReady(false);
    
    const timer = setTimeout(() => {
      if (!unmountedRef.current) {
        setIsReady(true);
        logger.info('FloorPlanCanvas: Setting ready state to true');
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
      fabricCanvasRef.current = null;
      setCanvasError(null);
      setInitAttempt(prev => prev + 1);
      
      logger.info("Retrying canvas initialization...");
      console.log('FloorPlanCanvas: Retrying canvas initialization, attempt:', initAttempt + 1);
      
      toast.info("Retrying canvas initialization...");
      
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
    logger.info('FloorPlanCanvas: Canvas ready callback received');
    console.log('FloorPlanCanvas: Canvas ready callback received', {
      canvasWidth: canvas.width,
      canvasHeight: canvas.height,
      objectCount: canvas.getObjects().length
    });
    
    setFabricCanvas(canvas);
    fabricCanvasRef.current = canvas;
    toast.success("Canvas initialized successfully");
    
    // Log detailed canvas info to help debug grid issues
    captureError(
      new Error("Canvas initialization info"), 
      "canvas-debug-info", 
      {
        level: "info",
        tags: {
          component: "FloorPlanCanvas",
          operation: "canvas-ready"
        },
        extra: {
          canvasWidth: canvas.width,
          canvasHeight: canvas.height,
          objectCount: canvas.getObjects().length,
          initAttempt
        }
      }
    );
  };
  
  /**
   * Handle canvas initialization error
   */
  const handleCanvasInitError = (error: Error) => {
    logger.error('FloorPlanCanvas: Canvas initialization error', error);
    console.error('FloorPlanCanvas: Canvas initialization error', error);
    
    setCanvasError(error.message);
    toast.error(`Canvas error: ${error.message}`);
    
    // Report detailed error to Sentry
    captureError(error, "canvas-initialization-error", {
      level: "error",
      tags: {
        component: "FloorPlanCanvas",
        operation: "canvas-init",
        attempt: String(initAttempt)
      },
      extra: {
        initAttempt,
        browserInfo: {
          userAgent: navigator.userAgent,
          platform: navigator.platform
        }
      }
    });
    
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
  
  // Toggle debug panel visibility with double Escape key
  useEffect(() => {
    let lastEscTime = 0;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const now = Date.now();
        if (now - lastEscTime < 500) {
          // Double Escape within 500ms
          setShowDebug(prev => !prev);
          lastEscTime = 0; // Reset
        } else {
          lastEscTime = now;
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  return (
    <div 
      className="h-[800px] w-full relative" 
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
            <CanvasComponent 
              key={`canvas-${initAttempt}`} 
              onError={onCanvasError}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              onCanvasReady={handleCanvasReady}
            />
          </ReliableCanvasContainer>
          
          {/* IMPORTANT: Always show SimpleGrid component when canvas is available */}
          {fabricCanvas && (
            <SimpleGrid 
              canvas={fabricCanvas} 
              showControls={true} 
            />
          )}
        </CanvasControllerProvider>
      )}
      
      {/* Enhanced Grid Debug Panel */}
      <GridDebugPanel 
        fabricCanvasRef={fabricCanvasRef}
        gridLayerRef={gridLayerRef}
        visible={showDebug}
      />
      
      {initAttempt >= 2 && !fabricCanvas && (
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
