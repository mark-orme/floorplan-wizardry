import React, { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, PencilBrush } from "fabric";
import { CanvasEventManager } from "./CanvasEventManager";
import { DrawingMode } from "@/constants/drawingModes";
import { useDrawingContext } from "@/contexts/DrawingContext";
import { toast } from "sonner";
import { captureMessage } from "@/utils/sentry";
import logger from "@/utils/logger";
import { useCanvasInitialization } from "@/hooks/canvas/useCanvasInitialization";
import { useCanvasHistory } from "@/hooks/canvas/useCanvasHistory";
import { useCanvasOperations } from "@/hooks/canvas/useCanvasOperations";

/**
 * Props for ConnectedDrawingCanvas component
 */
interface ConnectedDrawingCanvasProps {
  width?: number;
  height?: number;
  onCanvasRef?: (ref: any) => void;
  tool?: DrawingMode;
  lineColor?: string;
  lineThickness?: number;
}

/**
 * Connected drawing canvas component
 * Manages canvas state and provides drawing functionality
 */
export const ConnectedDrawingCanvas: React.FC<ConnectedDrawingCanvasProps> = ({
  width = 800,
  height = 600,
  onCanvasRef,
  tool = DrawingMode.SELECT,
  lineColor = "#000000",
  lineThickness = 2
}) => {
  // Access drawing context
  const { 
    activeTool: contextTool, 
    lineColor: contextLineColor, 
    lineThickness: contextLineThickness 
  } = useDrawingContext();
  
  // Use props or context values
  const activeTool = tool || contextTool;
  const activeLineColor = lineColor || contextLineColor;
  const activeLineThickness = lineThickness || contextLineThickness;
  
  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gridLayerRef = useRef<any[]>([]);
  const operationsRef = useRef<any>(null);
  
  // Use our custom hooks
  const { 
    canvas, 
    initialized,
    setInitialized,
    createGrid
  } = useCanvasInitialization({
    canvasRef,
    width,
    height,
    tool: activeTool
  });

  // Create grid when canvas is initialized
  useEffect(() => {
    if (canvas && initialized && gridLayerRef.current.length === 0) {
      const gridObjects = createGrid(canvas);
      gridLayerRef.current = gridObjects;
      logger.info(`Created grid on canvas initialization with ${gridObjects.length} objects`);
      canvas.renderAll();
    }
  }, [canvas, initialized, createGrid]);

  // Initialize the drawing brush when canvas is initialized
  useEffect(() => {
    if (canvas && initialized) {
      // Ensure the drawing brush is initialized
      if (!canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush = new PencilBrush(canvas);
        logger.info("Initialized freeDrawingBrush on canvas");
      }
      
      // Configure the brush
      canvas.freeDrawingBrush.color = activeLineColor;
      canvas.freeDrawingBrush.width = activeLineThickness;
      logger.info("Configured drawing brush", { color: activeLineColor, width: activeLineThickness });
    }
  }, [canvas, initialized, activeLineColor, activeLineThickness]);

  const {
    historyStack,
    historyIndex,
    canUndo,
    canRedo,
    saveCurrentState,
    undo,
    redo
  } = useCanvasHistory({ canvas });

  const {
    deleteSelectedObjects,
    clearCanvas,
    zoom,
    saveCanvas
  } = useCanvasOperations({
    canvas,
    saveCurrentState
  });
  
  // Expose canvas operations to parent component
  useEffect(() => {
    if (!onCanvasRef || !canvas) return;
    
    const operations = {
      canvas,
      canUndo,
      canRedo,
      undo,
      redo,
      clearCanvas,
      deleteSelectedObjects,
      saveCanvas,
      zoom,
      getCanvas: () => canvas
    };
    
    // Only update if the operations have changed to prevent unnecessary re-renders
    if (JSON.stringify(operationsRef.current) !== JSON.stringify(operations)) {
      operationsRef.current = operations;
      onCanvasRef(operations);
    }
  }, [canvas, canUndo, canRedo, onCanvasRef, undo, redo, clearCanvas, deleteSelectedObjects, saveCanvas, zoom]);
  
  return (
    <>
      <canvas ref={canvasRef} className="border border-gray-200" />
      
      {canvas && (
        <CanvasEventManager
          canvas={canvas}
          tool={activeTool}
          lineThickness={activeLineThickness}
          lineColor={activeLineColor}
          gridLayerRef={gridLayerRef}
          saveCurrentState={saveCurrentState}
          undo={undo}
          redo={redo}
          deleteSelectedObjects={deleteSelectedObjects}
        />
      )}
    </>
  );
};
