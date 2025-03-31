
import React, { useEffect, useRef } from "react";
import { Canvas as FabricCanvas } from "fabric";
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
  width: number;
  height: number;
  onCanvasRef?: (ref: any) => void;
}

/**
 * Connected drawing canvas component
 * Manages canvas state and provides drawing functionality
 */
export const ConnectedDrawingCanvas: React.FC<ConnectedDrawingCanvasProps> = ({
  width,
  height,
  onCanvasRef
}) => {
  // Access drawing context
  const { 
    tool, 
    lineColor, 
    lineThickness 
  } = useDrawingContext();
  
  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gridLayerRef = useRef<any[]>([]);
  
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
    tool
  });

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
    if (!onCanvasRef) return;
    
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
    
    onCanvasRef(operations);
  }, [canvas, canUndo, canRedo, onCanvasRef, undo, redo, clearCanvas, deleteSelectedObjects, saveCanvas, zoom]);
  
  return (
    <>
      <canvas ref={canvasRef} className="border border-gray-200" />
      
      {canvas && (
        <CanvasEventManager
          canvas={canvas}
          tool={tool}
          lineThickness={lineThickness}
          lineColor={lineColor}
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
