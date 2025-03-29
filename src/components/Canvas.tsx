
import React, { useRef, useEffect, useState } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { toast } from "sonner";
import { useCanvasContext } from "@/contexts/CanvasContext";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { CANVAS_CONSTANTS } from "@/constants/canvasConstants";
import { ERROR_MESSAGES } from "@/constants/errorMessages";
import { useCanvasGrid } from "@/hooks/useCanvasGrid";
import logger from "@/utils/logger";

interface CanvasProps {
  width?: number;
  height?: number;
  backgroundColor?: string;
  onCanvasReady?: (canvas: FabricCanvas) => void;
  onError?: (error: Error) => void;
}

export const Canvas: React.FC<CanvasProps> = ({
  width = CANVAS_CONSTANTS.DEFAULT_WIDTH,
  height = CANVAS_CONSTANTS.DEFAULT_HEIGHT,
  backgroundColor = CANVAS_CONSTANTS.DEFAULT_BACKGROUND_COLOR,
  onCanvasReady,
  onError
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<Error | null>(null);
  const [initAttempts, setInitAttempts] = useState(0);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const { setCanvas } = useCanvasContext();

  // Set up grid handling with the useCanvasGrid hook
  const { gridLayerRef, createGrid } = useCanvasGrid({
    fabricCanvasRef,
    canvasDimensions: { width, height }
  });

  // Canvas initialization effect
  useEffect(() => {
    const initCanvas = (): void => {
      try {
        if (!canvasRef.current) {
          throw new Error(ERROR_MESSAGES.CANVAS_ELEMENT_NOT_FOUND);
        }

        console.log("Initializing canvas with dimensions:", width, height);

        // Create fabric.js canvas
        const canvas = new FabricCanvas(canvasRef.current, {
          width,
          height,
          backgroundColor,
          selection: true,
          preserveObjectStacking: true
        });

        // Initialize the canvas with default settings
        canvas.setDimensions({ width, height });
        
        // Set free drawing brush options
        if (canvas.freeDrawingBrush) {
          canvas.freeDrawingBrush.color = CANVAS_CONSTANTS.DEFAULT_BRUSH_COLOR;
          canvas.freeDrawingBrush.width = CANVAS_CONSTANTS.DEFAULT_BRUSH_WIDTH;
        }

        // Store the canvas reference in both state and ref
        setFabricCanvas(canvas);
        fabricCanvasRef.current = canvas;
        setCanvas(canvas);

        // Notify parent component
        if (onCanvasReady) {
          onCanvasReady(canvas);
        }

        logger.info("Canvas initialized successfully");
        console.log("Canvas initialized successfully", { 
          width: canvas.width, 
          height: canvas.height 
        });
        
        // Initialize the grid after a short delay
        setTimeout(() => {
          console.log("Creating grid after initialization");
          createGrid();
        }, 300);

      } catch (err) {
        const error = err instanceof Error ? err : new Error(ERROR_MESSAGES.CANVAS_INIT_FAILED);
        logger.error("Canvas initialization error:", error);
        console.error("Canvas initialization error:", error);
        setError(error);
        
        if (onError) {
          onError(error);
        }
      }
    };

    // Initialize canvas
    initCanvas();

    // Cleanup function
    return () => {
      if (fabricCanvas) {
        fabricCanvas.dispose();
        setFabricCanvas(null);
        fabricCanvasRef.current = null;
        setCanvas(null);
      }
    };
  }, [width, height, backgroundColor, setCanvas, onCanvasReady, onError, initAttempts, createGrid]);

  const handleRetry = (): void => {
    setError(null);
    setInitAttempts(prev => prev + 1);
    toast.info("Retrying canvas initialization...");
  };

  const handleForceGrid = (): void => {
    if (fabricCanvasRef.current) {
      console.log("Forcing grid recreation...");
      createGrid();
      toast.info("Forcing grid recreation...");
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] bg-gray-50 border border-gray-200 rounded-md p-4">
        <p className="text-red-500 mb-4">
          {error.message || ERROR_MESSAGES.CANVAS_INIT_FAILED}
        </p>
        <div className="flex gap-2">
          <Button onClick={handleRetry} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          <Button onClick={handleForceGrid} variant="outline">
            Create Grid
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <canvas 
        ref={canvasRef} 
        className="border border-gray-200 rounded-lg shadow-lg max-w-full"
        data-testid="canvas"
      />
      {fabricCanvas && !gridLayerRef.current.length && (
        <Button 
          onClick={handleForceGrid}
          className="absolute top-2 right-2"
          size="sm"
          variant="secondary"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Create Grid
        </Button>
      )}
    </div>
  );
};
