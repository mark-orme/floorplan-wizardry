
/**
 * Floor Plan Canvas component
 * Handles canvas rendering and initialization
 */
import { useState, useEffect } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric"; 
import { CanvasControllerProvider } from "@/components/canvas/controller/CanvasController";
import { ReliableCanvasContainer } from "@/components/canvas/ReliableCanvasContainer";
import { resetInitializationState } from "@/utils/canvas/safeCanvasInitialization";
import { Canvas as CanvasComponent } from "@/components/Canvas";
import { GridDebugPanel } from "@/components/canvas/grid/GridDebugPanel";
import { SimpleGrid as SimpleGridComponent } from "@/components/canvas/grid/SimpleGrid"; // Import the React component version
import { resetGridProgress } from "@/utils/gridManager";
import { useCanvasInitialization } from "./canvas/useCanvasInitialization";
import { useDebugPanel } from "./canvas/useDebugPanel";
import { CanvasRetryButton } from "./canvas/CanvasRetryButton";

// Constants for component
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const INIT_DELAY = 500; // ms

/**
 * Props for the FloorPlanCanvas component
 */
interface FloorPlanCanvasProps {
  /** Callback for canvas error */
  onCanvasError?: () => void;
}

/**
 * Floor Plan Canvas component
 * Handles canvas rendering and initialization
 * 
 * @param {FloorPlanCanvasProps} props - Component properties
 * @returns {JSX.Element} Rendered component
 */
export const FloorPlanCanvas = ({ onCanvasError }: FloorPlanCanvasProps) => {
  // Use the canvas initialization hook
  const {
    isReady,
    setIsReady,
    initAttempt,
    fabricCanvas,
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
          
          {/* Use the SimpleGridComponent (React component) instead of SimpleGrid class */}
          {fabricCanvas && (
            <SimpleGridComponent 
              canvas={fabricCanvas} 
              showControls={true}
              onGridCreated={handleGridCreated}
              defaultVisible={true}
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
