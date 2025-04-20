import React, { useRef, useEffect } from "react";
import { Canvas as FabricCanvas } from "fabric"; 
import { useWebGLCanvas } from "@/hooks/useWebGLCanvas";
import { CanvasControllerProvider } from "@/components/canvas/controller/CanvasController";
import { ReliableCanvasContainer } from "@/components/canvas/ReliableCanvasContainer";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

export const FloorPlanCanvas = ({ onCanvasError }: { onCanvasError?: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = React.useState<FabricCanvas | null>(null);

  // Initialize WebGL canvas
  const { webglRenderer } = useWebGLCanvas({
    canvasRef,
    fabricCanvas
  });

  // Use the canvas initialization hook
  const {
    isReady,
    setIsReady,
    initAttempt,
    fabricCanvas: canvas,
    canvasError,
    unmountedRef,
    fabricCanvasRef,
    gridLayerRef,
    handleCanvasReady,
    handleCanvasInitError,
    handleCanvasRetry
  } = useCanvasInitialization(onCanvasError);
  
  // Use the debug panel hook
  const { showDebug } = useDebugPanel();
  
  // Handle grid creation completion
  const handleGridCreated = (gridObjects: FabricObject[]) => {
    console.log(`Grid created with ${gridObjects.length} objects`);
    gridLayerRef.current = gridObjects;
    
    // Track grid creation performance
    const transaction = startCanvasTransaction('grid.created', fabricCanvas, {
      gridObjects: gridObjects.length
    });
    transaction.finish('ok');
  };
  
  // Set ready state after a short delay to ensure DOM is fully rendered
  useEffect(() => {
    // Reset canvas initialization state at the start
    resetInitializationState();
    resetGridProgress(); // Also reset grid progress
    
    console.log(`FloorPlanCanvas: Initializing, attempt: ${initAttempt}`);
    
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
  }, [initAttempt, unmountedRef, setIsReady]);
  
  // Clean up resources when component unmounts
  useEffect(() => {
    return () => {
      unmountedRef.current = true;
      resetInitializationState();
      resetGridProgress();
      
      // Clean up the canvas if it exists
      if (fabricCanvas) {
        try {
          fabricCanvas.dispose();
        } catch (err) {
          console.error('Error disposing canvas:', err);
        }
      }
    };
  }, [fabricCanvas, unmountedRef]);
  
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
          
          {/* Use the SimpleGrid React component properly */}
          {fabricCanvas && (
            <SimpleGrid 
              canvas={fabricCanvas} 
              showControls={true}
              defaultVisible={true}
              onGridCreated={handleGridCreated}
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
        <CanvasRetryButton 
          errorMessage={canvasError} 
          onRetry={handleCanvasRetry} 
        />
      )}
    </div>
  );
};
