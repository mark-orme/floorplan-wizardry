
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
import { DebugInfoState, DEFAULT_DEBUG_STATE } from "@/types/core/DebugInfo";

/**
 * Props for Canvas component
 */
interface CanvasProps {
  width?: number;
  height?: number;
  onCanvasReady?: (canvas: FabricCanvas) => void;
  onError?: (error: Error) => void;
  setDebugInfo?: React.Dispatch<React.SetStateAction<DebugInfoState>>;
}

/**
 * Main Canvas component 
 * Creates and manages a Fabric.js canvas instance
 */
export const Canvas: React.FC<CanvasProps> = ({
  width = 800,
  height = 600,
  onCanvasReady,
  onError,
  setDebugInfo
}) => {
  const { tool, lineColor, lineThickness } = useDrawingContext();
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [localDebugInfo, setLocalDebugInfo] = useState<DebugInfoState>(DEFAULT_DEBUG_STATE);
  
  // Update parent debugInfo if provided
  useEffect(() => {
    if (setDebugInfo) {
      setDebugInfo(localDebugInfo);
    }
  }, [localDebugInfo, setDebugInfo]);
  
  // Helper to update debug info
  const updateDebugInfo = (update: Partial<DebugInfoState>) => {
    setLocalDebugInfo(prev => ({
      ...prev,
      ...update
    }));
  };
  
  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    
    try {
      logger.info("Initializing canvas with dimensions:", { width, height });
      console.log("Initializing canvas with dimensions:", width, height);
      
      updateDebugInfo({ canvasCreated: true });
      
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
      
      updateDebugInfo({ 
        canvasInitialized: true, 
        brushInitialized: true,
        dimensionsSet: true
      });
      
      setCanvas(fabricCanvas);
      
      if (onCanvasReady) {
        onCanvasReady(fabricCanvas);
      }
      
      updateDebugInfo({ canvasReady: true });
      
      logger.info("Canvas initialized successfully");
      console.log("Canvas initialized successfully");
      
      toast.success("Canvas ready", {
        id: "canvas-ready-toast"
      });
    } catch (error) {
      logger.error("Error initializing canvas:", error);
      console.error("Error initializing canvas:", error);
      
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
    
    updateDebugInfo({ eventHandlersSet: true });
  }, [canvas, tool, lineColor, lineThickness]);
  
  // Handle grid creation callback
  const handleGridCreated = (gridObjects: any[]) => {
    console.log(`Grid created with ${gridObjects.length} objects`);
    updateDebugInfo({ 
      gridCreated: true,
      gridObjectCount: gridObjects.length
    });
  };
  
  return (
    <div className="relative">
      <canvas ref={canvasRef} className="border border-gray-200" />
      {canvas && (
        <BasicGrid 
          canvas={canvas} 
          onGridCreated={handleGridCreated} 
        />
      )}
      
      {/* Debug overlay */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-0 right-0 bg-black/30 text-white p-2 text-xs">
          <div>Canvas Ready: {localDebugInfo.canvasReady ? '✅' : '❌'}</div>
          <div>Canvas Init: {localDebugInfo.canvasInitialized ? '✅' : '❌'}</div>
          <div>Grid Created: {localDebugInfo.gridCreated ? '✅' : '❌'}</div>
          <div>Grid Objects: {localDebugInfo.gridObjectCount}</div>
          <div>Tool: {tool}</div>
        </div>
      )}
    </div>
  );
};
