
import React, { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { CanvasContainer } from "./CanvasContainer";
import { useCanvasInitialization } from "@/hooks/useCanvasInitialization";
import { useCanvasDrawing } from "@/hooks/useCanvasDrawing";
import { useCanvasController } from "@/components/canvas/controller/CanvasController";
import { DistanceTooltip } from "./DistanceTooltip";
import { DebugInfoState } from "@/types/debugTypes";
import logger from "@/utils/logger";

export const Canvas: React.FC = () => {
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
  
  // Debug state
  const [debugInfo, setDebugInfo] = useState<DebugInfoState>({
    canvasReady: false,
    gridCreated: false,
    lastInitTime: 0,
    lastGridCreationTime: 0
  });
  
  // Error state
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  // Initialize the canvas
  const { 
    canvasRef,
    fabricCanvasRef: initFabricCanvasRef,
    gridLayerRef: initGridLayerRef,
    historyRef: initHistoryRef,
    deleteSelectedObjects,
    recalculateGIA
  } = useCanvasInitialization({
    canvasDimensions,
    tool,
    currentFloor,
    setZoomLevel: (zoom) => console.log('Zoom changed:', zoom), // Placeholder for now
    setDebugInfo,
    setHasError,
    setErrorMessage
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
  
  const { 
    isDrawing, 
    startPoint, 
    currentPoint, 
    midPoint,
    currentZoom 
  } = drawingState;
  
  // Log drawing state for debugging
  useEffect(() => {
    if (isDrawing && startPoint && currentPoint) {
      logger.debug("Drawing:", { start: startPoint, current: currentPoint });
    }
  }, [isDrawing, startPoint, currentPoint]);
  
  // Render the canvas and UI components
  return (
    <div className="relative w-full h-full">
      <CanvasContainer
        debugInfo={debugInfo}
        canvasElementRef={canvasElementRef}
      />
      
      {/* Distance measurement tooltip */}
      <DistanceTooltip
        startPoint={startPoint}
        currentPoint={currentPoint}
        midPoint={midPoint}
        isVisible={isDrawing && tool === 'wall' && !!startPoint && !!currentPoint}
        currentZoom={currentZoom}
      />
      
      {/* Error display */}
      {hasError && (
        <div className="absolute top-4 left-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {errorMessage}</span>
        </div>
      )}
    </div>
  );
};
