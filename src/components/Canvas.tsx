
/**
 * Canvas Component
 * Main drawing canvas for floor plan editor
 */
import React, { useEffect, useRef, useState, useCallback } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { CanvasContainer } from "./CanvasContainer";
import { useCanvasInitialization } from "@/hooks/canvas-initialization";
import { useCanvasDrawing } from "@/hooks/useCanvasDrawing";
import { useCanvasController } from "@/components/canvas/controller/CanvasController";
import { DistanceTooltip } from "./DistanceTooltip";
import { DebugInfoState } from "@/types/debugTypes";
import { EmergencyCanvasProvider } from "./emergency/EmergencyCanvasProvider";
import { GridDebugOverlay } from "./canvas/GridDebugOverlay";
import logger from "@/utils/logger";
import { resetInitializationState } from "@/utils/canvas/safeCanvasInitialization";
import { useCanvasCleanup } from "@/hooks/useCanvasCleanup";
import { createBasicEmergencyGrid } from "@/utils/gridCreationUtils";
import { toast } from "sonner";
import { dumpGridState, attemptGridRecovery } from "@/utils/grid/gridDebugUtils";

/**
 * Canvas component props
 */
interface CanvasProps {
  /** Handler for canvas errors */
  onError?: () => void;
}

/**
 * Canvas Component
 * @param {CanvasProps} props - Component properties
 * @returns {JSX.Element} Rendered component
 */
