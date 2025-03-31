
import React, { useEffect, useState, useCallback } from "react";
import { useCanvasController } from "./controller/CanvasControllerEnhanced";
import { EnhancedCanvas } from "./EnhancedCanvas";
import { Canvas as FabricCanvas, Line, Point } from "fabric";
import { CanvasEventManager } from "./CanvasEventManager";
import { toast } from "sonner";
import { useDrawingContext } from "@/contexts/DrawingContext";
import { captureMessage, captureError } from "@/utils/sentry";
import logger from "@/utils/logger";
import { useCanvasEventHandlers } from "@/hooks/useCanvasEventHandlers";
import { useSnapToGrid } from "@/hooks/useSnapToGrid";

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
  const [currentState, setCurrentState] = useState<any[]>([]);
  const [historyStates, setHistoryStates] = useState<any[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  // Initialize grid snapping
  const { snapPointToGrid, snapLineToGrid } = useSnapToGrid();
  
  // Drawing state variables
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [currentLine, setCurrentLine] = useState<Line | null>(null);
  
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
      
      captureMessage("Canvas initialized successfully", "canvas-init", {
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
      
      captureMessage("Tool applied to canvas", "tool-applied", {
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
  
  // Save current canvas state for undo/redo
  const saveCurrentState = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    
    logger.info("Saving canvas state");
    
    try {
      const canvas = fabricCanvasRef.current;
      const json = canvas.toJSON(['objectType']);
      
      // Add new state and trim any redo states
      setHistoryStates(prev => {
        const newStates = [...prev.slice(0, historyIndex + 1), json];
        return newStates;
      });
      
      setHistoryIndex(prev => prev + 1);
      
      // Update current state for reference
      setCurrentState(json);
      
      logger.info("Canvas state saved", { historyIndex: historyIndex + 1 });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      logger.error("Failed to save canvas state", { error: errorMsg });
    }
  }, [fabricCanvasRef, historyIndex]);
  
  // Undo last action
  const undo = useCallback(() => {
    if (!fabricCanvasRef.current || historyIndex <= 0) {
      logger.warn("Cannot undo: No history available");
      return;
    }
    
    logger.info("Undoing last action");
    
    try {
      const canvas = fabricCanvasRef.current;
      const newIndex = historyIndex - 1;
      const state = historyStates[newIndex];
      
      // Clear canvas and load previous state
      canvas.clear();
      canvas.loadFromJSON(state, () => {
        // Restore grid if needed
        if (gridLayerRef.current.length === 0) {
          forceGridCreation();
        } else {
          // Ensure grid stays at bottom
          gridLayerRef.current.forEach(obj => {
            if (canvas.contains(obj)) {
              canvas.sendObjectToBack(obj);
            }
          });
        }
        
        canvas.renderAll();
      });
      
      setHistoryIndex(newIndex);
      logger.info("Undo completed", { newHistoryIndex: newIndex });
      toast.info("Undo successful");
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      logger.error("Failed to undo", { error: errorMsg });
      toast.error(`Failed to undo: ${errorMsg}`);
    }
  }, [fabricCanvasRef, historyIndex, historyStates, gridLayerRef, forceGridCreation]);
  
  // Redo last undone action
  const redo = useCallback(() => {
    if (!fabricCanvasRef.current || historyIndex >= historyStates.length - 1) {
      logger.warn("Cannot redo: No future states available");
      return;
    }
    
    logger.info("Redoing action");
    
    try {
      const canvas = fabricCanvasRef.current;
      const newIndex = historyIndex + 1;
      const state = historyStates[newIndex];
      
      // Clear canvas and load next state
      canvas.clear();
      canvas.loadFromJSON(state, () => {
        // Restore grid if needed
        if (gridLayerRef.current.length === 0) {
          forceGridCreation();
        } else {
          // Ensure grid stays at bottom
          gridLayerRef.current.forEach(obj => {
            if (canvas.contains(obj)) {
              canvas.sendObjectToBack(obj);
            }
          });
        }
        
        canvas.renderAll();
      });
      
      setHistoryIndex(newIndex);
      logger.info("Redo completed", { newHistoryIndex: newIndex });
      toast.info("Redo successful");
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      logger.error("Failed to redo", { error: errorMsg });
      toast.error(`Failed to redo: ${errorMsg}`);
    }
  }, [fabricCanvasRef, historyIndex, historyStates, gridLayerRef, forceGridCreation]);
  
  // Delete selected objects
  const deleteSelectedObjects = useCallback(() => {
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
        // Save state before deleting
        saveCurrentState();
        
        canvas.remove(...activeObjects);
        canvas.discardActiveObject();
        canvas.requestRenderAll();
        toast.info("Objects deleted");
        
        captureMessage("Objects deleted from canvas", "objects-deleted", {
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
  }, [fabricCanvasRef, saveCurrentState]);
  
  // Handle straight line tool mouse down
  const handleMouseDown = useCallback((e: any) => {
    if (!fabricCanvasRef.current || tool !== 'straight-line') return;
    
    const canvas = fabricCanvasRef.current;
    const pointer = canvas.getPointer(e);
    
    // Snap to grid
    const snappedPoint = snapPointToGrid({x: pointer.x, y: pointer.y});
    
    // Start drawing
    setIsDrawing(true);
    setStartPoint(new Point(snappedPoint.x, snappedPoint.y));
    
    // Create new line
    const line = new Line([snappedPoint.x, snappedPoint.y, snappedPoint.x, snappedPoint.y], {
      stroke: lineColor,
      strokeWidth: lineThickness,
      selectable: false,
      evented: false,
      objectType: 'straight-line'
    });
    
    canvas.add(line);
    setCurrentLine(line);
    
    logger.info("Started drawing straight line", { 
      start: {x: snappedPoint.x, y: snappedPoint.y}
    });
  }, [fabricCanvasRef, tool, lineColor, lineThickness, snapPointToGrid]);
  
  // Handle straight line tool mouse move
  const handleMouseMove = useCallback((e: any) => {
    if (!fabricCanvasRef.current || !isDrawing || !startPoint || !currentLine || tool !== 'straight-line') return;
    
    const canvas = fabricCanvasRef.current;
    const pointer = canvas.getPointer(e);
    
    // Snap to grid
    const snappedPoint = snapPointToGrid({x: pointer.x, y: pointer.y});
    
    // Snap the line (potentially applying angle constraints)
    const { start, end } = snapLineToGrid(
      {x: startPoint.x, y: startPoint.y},
      {x: snappedPoint.x, y: snappedPoint.y}
    );
    
    // Update line
    currentLine.set({
      x2: end.x,
      y2: end.y
    });
    
    canvas.renderAll();
    
  }, [fabricCanvasRef, isDrawing, startPoint, currentLine, tool, snapPointToGrid, snapLineToGrid]);
  
  // Handle straight line tool mouse up
  const handleMouseUp = useCallback(() => {
    if (!fabricCanvasRef.current || !isDrawing || !startPoint || !currentLine || tool !== 'straight-line') return;
    
    const canvas = fabricCanvasRef.current;
    
    // Finalize the line
    currentLine.set({
      selectable: true,
      evented: true
    });
    
    // Check if line has a meaningful length
    const dx = currentLine.x2 - currentLine.x1;
    const dy = currentLine.y2 - currentLine.y1;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > 5) {
      // Save state with the new line
      saveCurrentState();
      
      logger.info("Completed drawing straight line", {
        start: {x: currentLine.x1, y: currentLine.y1},
        end: {x: currentLine.x2, y: currentLine.y2},
        length: distance
      });
    } else {
      // Line too short, remove it
      canvas.remove(currentLine);
      logger.info("Cancelled straight line - too short");
    }
    
    // Reset drawing state
    setIsDrawing(false);
    setStartPoint(null);
    setCurrentLine(null);
    
    canvas.renderAll();
    
  }, [fabricCanvasRef, isDrawing, startPoint, currentLine, tool, saveCurrentState]);
  
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
  }, [tool, lineThickness, lineColor, canvasCreated, fabricCanvasRef, applyToolToCanvas]);
  
  // Set up canvas event listeners for straight line tool
  useEffect(() => {
    if (!canvasCreated || !fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    
    if (tool === 'straight-line') {
      canvas.on('mouse:down', handleMouseDown);
      canvas.on('mouse:move', handleMouseMove);
      canvas.on('mouse:up', handleMouseUp);
      
      logger.info("Set up straight line event listeners");
    }
    
    return () => {
      if (canvas) {
        canvas.off('mouse:down', handleMouseDown);
        canvas.off('mouse:move', handleMouseMove);
        canvas.off('mouse:up', handleMouseUp);
      }
    };
  }, [
    canvasCreated, 
    fabricCanvasRef,
    tool, 
    handleMouseDown, 
    handleMouseMove, 
    handleMouseUp
  ]);
  
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
  
  // Handle emergency grid creation if needed
  useEffect(() => {
    if (canvasCreated && fabricCanvasRef.current) {
      // Check if grid exists, if not create one
      if (gridLayerRef.current.length === 0) {
        logger.warn("No grid found, creating emergency grid");
        forceGridCreation();
        
        captureMessage("Emergency grid created", "emergency-grid", {
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
