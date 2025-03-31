
import React, { useEffect } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { DrawingMode } from "@/constants/drawingModes";
import { toast } from "sonner";
import { captureMessage, captureError } from "@/utils/sentry";
import logger from "@/utils/logger";

/**
 * Props for CanvasEventManager component
 */
interface CanvasEventManagerProps {
  canvas: FabricCanvas | null;
  tool: DrawingMode;
  lineThickness: number;
  lineColor: string;
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
  saveCurrentState: () => void;
  undo: () => void;
  redo: () => void;
  deleteSelectedObjects: () => void;
}

/**
 * Canvas event manager component
 * Manages canvas events and tool-specific settings
 */
export const CanvasEventManager: React.FC<CanvasEventManagerProps> = ({
  canvas,
  tool,
  lineThickness,
  lineColor,
  gridLayerRef,
  saveCurrentState,
  undo,
  redo,
  deleteSelectedObjects
}) => {
  // Effect to set up canvas event listeners
  useEffect(() => {
    if (!canvas) {
      logger.warn("Canvas not available for event setup");
      return;
    }
    
    logger.info("Setting up canvas event listeners", { tool });
    captureMessage("Canvas event listeners initialized", "event-listeners-init", {
      tags: { component: "CanvasEventManager" },
      extra: { tool, lineThickness, lineColor }
    });
    
    // Save initial state
    saveCurrentState();
    
    // Set up history tracking
    const handleObjectModified = () => {
      saveCurrentState();
      logger.info("Object modified, saving state");
      captureMessage("Canvas object modified", "object-modified", {
        tags: { component: "CanvasEventManager", event: "objectModified" }
      });
    };
    
    const handleObjectAdded = () => {
      saveCurrentState();
      logger.info("Object added, saving state");
      captureMessage("Canvas object added", "object-added", {
        tags: { component: "CanvasEventManager", event: "objectAdded" }
      });
    };
    
    // Add event listeners
    canvas.on('object:modified', handleObjectModified);
    canvas.on('object:added', handleObjectAdded);
    
    // Handle keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Undo: Ctrl+Z
      if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        logger.info("Keyboard shortcut: Undo (Ctrl+Z)");
        undo();
      }
      
      // Redo: Ctrl+Shift+Z or Ctrl+Y
      if ((e.ctrlKey && e.shiftKey && e.key === 'z') || (e.ctrlKey && e.key === 'y')) {
        e.preventDefault();
        logger.info("Keyboard shortcut: Redo (Ctrl+Shift+Z or Ctrl+Y)");
        redo();
      }
      
      // Delete: Delete key when in select mode
      if (e.key === 'Delete' && tool === DrawingMode.SELECT) {
        e.preventDefault();
        logger.info("Keyboard shortcut: Delete selected objects");
        deleteSelectedObjects();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      if (canvas) {
        canvas.off('object:modified', handleObjectModified);
        canvas.off('object:added', handleObjectAdded);
      }
      window.removeEventListener('keydown', handleKeyDown);
      logger.info("Canvas event listeners removed");
    };
  }, [canvas, tool, saveCurrentState, undo, redo, deleteSelectedObjects]);
  
  // Effect to handle tool changes
  useEffect(() => {
    if (!canvas) {
      logger.warn("Canvas not available for tool change");
      return;
    }
    
    // Reset canvas modes
    canvas.isDrawingMode = false;
    canvas.selection = false;
    
    logger.info("Applying tool settings to canvas", { tool, lineThickness, lineColor });
    
    try {
      // Apply tool-specific settings
      switch (tool) {
        case DrawingMode.SELECT:
          canvas.selection = true;
          canvas.defaultCursor = 'default';
          canvas.hoverCursor = 'move';
          logger.info("Select tool activated", { selection: true });
          break;
          
        case DrawingMode.DRAW:
          canvas.isDrawingMode = true;
          if (canvas.freeDrawingBrush) {
            canvas.freeDrawingBrush.width = lineThickness;
            canvas.freeDrawingBrush.color = lineColor;
            logger.info("Draw tool activated", { 
              isDrawingMode: true, 
              brushWidth: lineThickness, 
              brushColor: lineColor 
            });
          } else {
            logger.error("Drawing brush not available");
          }
          canvas.defaultCursor = 'crosshair';
          break;
          
        case DrawingMode.HAND:
          canvas.defaultCursor = 'grab';
          canvas.hoverCursor = 'grab';
          canvas.selection = false;
          logger.info("Hand tool activated");
          break;
          
        case DrawingMode.STRAIGHT_LINE:
          canvas.defaultCursor = 'crosshair';
          canvas.hoverCursor = 'crosshair';
          canvas.selection = false;
          logger.info("Straight line tool activated");
          break;
          
        case DrawingMode.ERASER:
          canvas.defaultCursor = 'cell';
          canvas.hoverCursor = 'cell';
          canvas.selection = true;
          logger.info("Eraser tool activated");
          break;
          
        default:
          canvas.selection = true;
          logger.info("Default tool settings applied");
          break;
      }
      
      // Ensure grid stays at the bottom
      if (gridLayerRef.current.length > 0) {
        gridLayerRef.current.forEach(obj => {
          if (canvas.contains(obj)) {
            canvas.sendObjectToBack(obj);
          }
        });
        logger.info("Grid moved to back", { gridObjectCount: gridLayerRef.current.length });
      } else {
        logger.warn("No grid objects found");
      }
      
      canvas.renderAll();
      
      captureMessage("Tool applied to canvas", "tool-applied", {
        tags: { component: "CanvasEventManager", action: "toolChange" },
        extra: { tool, lineThickness, lineColor }
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      logger.error("Failed to apply tool settings", { 
        error: errorMsg, 
        tool, 
        lineThickness, 
        lineColor 
      });
      captureError(error as Error, "apply-tool-settings-error", {
        tags: { component: "CanvasEventManager" },
        extra: { tool, lineThickness, lineColor }
      });
      toast.error(`Failed to apply tool settings: ${errorMsg}`);
    }
  }, [tool, lineThickness, lineColor, canvas, gridLayerRef]);
  
  return null; // This component doesn't render anything
};