export const Canvas: React.FC<CanvasProps> = ({ onError }: CanvasProps = {}) => {
  // Get the canvas controller from context
  const controller = useCanvasController();
  const {
    tool,
    currentFloor,
    lineThickness,
    lineColor,
    floorPlans,
  } = controller;
  
  // Define default dimensions if not provided by controller
  const canvasDimensions = { width: 800, height: 600 };
  
  // References
  const canvasElementRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const gridLayerRef = useRef<FabricCanvas["getObjects"] extends () => infer T ? T : never[]>([]);
  const historyRef = useRef<{past: any[][], future: any[][]}>({ past: [], future: [] });
  const eventHandlersCleanupRef = useRef<(() => void) | null>(null);
  const gridCreatedRef = useRef(false);
  const initAttemptCountRef = useRef(0);
  const gridTimerRef = useRef<number | null>(null);
  
  // Debug state
  const [debugInfo, setDebugInfo] = useState<DebugInfoState>({
    canvasReady: false,
    gridCreated: false,
    lastInitTime: 0,
    lastGridCreationTime: 0
  });
  
  // Grid debug state
  const [showDebugOverlay, setShowDebugOverlay] = useState(true); // Always show debug overlay initially
  
  // Error state
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  // Use canvas cleanup hook for proper resource management
  const { cleanupCanvas } = useCanvasCleanup();

  // Create a function to create grid that we'll pass to the initialization hook
  const createGrid = useCallback((canvas: FabricCanvas) => {
    console.log("Creating grid from Canvas component");
    try {
      // Make sure canvas has dimensions
      if (canvas.getWidth() === 0 || canvas.getHeight() === 0) {
        console.error("Cannot create grid on zero-dimension canvas");
        return [];
      }
      
      // Create the grid
      const grid = createBasicEmergencyGrid(canvas, gridLayerRef);
      
      // Only mark grid as created if we actually got some objects
      if (grid.length > 0) {
        gridCreatedRef.current = true;
        console.log(`Created grid with ${grid.length} objects`);
      } else {
        console.error("Grid creation returned empty array");
      }
      
      return grid;
    } catch (error) {
      console.error("Error creating grid:", error);
      return [];
    }
  }, [gridLayerRef]);
  
  // Initialize the canvas
  const { 
    canvasRef,
    fabricCanvasRef: initFabricCanvasRef,
    gridLayerRef: initGridLayerRef,
    historyRef: initHistoryRef,
    deleteSelectedObjects,
    recalculateGIA,
  } = useCanvasInitialization({
    canvasDimensions,
    tool,
    currentFloor,
    setZoomLevel: (zoom) => console.log('Zoom changed:', zoom), // Placeholder for now
    setDebugInfo,
    setHasError,
    setErrorMessage,
    // Pass our createGrid function
    createGrid
  });
  
  // Sync refs from initialization
  useEffect(() => {
    if (initFabricCanvasRef.current && !fabricCanvasRef.current) {
      fabricCanvasRef.current = initFabricCanvasRef.current;
      console.log("Canvas ref synced:", fabricCanvasRef.current);
    }
    if (initGridLayerRef.current.length && !gridLayerRef.current.length) {
      gridLayerRef.current = initGridLayerRef.current;
      console.log("Grid layer ref synced with", initGridLayerRef.current.length, "objects");
    }
  }, [initFabricCanvasRef.current, initGridLayerRef.current]);
  
  // Create the grid when canvas is ready
  useEffect(() => {
    // Only create grid once and if canvas is ready
    if (fabricCanvasRef.current && !gridCreatedRef.current) {
      console.log("Canvas ready, creating grid...");
      
      // Dump current state for debugging
      dumpGridState(fabricCanvasRef.current, gridLayerRef);
      
      const grid = createGrid(fabricCanvasRef.current);
      console.log(`Created grid with ${grid.length} objects`);
      
      if (grid.length === 0) {
        // If grid creation failed, try again after a delay
        if (gridTimerRef.current) {
          window.clearTimeout(gridTimerRef.current);
        }
        
        gridTimerRef.current = window.setTimeout(() => {
          if (fabricCanvasRef.current) {
            console.log("Retrying grid creation...");
            const grid = createGrid(fabricCanvasRef.current);
            
            if (grid.length > 0) {
              console.log(`Retry created grid with ${grid.length} objects`);
              toast.success(`Created grid with ${grid.length} objects`);
            } else {
              console.error("Grid creation failed even after retry");
              if (initAttemptCountRef.current < 3) {
                initAttemptCountRef.current++;
                console.log(`Will try again soon (attempt ${initAttemptCountRef.current})`);
                
                // Try recovery
                if (attemptGridRecovery(fabricCanvasRef.current, gridLayerRef, createGrid)) {
                  toast.success("Grid successfully recovered");
                } else {
                  // Try once more after a longer delay
                  gridTimerRef.current = window.setTimeout(() => {
                    if (fabricCanvasRef.current) {
                      console.log(`Final grid creation attempt ${initAttemptCountRef.current}`);
                      const grid = createGrid(fabricCanvasRef.current);
                      console.log(`Final attempt result: ${grid.length} objects`);
                    }
                  }, 1500);
                }
              }
            }
          }
        }, 800);
      } else {
        toast.success(`Created grid with ${grid.length} objects`);
      }
    }
    
    // Clean up on unmount
    return () => {
      if (gridTimerRef.current !== null) {
        window.clearTimeout(gridTimerRef.current);
        gridTimerRef.current = null;
      }
    };
  }, [fabricCanvasRef.current, createGrid, gridLayerRef]);
  
  // Get the cleanup function for canvas initialization
  const cleanupInitialization = useCallback(() => {
    logger.debug("Cleaning up canvas initialization");
    // Any additional cleanup for initialization
  }, []);
  
  // Set up drawing on the canvas
  const { drawingState } = useCanvasDrawing({
    fabricCanvasRef,
    gridLayerRef,
    historyRef: initHistoryRef, // Use the history from initialization
    tool,
    currentFloor,
    // Use optional chaining for potential undefined methods
    setFloorPlans: (updatedFloorPlans) => {
      if (controller.setFloorPlans) {
        controller.setFloorPlans(updatedFloorPlans);
      }
    },
    setGia: (updatedGia) => {
      if (controller.setGia) {
        controller.setGia(updatedGia);
      }
    },
    lineThickness,
    lineColor,
    deleteSelectedObjects,
    recalculateGIA
  });
  
  // Define a cleanup function for drawing
  const cleanupDrawing = useCallback(() => {
    logger.debug("Cleaning up canvas drawing");
    // Additional drawing cleanup if needed
  }, []);
  
  const { 
    isDrawing, 
    startPoint, 
    currentPoint, 
    midPoint,
    currentZoom 
  } = drawingState;
  
  // Handle canvas retry
  const handleCanvasRetry = useCallback(() => {
    // Reset error state
    setHasError(false);
    setErrorMessage("");
    
    // Reset initialization state
    resetInitializationState();
    
    // Update debug info
    setDebugInfo(prev => ({
      ...prev,
      canvasReady: false,
      gridCreated: false,
      lastInitTime: Date.now()
    }));
    
    // Reset grid created flag
    gridCreatedRef.current = false;
    
    // Force a re-render
    canvasElementRef.current = null;
  }, [setDebugInfo, setHasError, setErrorMessage]);
  
  // Toggle debug overlay with keyboard shortcut
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl+Alt+G to toggle grid debug overlay
      if (e.ctrlKey && e.altKey && e.key === 'g') {
        setShowDebugOverlay(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);
  
  // Comprehensive cleanup when component unmounts
  useEffect(() => {
    return () => {
      logger.info("Canvas component unmounting, performing cleanup");
      
      // Call event handlers cleanup if available
      if (eventHandlersCleanupRef.current) {
        logger.debug("Cleaning up event handlers");
        eventHandlersCleanupRef.current();
      }
      
      // Clean up grid timer
      if (gridTimerRef.current !== null) {
        window.clearTimeout(gridTimerRef.current);
        gridTimerRef.current = null;
      }
      
      // Call additional cleanup functions
      cleanupDrawing();
      cleanupInitialization();
      
      // Clean up the Fabric canvas instance
      if (fabricCanvasRef.current) {
        logger.debug("Cleaning up Fabric canvas");
        cleanupCanvas(fabricCanvasRef.current);
        fabricCanvasRef.current = null;
      }
    };
  }, [cleanupCanvas, cleanupDrawing, cleanupInitialization]);
  
  // Add error handling to the canvas
  useEffect(() => {
    // Register error handler
    const handleError = () => {
      console.error("Canvas error occurred");
      if (onError && typeof onError === 'function') {
        onError();
      }
    };
    
    // Attach error handler to canvas element if needed
    const canvasElement = canvasRef.current;
    if (canvasElement) {
      canvasElement.addEventListener('error', handleError);
    }
    
    return () => {
      // Clean up error handler
      if (canvasElement) {
        canvasElement.removeEventListener('error', handleError);
      }
    };
  }, [onError, canvasRef]);
  
  // Render the canvas and UI components
  return (
    <div className="relative w-full h-full">
      <EmergencyCanvasProvider
        errorState={hasError}
        errorMessage={errorMessage}
        debugInfo={debugInfo}
        onRetry={handleCanvasRetry}
        width={canvasDimensions.width}
        height={canvasDimensions.height}
      >
        <CanvasContainer
          debugInfo={debugInfo}
          canvasElementRef={canvasElementRef}
        />
        
        {/* Grid debugging overlay - always show on floor plan editor */}
        <GridDebugOverlay 
          fabricCanvasRef={fabricCanvasRef}
          gridLayerRef={gridLayerRef}
          isVisible={true} // Force to always be visible for floorplans route
        />
        
        {/* Distance measurement tooltip */}
        <DistanceTooltip
          startPoint={startPoint}
          currentPoint={currentPoint}
          midPoint={midPoint}
          isVisible={isDrawing && tool === 'wall' && !!startPoint && !!currentPoint}
          currentZoom={currentZoom}
        />
      </EmergencyCanvasProvider>
    </div>
  );
};
