
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
  } = controller;
  
  // References
  const canvasElementRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const gridLayerRef = useRef<FabricCanvas["getObjects"] extends () => infer T ? T : never[]>([]);
  const historyRef = useRef<{past: any[][], future: any[][]}>({ past: [], future: [] });
  
  // Debug state
  const [debugInfo, setDebugInfo] = useState<DebugInfoState>({
    canvasReady: false,
    gridCreated: false,
    gridObjectCount: 0,
    lastInitTime: 0,
    lastGridCreationTime: 0
  });
  
  // Error state
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  // Initialize the canvas
  const { 
    isInitialized,
    deleteSelectedObjects,
    recalculateGIA
  } = useCanvasInitialization({
    canvasElementRef,
    fabricCanvasRef,
    gridLayerRef,
    canvasDimensions: controller.dimensions,
    setDebugInfo,
    setHasError,
    setErrorMessage,
    createGrid: controller.createGrid || (() => [])
  });
  
  // Set up drawing on the canvas
  const { drawingState } = useCanvasDrawing({
    fabricCanvasRef,
    gridLayerRef,
    historyRef,
    tool,
    currentFloor,
    setFloorPlans: controller.setFloorPlans || (() => {}),
    setGia: controller.setGia || (() => {}),
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
