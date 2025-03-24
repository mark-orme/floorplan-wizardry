
/**
 * Custom hook for drawing tools functionality
 * Manages tool behavior, history, and canvas operations
 * @module useDrawingTools
 */
import { useCallback } from "react";
import { Canvas as FabricCanvas, PencilBrush } from "fabric";
import { toast } from "sonner";
import { clearCanvasObjects } from "@/utils/fabricHelpers";
import { saveFloorPlans, FloorPlan, MAX_HISTORY_STATES } from "@/utils/drawing";

interface UseDrawingToolsProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  gridLayerRef: React.MutableRefObject<any[]>;
  historyRef: React.MutableRefObject<{past: any[][], future: any[][]}>;
  tool: "draw" | "room" | "straightLine";
  zoomLevel: number;
  setTool: React.Dispatch<React.SetStateAction<"draw" | "room" | "straightLine">>;
  setZoomLevel: React.Dispatch<React.SetStateAction<number>>;
  floorPlans: FloorPlan[];
  currentFloor: number;
  setFloorPlans: React.Dispatch<React.SetStateAction<FloorPlan[]>>;
  setGia: React.Dispatch<React.SetStateAction<number>>;
  createGrid: (canvas: FabricCanvas) => any[];
  recalculateGIA: () => void;
}

/**
 * Hook for managing drawing tools and related operations
 * Provides functions for tool selection, history management, and canvas operations
 * @param {UseDrawingToolsProps} props - Hook properties
 * @returns {Object} Drawing tool operations
 */
