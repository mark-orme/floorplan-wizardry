
import React, { useEffect, useState, useRef } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { CanvasControllerEnhanced } from "./controller/CanvasControllerEnhanced";
import { ConnectedDrawingCanvas } from "./ConnectedDrawingCanvas";
import { resetInitializationState } from "@/utils/canvas/safeCanvasInitialization";
import { resetGridProgress } from "@/utils/gridManager";
import { DrawingToolbar } from "@/components/DrawingToolbar";
import { DrawingMode } from "@/constants/drawingModes";
import { useDrawingContext } from "@/contexts/DrawingContext";
import { toast } from "sonner";
import { captureMessage, captureError } from "@/utils/sentry";
import logger from "@/utils/logger";
import { DrawingProvider } from "@/contexts/DrawingContext";

interface CanvasAppProps {
  setCanvas?: (canvas: FabricCanvas | null) => void;
}

// Inner component that uses DrawingContext
const CanvasAppInner: React.FC<CanvasAppProps> = ({ setCanvas }) => {
  // State for GIA (Gross Internal Area)
  const [gia, setGia] = useState<number>(0);
  const { 
    tool, 
    setTool, 
    lineColor, 
    lineThickness, 
    setLineColor, 
    setLineThickness,
    canUndo,
    canRedo,
    setCanUndo,
    setCanRedo
  } = useDrawingContext();
  
  // Reference to the drawing canvas component
  const canvasComponentRef = useRef<any>(null);
  
  // Reset initialization state when component mounts
  useEffect(() => {
    resetInitializationState();
    resetGridProgress();
    
    logger.info("CanvasApp mounted", { initialTool: tool });
    captureMessage("CanvasApp initialized", "canvas-app-init", {
      tags: { component: "CanvasApp" },
      extra: { initialTool: tool }
    });
    
    return () => {
      // Clean up when component unmounts
      if (setCanvas) {
        setCanvas(null);
      }
      logger.info("CanvasApp unmounted");
    };
  }, [setCanvas, tool]);
  
  // Toolbar action handlers
  const handleToolChange = (newTool: DrawingMode) => {
    logger.info("Tool change requested", { 
      previousTool: tool, 
      newTool: newTool 
    });
    
    try {
      setTool(newTool);
      toast.success(`Changed to ${newTool} tool`);
      
      captureMessage("Drawing tool changed", "tool-change", {
        tags: { component: "CanvasApp", action: "toolChange" },
        extra: { previousTool: tool, newTool: newTool }
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      logger.error("Failed to change drawing tool", { 
        error: errorMsg, 
        previousTool: tool, 
        newTool: newTool 
      });
      
      captureError(error as Error, "tool-change-error", {
        tags: { component: "CanvasApp", action: "toolChange" },
        extra: { previousTool: tool, newTool: newTool }
      });
      
      toast.error(`Failed to change tool: ${errorMsg}`);
    }
  };
  
  const handleUndo = () => {
    logger.info("Undo action requested", { canUndo });
    
    if (!canUndo) {
      logger.warn("Undo requested but canUndo is false");
      toast.info("Nothing to undo");
      return;
    }
    
    try {
      if (canvasComponentRef.current && canvasComponentRef.current.undo) {
        canvasComponentRef.current.undo();
        captureMessage("Undo action triggered", "undo-action", {
          tags: { component: "CanvasApp", action: "undo" }
        });
      } else {
        logger.warn("Undo function not available on canvas component");
        toast.error("Undo functionality not available");
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      logger.error("Failed to perform undo", { error: errorMsg });
      captureError(error as Error, "undo-action-error");
      toast.error(`Failed to undo: ${errorMsg}`);
    }
  };
  
  const handleRedo = () => {
    logger.info("Redo action requested", { canRedo });
    
    if (!canRedo) {
      logger.warn("Redo requested but canRedo is false");
      toast.info("Nothing to redo");
      return;
    }
    
    try {
      if (canvasComponentRef.current && canvasComponentRef.current.redo) {
        canvasComponentRef.current.redo();
        captureMessage("Redo action triggered", "redo-action", {
          tags: { component: "CanvasApp", action: "redo" }
        });
      } else {
        logger.warn("Redo function not available on canvas component");
        toast.error("Redo functionality not available");
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      logger.error("Failed to perform redo", { error: errorMsg });
      captureError(error as Error, "redo-action-error");
      toast.error(`Failed to redo: ${errorMsg}`);
    }
  };
  
  const handleZoom = (direction: "in" | "out") => {
    logger.info("Zoom action requested", { direction });
    
    try {
      if (canvasComponentRef.current && canvasComponentRef.current.zoom) {
        canvasComponentRef.current.zoom(direction);
        captureMessage("Zoom action triggered", "zoom-action", {
          tags: { component: "CanvasApp", action: "zoom" },
          extra: { direction }
        });
      } else {
        logger.warn("Zoom function not available on canvas component");
        toast.info(`Zoom ${direction} (not implemented yet)`);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      logger.error("Failed to perform zoom", { error: errorMsg, direction });
      captureError(error as Error, "zoom-action-error", {
        extra: { direction }
      });
      toast.error(`Failed to zoom ${direction}: ${errorMsg}`);
    }
  };
  
  const handleClear = () => {
    logger.info("Clear canvas requested");
    
    try {
      if (canvasComponentRef.current && canvasComponentRef.current.clearCanvas) {
        canvasComponentRef.current.clearCanvas();
        captureMessage("Clear canvas action triggered", "clear-canvas", {
          tags: { component: "CanvasApp", action: "clear" }
        });
      } else {
        logger.warn("Clear function not available on canvas component");
        toast.info("Clear canvas (not implemented yet)");
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      logger.error("Failed to clear canvas", { error: errorMsg });
      captureError(error as Error, "clear-canvas-error");
      toast.error(`Failed to clear canvas: ${errorMsg}`);
    }
  };
  
  const handleSave = () => {
    logger.info("Save canvas requested");
    
    try {
      if (canvasComponentRef.current && canvasComponentRef.current.saveCanvas) {
        canvasComponentRef.current.saveCanvas();
        captureMessage("Save canvas action triggered", "save-canvas", {
          tags: { component: "CanvasApp", action: "save" }
        });
      } else {
        // Fallback to basic JSON serialization
        if (canvasComponentRef.current && canvasComponentRef.current.getCanvas) {
          const canvas = canvasComponentRef.current.getCanvas();
          if (canvas) {
            const json = canvas.toJSON();
            const blob = new Blob([JSON.stringify(json)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'canvas-drawing.json';
            a.click();
            URL.revokeObjectURL(url);
            toast.success("Canvas saved to file");
          }
        } else {
          logger.warn("Save function not available on canvas component");
          toast.info("Save canvas (not implemented yet)");
        }
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      logger.error("Failed to save canvas", { error: errorMsg });
      captureError(error as Error, "save-canvas-error");
      toast.error(`Failed to save canvas: ${errorMsg}`);
    }
  };
  
  const handleDelete = () => {
    logger.info("Delete selected objects requested");
    
    try {
      if (canvasComponentRef.current && canvasComponentRef.current.deleteSelectedObjects) {
        canvasComponentRef.current.deleteSelectedObjects();
        captureMessage("Delete objects action triggered", "delete-objects", {
          tags: { component: "CanvasApp", action: "delete" }
        });
      } else {
        logger.warn("Delete function not available on canvas component");
        toast.info("Delete selected objects (not implemented yet)");
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      logger.error("Failed to delete objects", { error: errorMsg });
      captureError(error as Error, "delete-objects-error");
      toast.error(`Failed to delete objects: ${errorMsg}`);
    }
  };
  
  const handleLineThicknessChange = (thickness: number) => {
    logger.info("Line thickness change requested", { 
      previousThickness: lineThickness, 
      newThickness: thickness 
    });
    
    try {
      setLineThickness(thickness);
      toast.info(`Line thickness set to ${thickness}`);
      captureMessage("Line thickness changed", "thickness-change", {
        tags: { component: "CanvasApp", action: "thicknessChange" },
        extra: { previousThickness: lineThickness, newThickness: thickness }
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      logger.error("Failed to change line thickness", { 
        error: errorMsg, 
        previousThickness: lineThickness, 
        newThickness: thickness 
      });
      captureError(error as Error, "thickness-change-error", {
        extra: { previousThickness: lineThickness, newThickness: thickness }
      });
      toast.error(`Failed to set line thickness: ${errorMsg}`);
    }
  };
  
  const handleLineColorChange = (color: string) => {
    logger.info("Line color change requested", { 
      previousColor: lineColor, 
      newColor: color 
    });
    
    try {
      setLineColor(color);
      toast.info(`Line color set to ${color}`);
      captureMessage("Line color changed", "color-change", {
        tags: { component: "CanvasApp", action: "colorChange" },
        extra: { previousColor: lineColor, newColor: color }
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      logger.error("Failed to change line color", { 
        error: errorMsg, 
        previousColor: lineColor, 
        newColor: color 
      });
      captureError(error as Error, "color-change-error", {
        extra: { previousColor: lineColor, newColor: color }
      });
      toast.error(`Failed to set line color: ${errorMsg}`);
    }
  };
  
  // Expose canvas operations to parent component
  const setCanvasRef = (ref: any) => {
    canvasComponentRef.current = ref;
    
    // Update undo/redo state based on canvas state
    if (ref && ref.canUndo !== undefined) {
      setCanUndo(ref.canUndo);
    }
    if (ref && ref.canRedo !== undefined) {
      setCanRedo(ref.canRedo);
    }
  };
  
  return (
    <CanvasControllerEnhanced>
      <div className="w-full h-full flex flex-col">
        <div className="p-2 border-b">
          <DrawingToolbar
            tool={tool}
            onToolChange={handleToolChange}
            onUndo={handleUndo}
            onRedo={handleRedo}
            onZoom={handleZoom}
            onClear={handleClear}
            onSave={handleSave}
            onDelete={handleDelete}
            gia={gia}
            lineThickness={lineThickness}
            lineColor={lineColor}
            onLineThicknessChange={handleLineThicknessChange}
            onLineColorChange={handleLineColorChange}
          />
        </div>
        <div className="flex-1 overflow-hidden">
          <ConnectedDrawingCanvas 
            width={window.innerWidth - 48}
            height={window.innerHeight - 180} // Adjusted for toolbar height
            onCanvasRef={setCanvasRef}
          />
        </div>
      </div>
    </CanvasControllerEnhanced>
  );
};

// Wrapper component that provides DrawingContext
export const CanvasApp: React.FC<CanvasAppProps> = (props) => {
  return (
    <DrawingProvider>
      <CanvasAppInner {...props} />
    </DrawingProvider>
  );
};
