
/**
 * Custom hook for managing canvas tools and interactions
 * @module useCanvasTools
 */
import { useCallback, useEffect } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { DrawingTool } from "./useCanvasState";
import { 
  clearDrawings as clearCanvasDrawings,
  handleToolChange as changeCanvasTool,
  handleZoom as zoomCanvas
} from "@/utils/canvasToolOperations";
import { arrangeGridElements } from "@/utils/canvasLayerOrdering";

interface UseCanvasToolsProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
  tool: DrawingTool;
  zoomLevel: number;
  lineThickness: number;
  lineColor: string;
  setTool: React.Dispatch<React.SetStateAction<DrawingTool>>;
  setZoomLevel: React.Dispatch<React.SetStateAction<number>>;
  createGrid: (canvas: FabricCanvas) => FabricObject[];
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
  lineThickness,
  lineColor,
  setTool,
  setZoomLevel,
  createGrid
}: UseCanvasToolsProps) => {
  /**
   * Clear all drawings from the canvas while preserving the grid
   */
  const clearDrawings = useCallback(() => {
    clearCanvasDrawings(fabricCanvasRef.current, gridLayerRef, createGrid);
  }, [fabricCanvasRef, gridLayerRef, createGrid]);
  
  /**
   * Change the current drawing tool
   * @param {DrawingTool} newTool - The tool to switch to
   */
  const handleToolChange = useCallback((newTool: DrawingTool) => {
    changeCanvasTool(
      newTool, 
      fabricCanvasRef.current, 
      gridLayerRef, 
      lineThickness, 
      lineColor, 
      setTool
    );
  }, [fabricCanvasRef, gridLayerRef, setTool, lineThickness, lineColor]);

  /**
   * Zoom the canvas in or out in exact 10% increments
   * @param {string} direction - The zoom direction ("in" or "out")
   */
  const handleZoom = useCallback((direction: "in" | "out") => {
    zoomCanvas(direction, fabricCanvasRef.current, zoomLevel, setZoomLevel);
  }, [fabricCanvasRef, zoomLevel, setZoomLevel]);

  // Set up panning when hand tool is selected
  useEffect(() => {
    if (fabricCanvasRef.current) {
      if (tool === "select" || tool === "hand") {
        // Apply appropriate tool mode
        handleToolChange(tool);
      }
      
      // Ensure grid elements are in correct z-order after a short delay
      setTimeout(() => {
        if (fabricCanvasRef.current) {
          arrangeGridElements(fabricCanvasRef.current, gridLayerRef);
        }
      }, 100);
    }
  }, [fabricCanvasRef, gridLayerRef, tool, handleToolChange]);

  return {
    clearDrawings,
    handleToolChange,
    handleZoom
  };
};
