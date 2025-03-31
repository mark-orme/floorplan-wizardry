
import React, { useEffect, useState } from "react";
import { useCanvasController } from "./controller/CanvasControllerEnhanced";
import { EnhancedCanvas } from "./EnhancedCanvas";
import { Canvas as FabricCanvas } from "fabric";
import { CanvasEventManager } from "./CanvasEventManager";
import { toast } from "sonner";
import { useDrawingContext } from "@/contexts/DrawingContext";
import { captureMessage, captureError } from "@/utils/sentry";
import logger from "@/utils/logger";

interface ConnectedDrawingCanvasProps {
  width?: number;
  height?: number;
}

export const ConnectedDrawingCanvas: React.FC<ConnectedDrawingCanvasProps> = ({
  width = 800,
  height = 600
}) => {
  const {
    gridLayerRef,
    fabricCanvasRef,
    setHasError,
    setErrorMessage,
    checkAndFixGrid,
    forceGridCreation
  } = useCanvasController();
  
  const { tool, lineThickness, lineColor } = useDrawingContext();
  
  const [canvasCreated, setCanvasCreated] = useState(false);
  
  // Handle canvas ready event
  const handleCanvasReady = (canvas: FabricCanvas) => {
    logger.info("Canvas ready event received", { 
      width: canvas.getWidth(), 
      height: canvas.getHeight() 
    });
    
    try {
      fabricCanvasRef.current = canvas;
      setCanvasCreated(true);
      toast.success("Drawing canvas ready");
      
      // Set initial tool mode on canvas
      applyToolToCanvas(canvas, tool);
      
      // Ensure grid is properly set up
      setTimeout(() => {
        checkAndFixGrid();
      }, 100);
      
      captureMessage("Canvas initialized successfully", {
        level: "info",
        tags: { component: "ConnectedDrawingCanvas" },
        extra: { 
          canvasWidth: canvas.getWidth(), 
          canvasHeight: canvas.getHeight(),
          initialTool: tool 
        }
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      logger.error("Failed to initialize canvas", { error: errorMsg });
      captureError(error as Error, "canvas-init-error");
      toast.error(`Failed to initialize canvas: ${errorMsg}`);
      setHasError(true);
      setErrorMessage(`Canvas initialization failed: ${errorMsg}`);
    }
  };
  
  // Apply the selected tool to the canvas
  const applyToolToCanvas = (canvas: FabricCanvas, currentTool: string) => {
    if (!canvas) {
      logger.warn("Cannot apply tool: Canvas not available");
      return;
    }
    
    logger.info("Applying tool to canvas", { currentTool });
    
    try {
      // Reset canvas modes
      canvas.isDrawingMode = false;
      canvas.selection = false;
      
      // Apply specific settings based on tool
      switch (currentTool) {
        case 'select':
          canvas.selection = true;
          canvas.defaultCursor = 'default';
          canvas.hoverCursor = 'move';
          logger.info("Select tool applied to canvas");
          break;
        case 'draw':
          canvas.isDrawingMode = true;
          if (canvas.freeDrawingBrush) {
            canvas.freeDrawingBrush.width = lineThickness;
            canvas.freeDrawingBrush.color = lineColor;
            logger.info("Draw tool applied to canvas", { 
              brushWidth: lineThickness, 
              brushColor: lineColor 
            });
          } else {
            logger.warn("Drawing brush not available");
          }
          canvas.defaultCursor = 'crosshair';
          break;
        case 'straight-line':
          canvas.defaultCursor = 'crosshair';
          canvas.hoverCursor = 'crosshair';
          logger.info("Straight-line tool applied to canvas");
          break;
        case 'hand':
          canvas.defaultCursor = 'grab';
          canvas.hoverCursor = 'grab';
          logger.info("Hand tool applied to canvas");
          break;
        default:
          canvas.selection = true;
          logger.info("Default tool settings applied to canvas");
          break;
      }
      
      canvas.renderAll();
      
      captureMessage("Tool applied to canvas", {
        level: "info",
        tags: { component: "ConnectedDrawingCanvas", action: "applyTool" },
        extra: { tool: currentTool, lineThickness, lineColor }
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      logger.error("Failed to apply tool to canvas", { 
        error: errorMsg, 
        tool: currentTool 
      });
      captureError(error as Error, "apply-tool-error", {
        extra: { tool: currentTool, lineThickness, lineColor }
      });
    }
  };
  
  // Watch for tool changes and apply them to the canvas
  useEffect(() => {
    if (canvasCreated && fabricCanvasRef.current) {
      logger.info("Tool change detected", { 
        newTool: tool, 
        lineThickness, 
        lineColor 
      });
      applyToolToCanvas(fabricCanvasRef.current, tool);
    }
  }, [tool, lineThickness, lineColor, canvasCreated, fabricCanvasRef]);
  
  // Handle canvas error
  const handleCanvasError = (error: Error) => {
    logger.error("Canvas error", { error: error.message, stack: error.stack });
    console.error("Canvas error:", error);
    setHasError(true);
    setErrorMessage(error.message);
    toast.error(`Canvas error: ${error.message}`);
    
    captureError(error, "canvas-error", {
      tags: { component: "ConnectedDrawingCanvas" }
    });
  };
  
  // Mock functions for CanvasEventManager that would be implemented fully
  const saveCurrentState = () => {
    logger.info("Saving canvas state");
    // Implementation would save the current state for undo/redo
  };
  
  const undo = () => {
    logger.info("Undo action triggered");
    // Implementation would restore previous state
  };
  
  const redo = () => {
    logger.info("Redo action triggered");
    // Implementation would restore next state
  };
  
  const deleteSelectedObjects = () => {
    if (!fabricCanvasRef.current) {
      logger.warn("Cannot delete objects: Canvas not available");
      return;
    }
    
    logger.info("Delete selected objects triggered");
    
    try {
      const canvas = fabricCanvasRef.current;
      const activeObjects = canvas.getActiveObjects();
      
      if (activeObjects.length > 0) {
        logger.info("Deleting objects", { count: activeObjects.length });
        canvas.remove(...activeObjects);
        canvas.discardActiveObject();
        canvas.requestRenderAll();
        toast.info("Objects deleted");
        
        captureMessage("Objects deleted from canvas", {
          level: "info",
          tags: { component: "ConnectedDrawingCanvas", action: "deleteObjects" },
          extra: { count: activeObjects.length }
        });
      } else {
        logger.info("No objects selected for deletion");
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      logger.error("Failed to delete objects", { error: errorMsg });
      captureError(error as Error, "delete-objects-error");
      toast.error(`Failed to delete objects: ${errorMsg}`);
    }
  };
  
  // Handle emergency grid creation if needed
  useEffect(() => {
    if (canvasCreated && fabricCanvasRef.current) {
      // Check if grid exists, if not create one
      if (gridLayerRef.current.length === 0) {
        logger.warn("No grid found, creating emergency grid");
        forceGridCreation();
        
        captureMessage("Emergency grid created", {
          level: "warning",
          tags: { component: "ConnectedDrawingCanvas", action: "emergencyGrid" }
        });
      }
    }
  }, [canvasCreated, gridLayerRef, fabricCanvasRef, forceGridCreation]);
  
  return (
    <div className="w-full h-full" data-testid="connected-drawing-canvas">
      <EnhancedCanvas
        width={width}
        height={height}
        tool={tool}
        onCanvasReady={handleCanvasReady}
        onError={handleCanvasError}
      />
      
      {canvasCreated && fabricCanvasRef.current && (
        <CanvasEventManager
          canvas={fabricCanvasRef.current}
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
    </div>
  );
};
