
/**
 * Custom hook for managing canvas tools and interactions
 * @module useCanvasTools
 */
import { useCallback, useEffect } from "react";
import { Canvas as FabricCanvas, PencilBrush } from "fabric";
import { toast } from "sonner";
import { clearCanvasObjects } from "@/utils/fabricHelpers";
import { enablePanning } from "@/utils/fabric";
import { DrawingTool } from "./useCanvasState";

interface UseCanvasToolsProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  gridLayerRef: React.MutableRefObject<any[]>;
  tool: DrawingTool;
  zoomLevel: number;
  setTool: React.Dispatch<React.SetStateAction<DrawingTool>>;
  setZoomLevel: React.Dispatch<React.SetStateAction<number>>;
  createGrid: (canvas: FabricCanvas) => any[];
}

/**
 * Hook for managing canvas tools and interactions
 * @param {UseCanvasToolsProps} props - Hook properties
 * @returns {Object} Canvas tool operations
 */
export const useCanvasTools = ({
  fabricCanvasRef,
  gridLayerRef,
  tool,
  zoomLevel,
  setTool,
  setZoomLevel,
  createGrid
}: UseCanvasToolsProps) => {
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
   * @param {DrawingTool} newTool - The tool to switch to
   */
  const handleToolChange = useCallback((newTool: DrawingTool) => {
    setTool(newTool);
    if (fabricCanvasRef.current) {
      // Set drawing mode based on the tool selected
      const isDrawingTool = newTool !== "hand";
      fabricCanvasRef.current.isDrawingMode = isDrawingTool;
      
      // Configure the hand tool for panning when selected
      enablePanning(fabricCanvasRef.current, newTool === "hand");
      
      // Set appropriate brush for drawing tools
      if (isDrawingTool) {
        fabricCanvasRef.current.freeDrawingBrush = new PencilBrush(fabricCanvasRef.current);
        fabricCanvasRef.current.freeDrawingBrush.color = "#000000";
        fabricCanvasRef.current.freeDrawingBrush.width = 2;
      }
      
      fabricCanvasRef.current.renderAll();
      
      // Provide user feedback
      const toolNames = {
        "draw": "Freehand",
        "room": "Room",
        "straightLine": "Wall",
        "hand": "Hand (Pan)"
      };
      toast.success(`${toolNames[newTool]} tool selected`);
    }
  }, [fabricCanvasRef, setTool]);

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

  // Set up panning when hand tool is selected
  useEffect(() => {
    if (fabricCanvasRef.current) {
      enablePanning(fabricCanvasRef.current, tool === "hand");
    }
  }, [fabricCanvasRef, tool]);

  return {
    clearDrawings,
    handleToolChange,
    handleZoom
  };
};