export const useDrawingTools = ({
  fabricCanvasRef,
  gridLayerRef,
  historyRef,
  tool,
  zoomLevel,
  setTool,
  setZoomLevel,
  floorPlans,
  currentFloor,
  setFloorPlans,
  setGia,
  createGrid,
  recalculateGIA
}: UseDrawingToolsProps) => {
  
  /**
   * Clear all drawings from the canvas while preserving the grid
   */
  const clearDrawings = useCallback(() => {
    if (!fabricCanvasRef.current) {
      console.error("Cannot clear drawings: fabric canvas is null");
      return;
    }
    
    const gridObjects = [...gridLayerRef.current];
    
    clearCanvasObjects(fabricCanvasRef.current, gridObjects);
    
    if (gridObjects.length === 0 || !fabricCanvasRef.current.contains(gridObjects[0])) {
      console.log("Recreating grid during clearDrawings...");
      createGrid(fabricCanvasRef.current);
    }
    
    fabricCanvasRef.current.renderAll();
  }, [fabricCanvasRef, gridLayerRef, createGrid]);
  
  /**
   * Change the current drawing tool
   * @param {string} newTool - The tool to switch to
   */
  const handleToolChange = useCallback((newTool: "draw" | "room" | "straightLine") => {
    setTool(newTool);
    if (fabricCanvasRef.current) {
      // Ensure we're in drawing mode
      fabricCanvasRef.current.isDrawingMode = true;
      
      // Set appropriate brush
      fabricCanvasRef.current.freeDrawingBrush = new PencilBrush(fabricCanvasRef.current);
      fabricCanvasRef.current.freeDrawingBrush.color = "#000000";
      fabricCanvasRef.current.freeDrawingBrush.width = 2;
      
      fabricCanvasRef.current.renderAll();
      
      // Provide user feedback
      const toolNames = {
        "draw": "Freehand",
        "room": "Room",
        "straightLine": "Wall"
      };
      toast.success(`${toolNames[newTool]} tool selected`);
    }
  }, [fabricCanvasRef, setTool]);

  /**
   * Undo the last drawing action
   */
  const handleUndo = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    
    if (historyRef.current.past.length > 1) {
      fabricCanvasRef.current.renderOnAddRemove = false;
      
      const currentState = fabricCanvasRef.current.getObjects().filter(obj => 
        obj.type === 'path' || obj.type === 'polyline'
      );
      
      // Add current state to future history
      historyRef.current.future.unshift([...currentState]);
      
      // Trim future history to prevent memory leaks
      if (historyRef.current.future.length > MAX_HISTORY_STATES) {
        historyRef.current.future = historyRef.current.future.slice(0, MAX_HISTORY_STATES);
      }
      
      // Remove current state from past history
      historyRef.current.past.pop();
      
      // Get previous state
      const previousState = historyRef.current.past[historyRef.current.past.length - 1];
      
      // Clear canvas and add previous state objects
      clearDrawings();
      
      previousState.forEach(obj => fabricCanvasRef.current!.add(obj));
      
      recalculateGIA();
      
      fabricCanvasRef.current.renderOnAddRemove = true;
      fabricCanvasRef.current.renderAll();
      toast("Undo successful");
    } else {
      toast("Nothing to undo");
    }
  }, [fabricCanvasRef, historyRef, clearDrawings, recalculateGIA]);

  /**
   * Redo a previously undone action
   */
  const handleRedo = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    
    if (historyRef.current.future.length > 0) {
      fabricCanvasRef.current.renderOnAddRemove = false;
      
      const nextState = historyRef.current.future[0];
      
      historyRef.current.future.shift();
      historyRef.current.past.push([...nextState]);
      
      // Trim past history to prevent memory leaks
      if (historyRef.current.past.length > MAX_HISTORY_STATES) {
        historyRef.current.past = historyRef.current.past.slice(-MAX_HISTORY_STATES);
      }
      
      clearDrawings();
      
      nextState.forEach(obj => fabricCanvasRef.current!.add(obj));
      
      recalculateGIA();
      
      fabricCanvasRef.current.renderOnAddRemove = true;
      fabricCanvasRef.current.renderAll();
      toast("Redo successful");
    } else {
      toast("Nothing to redo");
    }
  }, [fabricCanvasRef, historyRef, clearDrawings, recalculateGIA]);

  /**
   * Zoom the canvas in or out
   * @param {string} direction - The zoom direction ("in" or "out")
   */
  const handleZoom = useCallback((direction: "in" | "out") => {
    if (!fabricCanvasRef.current) return;
    const factor = direction === "in" ? 1.1 : 0.9;
    const newZoom = zoomLevel * factor;
    
    // Limit zoom range for usability
    if (newZoom >= 0.5 && newZoom <= 3) {
      fabricCanvasRef.current.setZoom(newZoom);
      setZoomLevel(newZoom);
      toast(`Zoom: ${Math.round(newZoom * 100)}%`);
    } else {
      toast("Zoom limit reached");
    }
  }, [fabricCanvasRef, zoomLevel, setZoomLevel]);

  /**
   * Clear all objects from the canvas
   */
  const clearCanvas = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    
    clearDrawings();
    
    // Reset history
    historyRef.current.past = [[]];
    historyRef.current.future = [];
    
    // Update floor plans state
    setFloorPlans(prev => {
      const newFloorPlans = [...prev];
      if (newFloorPlans[currentFloor]) {
        newFloorPlans[currentFloor] = {
          ...newFloorPlans[currentFloor],
          strokes: []
        };
      }
      return newFloorPlans;
    });
    
    // Reset area calculation
    setGia(0);
    
    toast.success("Canvas cleared");
  }, [fabricCanvasRef, clearDrawings, historyRef, currentFloor, setFloorPlans, setGia]);

  /**
   * Save the current floor plan as an image and to storage
   */
  const saveCanvas = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    
    try {
      // First save to storage
      saveFloorPlans(floorPlans)
        .then(() => {
          toast.success("Floor plans saved to offline storage");
          
          // Then export as image
          const dataUrl = fabricCanvasRef.current!.toDataURL({
            format: 'png',
            quality: 1,
            multiplier: 1
          });
          
          // Create and trigger download link
          const link = document.createElement("a");
          link.download = `floorplan-${floorPlans[currentFloor]?.label || 'untitled'}.png`;
          link.href = dataUrl;
          link.click();
          
          toast.success("Floorplan image exported");
        })
        .catch(error => {
          console.error("Save failed:", error);
          toast.error("Failed to save floor plans");
        });
    } catch (e) {
      console.error('Save failed:', e);
      toast.error("Failed to save floorplan");
    }
  }, [fabricCanvasRef, floorPlans, currentFloor]);

  return {
    clearDrawings,
    handleToolChange,
    handleUndo,
    handleRedo,
    handleZoom,
    clearCanvas,
    saveCanvas
  };
};
