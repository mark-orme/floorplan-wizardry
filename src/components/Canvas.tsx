
/**
 * Main Canvas component that integrates with Fabric.js
 * @module components/Canvas
 */
import React, { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, PencilBrush } from "fabric";
import { useDrawingContext } from "@/contexts/DrawingContext";
import { DrawingMode } from "@/constants/drawingModes";
import { toast } from "sonner";
import logger from "@/utils/logger";
import { BasicGrid } from "./BasicGrid";

/**
 * Props for Canvas component
 */
interface CanvasProps {
  width?: number;
  height?: number;
  onCanvasReady?: (canvas: FabricCanvas) => void;
  onError?: (error: Error) => void;
}

/**
 * Main Canvas component 
 * Creates and manages a Fabric.js canvas instance
 */
export const Canvas: React.FC<CanvasProps> = ({
  width = 800,
  height = 600,
  onCanvasReady,
  onError
}) => {
  const { tool, lineColor, lineThickness } = useDrawingContext();
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    
    try {
      logger.info("Initializing canvas with dimensions:", { width, height });
      
      const fabricCanvas = new FabricCanvas(canvasRef.current, {
        width,
        height,
        backgroundColor: "#ffffff",
        selection: tool === DrawingMode.SELECT
      });
      
      // Initialize the drawing brush
      fabricCanvas.freeDrawingBrush = new PencilBrush(fabricCanvas);
      fabricCanvas.freeDrawingBrush.color = lineColor;
      fabricCanvas.freeDrawingBrush.width = lineThickness;
      
      setCanvas(fabricCanvas);
      
      if (onCanvasReady) {
        onCanvasReady(fabricCanvas);
      }
      
      logger.info("Canvas initialized successfully");
    } catch (error) {
      logger.error("Error initializing canvas:", error);
      if (onError && error instanceof Error) {
        onError(error);
      }
      toast.error("Failed to initialize canvas");
    }
    
    return () => {
      if (canvas) {
        try {
          canvas.dispose();
          logger.info("Canvas disposed");
        } catch (error) {
          logger.error("Error disposing canvas:", error);
        }
      }
    };
  }, []);
  
  // Update drawing mode when tool changes
  useEffect(() => {
    if (!canvas) return;
    
    canvas.isDrawingMode = tool === DrawingMode.DRAW;
    canvas.selection = tool === DrawingMode.SELECT;
    
    // Update brush settings if in drawing mode
    if (tool === DrawingMode.DRAW) {
      canvas.freeDrawingBrush.color = lineColor;
      canvas.freeDrawingBrush.width = lineThickness;
    }
    
    canvas.requestRenderAll();
  }, [canvas, tool, lineColor, lineThickness]);
  
  return (
    <div className="relative">
      <canvas ref={canvasRef} className="border border-gray-200" />
      {canvas && <BasicGrid canvas={canvas} />}
    </div>
  );
};
