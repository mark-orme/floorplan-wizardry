
import React, { useEffect, useState } from "react";
import { Canvas } from "@/components/Canvas";
import { DebugInfoState } from "@/types/drawingTypes";
import { DEFAULT_DEBUG_STATE } from "@/types/core/DebugInfo";
import { toast } from "sonner";
import { useCanvasContext } from "@/contexts/CanvasContext";
import logger from "@/utils/logger";

interface CanvasContainerProps {
  onCanvasRef?: (ref: any) => void;
  debugInfo?: DebugInfoState;
  showGridDebug?: boolean;
}

export const CanvasContainer: React.FC<CanvasContainerProps> = ({
  onCanvasRef,
  debugInfo = DEFAULT_DEBUG_STATE,
  showGridDebug = true
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
        const newWidth = Math.max(clientWidth, 800);
        const newHeight = Math.max(clientHeight, 600);
        
        // Only update state if dimensions actually changed
        if (newWidth !== dimensions.width || newHeight !== dimensions.height) {
          setDimensions({
            width: newWidth,
            height: newHeight
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
  }, []); // Remove dimensions from the dependency array

  // Handle canvas ready
  const handleCanvasReady = (canvas: any) => {
    logger.info("Canvas ready event received");
    console.log("CanvasContainer: Canvas ready event received");
    
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
  const handleCanvasError = (error: Error) => {
    const errorMsg = `Error initializing canvas: ${error.message}`;
    setCanvasError(errorMsg);
    logger.error(errorMsg);
    console.error(errorMsg);
    toast.error(errorMsg);
  };

  // Safely check if canvasReady exists in debug info
  const isCanvasReady = localDebugInfo?.canvasReady !== undefined ? localDebugInfo.canvasReady : false;

  return (
    <div 
      id="canvas-container" 
      className="flex-1 w-full h-full overflow-hidden relative"
      data-testid="canvas-container"
      data-canvas-ready={isCanvasReady ? "true" : "false"}
    >
      <Canvas
        width={dimensions.width}
        height={dimensions.height}
        onCanvasReady={handleCanvasReady}
        onError={handleCanvasError}
        showGridDebug={showGridDebug}
      />
      
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
