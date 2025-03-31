
import React, { forwardRef, useEffect, useState, useRef, useImperativeHandle } from "react";
import { Canvas as FabricCanvas, Object as FabricObject, Line, Text, Point as FabricPoint } from "fabric";
import { CanvasEventManager } from "./CanvasEventManager";
import { DrawingMode } from "@/constants/drawingModes";
import { useDrawingContext } from "@/contexts/DrawingContext";
import { toast } from "sonner";
import { captureMessage, captureError } from "@/utils/sentry";
import logger from "@/utils/logger";
import { Point } from "@/types/core/Point";

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
  
  // Canvas state
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
  const [historyStack, setHistoryStack] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  
  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gridLayerRef = useRef<FabricObject[]>([]);
  
  // Property to track if canvas has been initialized
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
  }, [width, height, tool, initialized]);
  
  // Create grid on canvas
  const createGrid = (fabricCanvas: FabricCanvas) => {
    try {
      logger.info("Creating grid");
      
      const gridSize = 20;
      const gridObjects: FabricObject[] = [];
      
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
      
      gridLayerRef.current = gridObjects;
      
      captureMessage("Grid created", "grid-create", {
        tags: { component: "ConnectedDrawingCanvas", action: "gridCreate" },
        extra: { tool, lineThickness, lineColor }
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      logger.error("Failed to create grid", { error: errorMsg });
      captureError(error as Error, "grid-create-error");
      toast.error(`Failed to create grid: ${errorMsg}`);
    }
  };
  
  // Save current canvas state to history
  const saveCurrentState = () => {
    if (!canvas) return;
    
    try {
      const json = canvas.toJSON(['objectType']);
      const jsonStr = JSON.stringify(json);
      
      // If we're not at the end of the history, remove everything after current index
      const newHistory = historyStack.slice(0, historyIndex + 1);
      newHistory.push(jsonStr);
      
      setHistoryStack(newHistory);
      setHistoryIndex(newHistory.length - 1);
      setCanUndo(newHistory.length > 1);
      setCanRedo(false);
      
      const objectCount = canvas.getObjects().filter(obj => (obj as any).objectType !== 'grid').length;
      
      captureMessage("Canvas state saved", "canvas-save-state", {
        tags: { component: "ConnectedDrawingCanvas", action: "saveState" },
        extra: { count: objectCount }
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      logger.error("Failed to save canvas state", { error: errorMsg });
      captureError(error as Error, "canvas-save-state-error");
      toast.error(`Failed to save canvas state: ${errorMsg}`);
    }
  };
  
  // Undo last action
  const undo = () => {
    if (!canvas || historyIndex <= 0) return;
    
    try {
      const prevState = historyStack[historyIndex - 1];
      // Critical fix: Use the correct signature for loadFromJSON in Fabric.js v6
      const prevStateObj = JSON.parse(prevState);
      canvas.loadFromJSON(prevStateObj);
      canvas.renderAll();
      setHistoryIndex(historyIndex - 1);
      setCanUndo(historyIndex - 1 > 0);
      setCanRedo(true);
      
      captureMessage("Undo performed", "canvas-undo", {
        tags: { component: "ConnectedDrawingCanvas", action: "undo" }
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      logger.error("Failed to undo", { error: errorMsg });
      captureError(error as Error, "canvas-undo-error");
      toast.error(`Failed to undo: ${errorMsg}`);
    }
  };
  
  // Redo last undone action
  const redo = () => {
    if (!canvas || historyIndex >= historyStack.length - 1) return;
    
    try {
      const nextState = historyStack[historyIndex + 1];
      // Critical fix: Use the correct signature for loadFromJSON in Fabric.js v6
      const nextStateObj = JSON.parse(nextState);
      canvas.loadFromJSON(nextStateObj);
      canvas.renderAll();
      setHistoryIndex(historyIndex + 1);
      setCanUndo(true);
      setCanRedo(historyIndex + 1 < historyStack.length - 1);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      logger.error("Failed to redo", { error: errorMsg });
      captureError(error as Error, "canvas-redo-error");
      toast.error(`Failed to redo: ${errorMsg}`);
    }
  };
  
  // Delete selected objects
  const deleteSelectedObjects = () => {
    if (!canvas) return;
    
    try {
      const activeObject = canvas.getActiveObject();
      if (activeObject) {
        if (activeObject.type === 'activeSelection') {
          // Multiple objects selected
          activeObject.forEachObject((obj: FabricObject) => {
            if ((obj as any).objectType !== 'grid') {
              canvas.remove(obj);
            }
          });
          canvas.discardActiveObject();
        } else if ((activeObject as any).objectType !== 'grid') {
          // Single object selected
          canvas.remove(activeObject);
        }
        canvas.requestRenderAll();
        saveCurrentState();
        
        toast.success("Objects deleted");
      } else {
        toast.info("Nothing selected to delete");
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      logger.error("Failed to delete objects", { error: errorMsg });
      captureError(error as Error, "canvas-delete-error");
      toast.error(`Failed to delete objects: ${errorMsg}`);
    }
  };
  
  // Clear canvas (remove all non-grid objects)
  const clearCanvas = () => {
    if (!canvas) return;
    
    try {
      // Get all objects that are not grid
      const nonGridObjects = canvas.getObjects().filter(obj => (obj as any).objectType !== 'grid');
      
      // Remove non-grid objects
      nonGridObjects.forEach(obj => {
        canvas.remove(obj);
      });
      
      // Force render
      canvas.requestRenderAll();
      saveCurrentState();
      
      toast.success("Canvas cleared");
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      logger.error("Failed to clear canvas", { error: errorMsg });
      captureError(error as Error, "canvas-clear-error");
      toast.error(`Failed to clear canvas: ${errorMsg}`);
    }
  };
  
  // Zoom canvas
  const zoom = (direction: "in" | "out") => {
    if (!canvas) return;
    
    try {
      const currentZoom = canvas.getZoom();
      const zoomFactor = direction === "in" ? 1.1 : 0.9;
      const newZoom = currentZoom * zoomFactor;
      
      // Limit zoom range
      if (newZoom > 0.2 && newZoom < 5) {
        // Create a FabricPoint for the center of the canvas
        const centerPoint = new FabricPoint(canvas.width! / 2, canvas.height! / 2);
        canvas.zoomToPoint(centerPoint, newZoom);
        canvas.requestRenderAll();
        
        toast.info(`Zoomed ${direction}`);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      logger.error(`Failed to zoom ${direction}`, { error: errorMsg });
      captureError(error as Error, "canvas-zoom-error");
      toast.error(`Failed to zoom ${direction}: ${errorMsg}`);
    }
  };
  
  // Save canvas to file
  const saveCanvas = () => {
    if (!canvas) return;
    
    try {
      const json = canvas.toJSON(['objectType']);
      const blob = new Blob([JSON.stringify(json)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'canvas-drawing.json';
      a.click();
      URL.revokeObjectURL(url);
      
      toast.success("Canvas saved to file");
      return true;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      logger.error("Failed to save canvas", { error: errorMsg });
      captureError(error as Error, "canvas-save-error");
      toast.error(`Failed to save canvas: ${errorMsg}`);
      return false;
    }
  };
  
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
  }, [canvas, canUndo, canRedo, onCanvasRef]);
  
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
