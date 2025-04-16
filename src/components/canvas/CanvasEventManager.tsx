
import { useEffect, useRef } from "react";
import { Canvas as FabricCanvas, Object as FabricObject, PencilBrush } from "fabric";
import { DrawingMode } from "@/constants/drawingModes";
import { useStraightLineTool } from "@/hooks/straightLineTool/useStraightLineTool";
import { useCanvasKeyboardShortcuts } from "@/hooks/canvas/useCanvasKeyboardShortcuts";
import { useApplePencilSupport } from "@/hooks/canvas/useApplePencilSupport";
import { requestOptimizedRender, createSmoothEventHandler, createCompletionHandler } from "@/utils/canvas/renderOptimizer";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Props for the CanvasEventManager
 */
interface CanvasEventManagerProps {
  canvas: FabricCanvas;
  tool: DrawingMode;
  lineThickness: number;
  lineColor: string;
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
  saveCurrentState: () => void;
  undo: () => void;
  redo: () => void;
  deleteSelectedObjects: () => void;
  onDrawingComplete?: () => void; // Callback for drawing completion
  enableSync?: boolean; // Enable real-time sync
}

/**
 * Manages canvas events and interactions
 */
export const CanvasEventManager = ({
  canvas,
  tool,
  lineThickness,
  lineColor,
  gridLayerRef,
  saveCurrentState,
  undo,
  redo,
  deleteSelectedObjects,
  onDrawingComplete,
  enableSync = true
}: CanvasEventManagerProps) => {
  // Track last active tool
  const lastToolRef = useRef<DrawingMode>(tool);
  
  // Track if we need to save state
  const needsSaveRef = useRef(false);
  
  // Use Apple Pencil support
  const { 
    isApplePencil,
    adjustedLineThickness,
    processPencilTouchEvent
  } = useApplePencilSupport({
    canvas,
    lineThickness
  });
  
  // Get user information for per-user history tracking
  const { user } = useAuth();
  const userId = user?.id || 'anonymous';
  
  // Create a debounced state save function
  const debouncedSaveState = useRef(
    createCompletionHandler(() => {
      console.log("Saving canvas state after drawing completion");
      saveCurrentState();
      if (onDrawingComplete) {
        onDrawingComplete();
      }
    }, 300)
  ).current;
  
  // Initialize straight line tool
  const straightLineTool = useStraightLineTool({
    canvas,
    enabled: tool === DrawingMode.STRAIGHT_LINE,
    lineColor,
    // Use pressure-adjusted thickness for Apple Pencil
    lineThickness: isApplePencil ? adjustedLineThickness : lineThickness,
    saveCurrentState: debouncedSaveState
  });
  
  // Log when straight line tool is active
  useEffect(() => {
    if (tool === DrawingMode.STRAIGHT_LINE) {
      console.log("Straight line tool is active", straightLineTool);
    }
  }, [tool, straightLineTool]);
  
  // Initialize keyboard shortcuts
  useCanvasKeyboardShortcuts({
    canvas,
    undo,
    redo,
    deleteSelected: deleteSelectedObjects
  });
  
  // Set up event listeners
  useEffect(() => {
    if (!canvas) return;
    
    console.log("Setting up canvas event listeners for tool:", tool);
    
    // Clear drawing mode when tool changes
    if (lastToolRef.current !== tool) {
      // If switching from drawing tool, save state
      if (
        lastToolRef.current === DrawingMode.DRAW ||
        lastToolRef.current === DrawingMode.STRAIGHT_LINE
      ) {
        debouncedSaveState();
      }
      
      lastToolRef.current = tool;
    }
    
    // Disable freeDrawingMode for all modes except DRAW
    canvas.isDrawingMode = tool === DrawingMode.DRAW;
    
    // Configure free drawing brush
    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = lineColor;
      // Use pressure-adjusted thickness for Apple Pencil
      canvas.freeDrawingBrush.width = isApplePencil ? adjustedLineThickness : lineThickness;
      
      // Improve brush smoothness
      if (canvas.freeDrawingBrush instanceof PencilBrush) {
        // Using type assertion to set the decimate property
        (canvas.freeDrawingBrush as any).decimate = 2;
      }
    }
    
    // Update cursor based on tool
    if (tool === DrawingMode.STRAIGHT_LINE) {
      canvas.defaultCursor = 'crosshair';
      canvas.hoverCursor = 'crosshair';
      canvas.selection = false;
    } else if (tool === DrawingMode.DRAW) {
      canvas.defaultCursor = 'crosshair';
      canvas.hoverCursor = 'crosshair';
    } else if (tool === DrawingMode.SELECT) {
      canvas.defaultCursor = 'default';
      canvas.hoverCursor = 'move';
      canvas.selection = true;
    }
    
    // Force render to apply changes
    canvas.renderAll();
    
    // Optimized event handlers
    const handlePathCreated = () => {
      requestOptimizedRender(canvas, 'pathCreated');
      debouncedSaveState();
    };
    
    const handleObjectModified = createSmoothEventHandler(() => {
      requestOptimizedRender(canvas, 'objectModified');
      needsSaveRef.current = true;
    }, 100);
    
    const handleObjectAdded = (e: any) => {
      // Don't save state for drawing tools as they already save when path is created
      if (tool !== DrawingMode.DRAW && tool !== DrawingMode.STRAIGHT_LINE) {
        requestOptimizedRender(canvas, 'objectAdded');
        needsSaveRef.current = true;
      }
    };
    
    const handleObjectRemoved = () => {
      requestOptimizedRender(canvas, 'objectRemoved');
      needsSaveRef.current = true;
    };
    
    const handleMouseUp = createCompletionHandler(() => {
      // If we need to save, invoke the callback
      if (needsSaveRef.current) {
        debouncedSaveState();
        needsSaveRef.current = false;
      }
    }, 250);
    
    // Register event listeners
    canvas.on('path:created', handlePathCreated);
    canvas.on('object:modified', handleObjectModified);
    canvas.on('object:added', handleObjectAdded);
    canvas.on('object:removed', handleObjectRemoved);
    canvas.on('mouse:up', handleMouseUp);
    canvas.on('selection:cleared', handleMouseUp);
    
    return () => {
      // Remove event listeners
      canvas.off('path:created', handlePathCreated);
      canvas.off('object:modified', handleObjectModified);
      canvas.off('object:added', handleObjectAdded);
      canvas.off('object:removed', handleObjectRemoved);
      canvas.off('mouse:up', handleMouseUp);
      canvas.off('selection:cleared', handleMouseUp);
    };
  }, [canvas, tool, lineColor, lineThickness, debouncedSaveState, isApplePencil, adjustedLineThickness]);
  
  // Empty render as this is just an event manager
  return null;
};
