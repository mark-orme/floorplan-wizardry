
import React, { useEffect, useState } from "react";
import { Canvas } from "@/components/Canvas";
import { DebugInfoState } from "@/types/drawingTypes";
import { DEFAULT_DEBUG_STATE } from "@/types/core/DebugInfo";
import { GridLayer } from "./grid/GridLayer";
import { toast } from "sonner";
import { useCanvasContext } from "@/contexts/CanvasContext";
import logger from "@/utils/logger";

interface CanvasContainerProps {
  onCanvasRef?: (ref: any) => void;
  debugInfo?: DebugInfoState;
}

export const CanvasContainer: React.FC<CanvasContainerProps> = ({
  onCanvasRef,
  debugInfo = DEFAULT_DEBUG_STATE
}) => {
  const [localDebugInfo, setLocalDebugInfo] = useState(debugInfo);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [canvasError, setCanvasError] = useState<string | null>(null);
  const { canvas, setCanvas } = useCanvasContext();

  // Update local debug info when props change
  useEffect(() => {
    setLocalDebugInfo(debugInfo);
  }, [debugInfo]);

  // Handle canvas element resize
  useEffect(() => {
    const updateDimensions = () => {
      const container = document.getElementById('canvas-container');
      if (container) {
        const { clientWidth, clientHeight } = container;
        if (clientWidth !== dimensions.width || clientHeight !== dimensions.height) {
          setDimensions({
            width: Math.max(clientWidth, 800),
            height: Math.max(clientHeight, 600)
          });
        }
      }
    };

    // Initial update
    updateDimensions();

    // Listen for resize events
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, [dimensions]);

  // Handle canvas ready
  const handleCanvasReady = (canvas: any) => {
    logger.info("Canvas ready event received");
    
    // Set canvas in context
    if (setCanvas) {
      setCanvas(canvas);
    }
    
    // Call onCanvasRef if provided
    if (onCanvasRef) {
      onCanvasRef(canvas);
    }
    
    // Update debug info
    setLocalDebugInfo(prev => ({
      ...prev,
      canvasReady: true,
      canvasInitialized: true,
      canvasCreated: true,
      dimensionsSet: true
    }));
  };

  // Handle canvas error
  const handleCanvasError = () => {
    const errorMsg = "Error initializing canvas";
    setCanvasError(errorMsg);
    logger.error(errorMsg);
    toast.error(errorMsg);
  };

  return (
    <div 
      id="canvas-container" 
      className="flex-1 w-full h-full overflow-hidden relative"
      data-testid="canvas-container"
      data-canvas-ready={localDebugInfo.canvasReady ? "true" : "false"}
    >
      <Canvas
        width={dimensions.width}
        height={dimensions.height}
        onCanvasReady={handleCanvasReady}
        onError={handleCanvasError}
      />
      
      {canvas && (
        <GridLayer 
          fabricCanvas={canvas}
          dimensions={dimensions}
          showDebug={localDebugInfo.showDebugInfo}
        />
      )}
      
      {canvasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/10">
          <div className="bg-white p-4 rounded shadow text-red-500">
            {canvasError}
          </div>
        </div>
      )}
    </div>
  );
};
