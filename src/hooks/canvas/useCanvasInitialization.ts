
import { useState, useEffect } from "react";
import { Canvas as FabricCanvas, Line } from "fabric";
import { DrawingMode } from "@/constants/drawingModes";
import { toast } from "sonner";
import { captureMessage, captureError } from "@/utils/sentry";
import logger from "@/utils/logger";

interface UseCanvasInitializationProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  width: number;
  height: number;
  tool: DrawingMode;
}

export const useCanvasInitialization = ({
  canvasRef,
  width,
  height,
  tool
}: UseCanvasInitializationProps) => {
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current || initialized) return;
    
    try {
      logger.info("Initializing canvas", { 
        canvasWidth: width, 
        canvasHeight: height, 
        initialTool: tool 
      });
      
      const fabricCanvas = new FabricCanvas(canvasRef.current, {
        width,
        height,
        selection: tool === DrawingMode.SELECT,
        backgroundColor: "#ffffff"
      });
      
      setCanvas(fabricCanvas);
      setInitialized(true);
      
      captureMessage("Canvas initialized", "canvas-init", {
        tags: { component: "ConnectedDrawingCanvas" },
        extra: { canvasWidth: width, canvasHeight: height, initialTool: tool }
      });
      
      // Create grid
      createGrid(fabricCanvas);
      
      // Clean up canvas on unmount
      return () => {
        logger.info("Disposing canvas");
        fabricCanvas.dispose();
      };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      logger.error("Failed to initialize canvas", { error: errorMsg });
      captureError(error as Error, "canvas-init-error");
      toast.error(`Failed to initialize canvas: ${errorMsg}`);
    }
  }, [width, height, tool, initialized, canvasRef]);

  // Create grid function
  const createGrid = (fabricCanvas: FabricCanvas) => {
    try {
      logger.info("Creating grid");
      
      const gridSize = 20;
      const gridObjects: any[] = [];
      
      // Create horizontal grid lines
      for (let i = 0; i <= height; i += gridSize) {
        const line = new Line([0, i, width, i], {
          stroke: "#e0e0e0",
          selectable: false,
          evented: false,
          objectType: "grid"
        } as any);
        fabricCanvas.add(line);
        gridObjects.push(line);
      }
      
      // Create vertical grid lines
      for (let i = 0; i <= width; i += gridSize) {
        const line = new Line([i, 0, i, height], {
          stroke: "#e0e0e0",
          selectable: false,
          evented: false,
          objectType: "grid"
        } as any);
        fabricCanvas.add(line);
        gridObjects.push(line);
      }
      
      captureMessage("Grid created", "grid-create", {
        tags: { component: "ConnectedDrawingCanvas", action: "gridCreate" },
        extra: { tool, lineThickness: 1, lineColor: "#e0e0e0" }
      });
      
      return gridObjects;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      logger.error("Failed to create grid", { error: errorMsg });
      captureError(error as Error, "grid-create-error");
      toast.error(`Failed to create grid: ${errorMsg}`);
      return [];
    }
  };

  return {
    canvas,
    initialized,
    setInitialized,
    createGrid
  };
};
