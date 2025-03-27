
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
  
  // Debug state
  const [debugInfo, setDebugInfo] = useState<DebugInfoState>({
    canvasReady: false,
    gridCreated: false,
    lastInitTime: 0,
    lastGridCreationTime: 0
  });
  
  // Grid debug state
  const [showDebugOverlay, setShowDebugOverlay] = useState(
    process.env.NODE_ENV === 'development'
  );
  
  // Error state
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  // Use canvas cleanup hook for proper resource management
  const { cleanupCanvas } = useCanvasCleanup();
  
  // Initialize the canvas
  const { 
    canvasRef,
    fabricCanvasRef: initFabricCanvasRef,
    gridLayerRef: initGridLayerRef,
    historyRef: initHistoryRef,
    deleteSelectedObjects,
    recalculateGIA,
    // Note: we removed the cleanup property to match the actual return type
  } = useCanvasInitialization({
    canvasDimensions,
    tool,
    currentFloor,
    setZoomLevel: (zoom) => console.log('Zoom changed:', zoom), // Placeholder for now
    setDebugInfo,
    setHasError,
    setErrorMessage,
    // Pass our emergency grid creation function
    createGrid: (canvas) => {
      const initialGridCreated = createBasicEmergencyGrid(canvas, gridLayerRef);
      return gridLayerRef.current;
    }
  });
  
  // Sync refs from initialization
  useEffect(() => {
    if (initFabricCanvasRef.current && !fabricCanvasRef.current) {
      fabricCanvasRef.current = initFabricCanvasRef.current;
    }
    if (initGridLayerRef.current.length && !gridLayerRef.current.length) {
      gridLayerRef.current = initGridLayerRef.current;
    }
  }, [initFabricCanvasRef.current, initGridLayerRef.current]);
  
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
        
        {/* Grid debugging overlay */}
        <GridDebugOverlay 
          fabricCanvasRef={fabricCanvasRef}
          gridLayerRef={gridLayerRef}
          isVisible={showDebugOverlay}
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
