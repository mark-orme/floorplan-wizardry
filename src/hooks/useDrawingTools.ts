/**
 * @deprecated Use useCanvasControllerTools instead
 * This file is kept for reference and backward compatibility
 */
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { DrawingMode, DrawingTool } from "@/constants/drawingModes";
import { useCanvasActions } from "./useCanvasActions";
import { useCanvasInteractions } from "./useCanvasInteractions";
import { FloorPlan } from "@/types/floorPlanTypes";

interface UseDrawingToolsProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
  historyRef: React.MutableRefObject<{past: FabricObject[][], future: FabricObject[][]}>;
  tool: DrawingTool;
  setTool: React.Dispatch<React.SetStateAction<DrawingTool>>;
  zoomLevel: number;
  setZoomLevel: React.Dispatch<React.SetStateAction<number>>;
  lineThickness: number;
  lineColor: string;
  floorPlans: FloorPlan[];
  currentFloor: number;
  setFloorPlans: React.Dispatch<React.SetStateAction<FloorPlan[]>>;
  setGia: React.Dispatch<React.SetStateAction<number>>;
  createGrid: (canvas: FabricCanvas) => any[];
}

/**
 * @deprecated Use useCanvasControllerTools instead
 */
export const useDrawingTools = ({
  fabricCanvasRef,
  gridLayerRef,
  historyRef,
  tool,
  setTool,
  zoomLevel,
  setZoomLevel,
  lineThickness,
  lineColor,
  floorPlans,
  currentFloor,
  setFloorPlans,
  setGia,
  createGrid
}: UseDrawingToolsProps) => {
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [currentZoom, setCurrentZoom] = useState(zoomLevel);

  useEffect(() => {
    setCurrentZoom(zoomLevel);
  }, [zoomLevel]);

  const toggleSnap = useCallback(() => {
    setSnapEnabled(prev => !prev);
  }, []);

  const handleToolChange = useCallback((newTool: DrawingTool) => {
    setTool(newTool);
    toast(`Tool changed to ${newTool}`);
  }, [setTool]);

  const handleZoom = useCallback((zoomChange: number) => {
    setZoomLevel(prevZoom => {
      const newZoom = Math.max(0.1, Math.min(3, prevZoom * zoomChange));
      setCurrentZoom(newZoom);
      return newZoom;
    });
  }, [setZoomLevel]);

  const clearDrawings = useCallback(() => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    canvas.getObjects().forEach(obj => {
      if (!(obj as any).isGrid) {
        canvas.remove(obj);
      }
    });
    canvas.renderAll();
  }, [fabricCanvasRef]);

  const {
    clearCanvas,
    saveCanvas
  } = useCanvasActions({
    fabricCanvasRef,
    historyRef,
    clearDrawings,
    floorPlans,
    currentFloor,
    setFloorPlans,
    setGia
  });

  const {
    enablePointSelection,
    setupSelectionMode
  } = useCanvasInteractions({
    fabricCanvasRef,
    tool
  });

  const toolActions = {
    handleToolChange,
    handleZoom,
    clearCanvas,
    saveCanvas,
    deleteSelectedObjects: () => {
      // Implement deleteSelectedObjects functionality
      if (fabricCanvasRef.current) {
        const canvas = fabricCanvasRef.current;
        const activeObjects = canvas.getActiveObjects();
        if (activeObjects.length > 0) {
          activeObjects.forEach(obj => canvas.remove(obj));
          canvas.discardActiveObject();
          canvas.requestRenderAll();
        }
      }
    },
    
    undo: () => {
      // Implement undo functionality using history
      if (historyRef.current && historyRef.current.past.length > 0) {
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;
        
        const current = historyRef.current.past.pop();
        if (current) {
          historyRef.current.future.push(current);
          // Apply the previous state
          // Implementation depends on how history is structured
        }
        canvas.renderAll();
      }
    },
    
    redo: () => {
      // Implement redo functionality using history
      if (historyRef.current && historyRef.current.future.length > 0) {
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;
        
        const next = historyRef.current.future.pop();
        if (next) {
          historyRef.current.past.push(next);
          // Apply the next state
          // Implementation depends on how history is structured
        }
        canvas.renderAll();
      }
    }
  };

  return toolActions;
};
