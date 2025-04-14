import React, { useEffect, useRef } from "react";
import { Canvas as FabricCanvas, Object as FabricObject, PencilBrush } from "fabric";
import { DrawingMode } from "@/constants/drawingModes";
import { toast } from "sonner";
import { captureMessage, captureError } from "@/utils/sentry";
import logger from "@/utils/logger";
import { 
  useKeyboardEvents, 
  useObjectEvents, 
  useBrushSettings 
} from "@/hooks/canvas-events";
import { useStraightLineTool } from "@/hooks/straightLineTool/useStraightLineTool";
import { useWallDrawing } from "@/hooks/useWallDrawing";
import { validateStraightLineTool, scheduleStraightLineValidation } from "@/utils/diagnostics/straightLineValidator";
import { validateStraightLineDrawing } from "@/utils/diagnostics/drawingToolValidator";
import { GRID_CONSTANTS } from "@/constants/gridConstants";
import { GridRendererComponent } from "./grid/GridRenderer";

/**
 * Props for CanvasEventManager component
 */
interface CanvasEventManagerProps {
  canvas: FabricCanvas | null;
  tool: DrawingMode;
  lineThickness: number;
  lineColor: string;
  wallThickness?: number;
  wallColor?: string;
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
  wallThickness = 4,
  wallColor = "#333333",
  gridLayerRef,
  saveCurrentState,
  undo,
  redo,
  deleteSelectedObjects
}) => {
  // Ref for the canvas
  const canvasRef = useRef<FabricCanvas | null>(canvas);
  const initialStateRef = useRef(false);
  const previousToolRef = useRef<DrawingMode | null>(null);
  const toolInitializedRef = useRef<Record<string, boolean>>({});
  
  // Update canvas ref when canvas changes
  useEffect(() => {
    canvasRef.current = canvas;
    // Add global reference for debugging (will be removed in production)
    if (canvas && typeof window !== 'undefined') {
      (window as any).fabricCanvas = canvas;
    }
  }, [canvas]);
  
  // Initialize object events (history tracking)
  useObjectEvents({
    fabricCanvasRef: canvasRef,
    tool,
    saveCurrentState
  });
  
  // Initialize keyboard events
  useKeyboardEvents({
    fabricCanvasRef: canvasRef,
    tool,
    handleUndo: undo,
    handleRedo: redo,
    deleteSelectedObjects
  });
  
  // Initialize brush settings
  useBrushSettings({
    fabricCanvasRef: canvasRef,
    tool,
    lineColor,
    lineThickness
  });
  
  // Debug log whenever tool changes
  useEffect(() => {
    console.log(`Tool changed in CanvasEventManager: ${tool}`);
  }, [tool]);
  
  // Initialize straight line tool
  const { cancelDrawing: cancelStraightLine, isToolInitialized: isStraightLineToolInitialized } = useStraightLineTool({
    fabricCanvasRef: canvasRef,
    tool,
    lineColor,
    lineThickness,
    saveCurrentState
  });
  
  // Initialize wall drawing tool
  const { isDrawing: isDrawingWall } = useWallDrawing({
    fabricCanvasRef: canvasRef,
    tool,
    wallColor: wallColor,
    wallThickness: wallThickness
  });
  
  // Log changes to line tool state
  useEffect(() => {
    logger.info("Line tool state change", {
      isDrawingWall,
      isStraightLineToolInitialized,
      tool,
      canvas: !!canvas
    });
    
    // Track initialization status for this tool
    if (isStraightLineToolInitialized && tool === DrawingMode.STRAIGHT_LINE) {
      toolInitializedRef.current.STRAIGHT_LINE = true;
    }
    
    // Show status toast for straight line tool
    if (tool === DrawingMode.STRAIGHT_LINE) {
      if (isStraightLineToolInitialized) {
        toast.success("Line tool ready! Click and drag to draw a line.", {
          id: "line-tool-ready",
          duration: 2000
        });
      }
    }
  }, [isDrawingWall, isStraightLineToolInitialized, tool, canvas]);
  
  // Run validation tools on tool change
  useEffect(() => {
    if (!canvas) return;
    
    // Tool has changed - log the transition
    if (previousToolRef.current !== tool) {
      logger.info(`Tool transition: ${previousToolRef.current || 'none'} -> ${tool}`);
      captureMessage("Drawing tool changed", "tool-transition", {
        tags: { component: "CanvasEventManager" },
        extra: { 
          previousTool: previousToolRef.current,
          newTool: tool,
          lineThickness,
          lineColor
        }
      });
      previousToolRef.current = tool;
    }
    
    // Validate the straight line tool
    if (tool === DrawingMode.STRAIGHT_LINE) {
      logger.info("Running straight line tool diagnostics");
      
      // Delay validation to ensure tool has time to initialize
      const validationTimer = setTimeout(() => {
        validateStraightLineDrawing(canvas, tool);
        validateStraightLineTool(canvas, tool);
      }, 200);
      
      // Schedule periodic validation
      const cleanupValidation = scheduleStraightLineValidation(canvas, tool);
      
      return () => {
        clearTimeout(validationTimer);
        cleanupValidation();
      };
    }
  }, [canvas, tool, lineThickness, lineColor]);
  
  // Effect to handle tool changes (cursor, selection, etc.)
  useEffect(() => {
    if (!canvas) {
      logger.warn("Canvas not available for tool change");
      return;
    }
    
    logger.info("Applying tool settings to canvas", { 
      tool, 
      lineThickness, 
      lineColor,
      wallThickness,
      wallColor
    });
    
    try {
      // Disable drawing mode by default
      canvas.isDrawingMode = false;
      
      // Apply tool-specific settings
      switch (tool) {
        case DrawingMode.SELECT:
          canvas.selection = true;
          canvas.defaultCursor = 'default';
          canvas.hoverCursor = 'move';
          // Make all objects selectable except grid
          canvas.getObjects().forEach(obj => {
            if ((obj as any).objectType !== 'grid') {
              obj.selectable = true;
              obj.evented = true;
            }
          });
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
            // Initialize the freeDrawingBrush if it doesn't exist
            canvas.freeDrawingBrush = new PencilBrush(canvas);
            canvas.freeDrawingBrush.width = lineThickness;
            canvas.freeDrawingBrush.color = lineColor;
            logger.info("Created new drawing brush", {
              brushWidth: lineThickness,
              brushColor: lineColor
            });
          }
          canvas.defaultCursor = 'crosshair';
          break;
          
        case DrawingMode.HAND:
          canvas.defaultCursor = 'grab';
          canvas.hoverCursor = 'grab';
          canvas.selection = false;
          // Make objects non-selectable
          canvas.getObjects().forEach(obj => {
            obj.selectable = false;
            obj.evented = false;
          });
          logger.info("Hand tool activated");
          break;
          
        case DrawingMode.WALL:
          canvas.defaultCursor = 'crosshair';
          canvas.hoverCursor = 'crosshair';
          canvas.selection = false;
          
          // Make objects non-selectable when in wall mode
          canvas.getObjects().forEach(obj => {
            obj.selectable = false;
            if ((obj as any).objectType !== 'grid') {
              obj.evented = true;
            }
          });
          
          // Discard any active object
          canvas.discardActiveObject();
          
          logger.info("Wall tool activated", {
            wallColor,
            wallThickness
          });
          break;
          
        case DrawingMode.STRAIGHT_LINE:
          canvas.defaultCursor = 'crosshair';
          canvas.hoverCursor = 'crosshair';
          canvas.selection = false;
          
          // Make objects non-selectable when in straight line mode
          canvas.getObjects().forEach(obj => {
            obj.selectable = false;
            if ((obj as any).objectType !== 'grid') {
              obj.evented = true;
            }
          });
          
          // Discard any active object to ensure nothing is selected
          canvas.discardActiveObject();
          
          logger.info("Straight line tool activated in CanvasEventManager", { 
            isToolInitialized: isStraightLineToolInitialized,
            canvasState: {
              isDrawingMode: canvas.isDrawingMode,
              selection: canvas.selection,
              defaultCursor: canvas.defaultCursor
            },
            lineSettings: {
              color: lineColor,
              thickness: lineThickness
            }
          });
          break;
          
        case DrawingMode.ERASER:
          canvas.defaultCursor = 'cell';
          canvas.hoverCursor = 'cell';
          canvas.selection = true;
          logger.info("Eraser tool activated");
          break;
          
        default:
          canvas.selection = true;
          logger.info("Default tool settings applied", { toolUsed: tool });
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
        tags: { toolName: tool },
        extra: { lineThickness, lineColor }
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      logger.error("Failed to apply tool settings", { 
        error: errorMsg, 
        tool, 
        lineThickness, 
        lineColor 
      });
      captureError(error as Error, "apply-tool-settings-error");
      toast.error(`Failed to apply tool settings: ${errorMsg}`);
    }
  }, [tool, lineThickness, lineColor, wallThickness, wallColor, canvas, gridLayerRef, isStraightLineToolInitialized]);
  
  // Effect to handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cancel line drawing on escape
      if (e.key === 'Escape' && tool === DrawingMode.STRAIGHT_LINE) {
        cancelStraightLine();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [tool, cancelStraightLine]);
  
  // Effect to save initial state - using a ref to ensure it only runs once
  useEffect(() => {
    if (!canvas || initialStateRef.current) return;
    
    // Create grid if not already created
    if (gridLayerRef.current.length === 0) {
      // Handled by GridRenderer component
      logger.info("Initial grid creation handled by GridRenderer");
    }
    
    // Save initial state once when canvas is first available
    const timer = setTimeout(() => {
      saveCurrentState();
      initialStateRef.current = true;
    }, 500);
    
    return () => clearTimeout(timer);
  }, [canvas, saveCurrentState, gridLayerRef]);
  
  return (
    <>
      {canvas && gridLayerRef.current.length === 0 && (
        <GridRendererComponent 
          canvas={canvas}
          onGridCreated={(gridObjects) => {
            gridLayerRef.current = gridObjects;
          }}
          showGrid={true}
        />
      )}
    </>
  );
};
