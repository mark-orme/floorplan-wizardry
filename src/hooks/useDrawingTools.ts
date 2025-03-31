
/**
 * Hook for managing drawing tools and operations
 * @module hooks/useDrawingTools
 */
import { useCallback, useEffect } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { DrawingMode } from "@/constants/drawingModes";
import { toast } from "sonner";
import logger from "@/utils/logger";

interface UseDrawingToolsProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
  tool: DrawingMode;
  setTool: React.Dispatch<React.SetStateAction<DrawingMode>>;
  zoomLevel: number;
  setZoomLevel: React.Dispatch<React.SetStateAction<number>>;
  lineThickness: number;
  lineColor: string;
  historyRef: React.MutableRefObject<{
    past: FabricObject[][];
    future: FabricObject[][];
  }>;
  floorPlans: any[];
  currentFloor: number;
  setFloorPlans: React.Dispatch<React.SetStateAction<any[]>>;
  setGia: React.Dispatch<React.SetStateAction<number>>;
  createGrid: (canvas: FabricCanvas) => FabricObject[];
}

/**
 * Hook that manages drawing tools and operations
 */
export const useDrawingTools = ({
  fabricCanvasRef,
  tool,
  setTool,
  zoomLevel,
  setZoomLevel,
  lineThickness,
  lineColor,
  historyRef,
  createGrid
}: UseDrawingToolsProps) => {
  /**
   * Save current canvas state to history
   */
  const saveCurrentState = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    try {
      // Store current state
      const currentObjects = canvas.getObjects().filter(obj => obj.objectType !== 'grid');
      
      if (currentObjects.length > 0) {
        logger.info(`Saving state with ${currentObjects.length} objects`);
        
        // Clone the past array and add current state
        const newPast = [...historyRef.current.past, currentObjects];
        
        // Update history ref
        historyRef.current = {
          past: newPast,
          future: []
        };
      }
    } catch (error) {
      logger.error("Error saving canvas state:", error);
    }
  }, [fabricCanvasRef, historyRef]);
  
  /**
   * Undo the last drawing action
   */
  const undo = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    try {
      const { past, future } = historyRef.current;
      
      if (past.length === 0) {
        toast.info("Nothing to undo");
        return;
      }
      
      // Get current state to add to future
      const currentObjects = canvas.getObjects().filter(obj => obj.objectType !== 'grid');
      
      // Get the previous state
      const previousState = past[past.length - 1];
      
      // Add current state to future
      const newFuture = [...future, currentObjects];
      
      // Remove last state from past
      const newPast = past.slice(0, past.length - 1);
      
      // Update history ref
      historyRef.current = {
        past: newPast,
        future: newFuture
      };
      
      // Remove all objects except grid
      canvas.getObjects().forEach(obj => {
        if (obj.objectType !== 'grid') {
          canvas.remove(obj);
        }
      });
      
      // Add objects from previous state
      previousState.forEach(obj => {
        canvas.add(obj);
      });
      
      // Render changes
      canvas.requestRenderAll();
      toast.success("Undo completed");
    } catch (error) {
      logger.error("Error undoing action:", error);
      toast.error("Failed to undo: " + (error instanceof Error ? error.message : String(error)));
    }
  }, [fabricCanvasRef, historyRef]);
  
  /**
   * Redo the last undone action
   */
  const redo = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    try {
      const { past, future } = historyRef.current;
      
      if (future.length === 0) {
        toast.info("Nothing to redo");
        return;
      }
      
      // Get current state to add to past
      const currentObjects = canvas.getObjects().filter(obj => obj.objectType !== 'grid');
      
      // Get the next state
      const nextState = future[future.length - 1];
      
      // Add current state to past
      const newPast = [...past, currentObjects];
      
      // Remove last state from future
      const newFuture = future.slice(0, future.length - 1);
      
      // Update history ref
      historyRef.current = {
        past: newPast,
        future: newFuture
      };
      
      // Remove all objects except grid
      canvas.getObjects().forEach(obj => {
        if (obj.objectType !== 'grid') {
          canvas.remove(obj);
        }
      });
      
      // Add objects from next state
      nextState.forEach(obj => {
        canvas.add(obj);
      });
      
      // Render changes
      canvas.requestRenderAll();
      toast.success("Redo completed");
    } catch (error) {
      logger.error("Error redoing action:", error);
      toast.error("Failed to redo: " + (error instanceof Error ? error.message : String(error)));
    }
  }, [fabricCanvasRef, historyRef]);
  
  /**
   * Handle zoom operations
   */
  const handleZoom = useCallback((scaleFactor: number) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    try {
      // Get current zoom
      const currentZoom = canvas.getZoom();
      
      // Calculate new zoom
      const newZoom = Math.max(0.1, Math.min(5, currentZoom * scaleFactor));
      
      // Apply zoom
      canvas.setZoom(newZoom);
      setZoomLevel(newZoom);
      
      // Render changes
      canvas.requestRenderAll();
      
      // Recreate grid on extreme zoom changes
      if (newZoom > 3 || newZoom < 0.3) {
        if (createGrid) {
          createGrid(canvas);
        }
      }
    } catch (error) {
      logger.error("Error zooming canvas:", error);
      toast.error("Failed to zoom: " + (error instanceof Error ? error.message : String(error)));
    }
  }, [fabricCanvasRef, setZoomLevel, createGrid]);
  
  // Apply tool changes to canvas
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    try {
      logger.info(`Applying tool change to canvas: ${tool}`);
      
      // Reset canvas modes
      canvas.isDrawingMode = false;
      canvas.selection = true;
      
      // Set proper cursor
      canvas.defaultCursor = 'default';
      canvas.hoverCursor = 'move';
      
      // Apply tool-specific settings
      switch (tool) {
        case DrawingMode.DRAW:
          canvas.isDrawingMode = true;
          canvas.freeDrawingBrush.color = lineColor;
          canvas.freeDrawingBrush.width = lineThickness;
          canvas.defaultCursor = 'crosshair';
          canvas.hoverCursor = 'crosshair';
          break;
          
        case DrawingMode.SELECT:
          canvas.selection = true;
          canvas.defaultCursor = 'default';
          canvas.hoverCursor = 'move';
          break;
          
        case DrawingMode.WALL:
        case DrawingMode.ROOM:
          canvas.defaultCursor = 'crosshair';
          canvas.hoverCursor = 'crosshair';
          break;
          
        case DrawingMode.ERASER:
          canvas.defaultCursor = 'cell';
          canvas.hoverCursor = 'cell';
          break;
      }
      
      // Render changes
      canvas.requestRenderAll();
    } catch (error) {
      logger.error("Error applying tool change:", error);
    }
  }, [fabricCanvasRef, tool, lineColor, lineThickness]);
  
  return {
    saveCurrentState,
    undo,
    redo,
    handleZoom
  };
};
