
/**
 * Custom hook for managing canvas tools and interactions
 * This hook provides the core functionality for tool switching, zooming, and canvas clearing
 * @module useCanvasTools
 */
import { useCallback, useEffect } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { DrawingTool } from "./useCanvasState";
import { 
  clearDrawings,
  handleToolChange,
  handleZoom,
  setActiveTool
} from "@/utils/canvasToolOperations";
import { arrangeGridElements } from "@/utils/canvasLayerOrdering";
import { ZOOM_MULTIPLIERS } from "@/constants/zoomConstants";

/**
 * Timing constants for canvas operations
 * @constant {Object}
 */
const TIMING_CONSTANTS = {
  /**
   * Delay after tool change before arranging grid elements (ms)
   * @constant {number}
   */
  GRID_ARRANGEMENT_DELAY: 100,
  
  /**
   * Debounce delay for tool change operations (ms)
   * @constant {number}
   */
  TOOL_CHANGE_DEBOUNCE: 150
};

/**
 * Interface for useCanvasTools props
 * @interface UseCanvasToolsProps
 */
interface UseCanvasToolsProps {
  /** Reference to the Fabric.js canvas */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Reference to grid layer objects */
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
  /** Current active drawing tool */
  tool: DrawingTool;
  /** Current zoom level */
  zoomLevel: number;
  /** Current line thickness value */
  lineThickness: number;
  /** Current line color value */
  lineColor: string;
  /** Function to update the current tool */
  setTool: React.Dispatch<React.SetStateAction<DrawingTool>>;
  /** Function to update the zoom level */
  setZoomLevel: React.Dispatch<React.SetStateAction<number>>;
  /** Function to create/recreate the grid */
  createGrid: (canvas: FabricCanvas) => FabricObject[];
}

/**
 * Hook for managing canvas tools and interactions
 * Provides functions for clearing the canvas, changing tools, and zooming
 * 
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
   * Removes user-created content but keeps the grid layer intact
   */
  const clearCanvasDrawings = useCallback(() => {
    clearDrawings(fabricCanvasRef.current, gridLayerRef, createGrid);
  }, [fabricCanvasRef, gridLayerRef, createGrid]);
  
  /**
   * Change the current drawing tool
   * Updates both the visual state and the functional behavior of the canvas
   * 
   * @param {DrawingTool} newTool - The tool to switch to
   */
  const handleCanvasToolChange = useCallback((newTool: DrawingTool) => {
    handleToolChange(
      newTool, 
      fabricCanvasRef.current, 
      gridLayerRef, 
      lineThickness, 
      lineColor, 
      setTool
    );
  }, [fabricCanvasRef, gridLayerRef, setTool, lineThickness, lineColor]);

  /**
   * Zoom the canvas in or out
   * Applies the zoom based on a specified direction using consistent increments
   * Prevents exceeding minimum/maximum zoom boundaries
   * 
   * @param {string} direction - The zoom direction ("in" or "out")
   */
  const handleCanvasZoom = useCallback((direction: "in" | "out") => {
    const zoomFactor = direction === "in" 
      ? ZOOM_MULTIPLIERS.IN
      : ZOOM_MULTIPLIERS.OUT;
    
    // Determine new zoom level
    let newZoomLevel = zoomLevel * zoomFactor;
    
    // Apply zoom boundaries
    newZoomLevel = Math.max(ZOOM_MULTIPLIERS.MIN_ZOOM, newZoomLevel);
    newZoomLevel = Math.min(ZOOM_MULTIPLIERS.MAX_ZOOM, newZoomLevel);
    
    handleZoom(direction, fabricCanvasRef.current, zoomLevel, setZoomLevel);
  }, [fabricCanvasRef, zoomLevel, setZoomLevel]);

  // Set up panning when hand tool is selected
  useEffect(() => {
    if (fabricCanvasRef.current) {
      if (tool === "select" || tool === "hand") {
        // Apply appropriate tool mode
        handleCanvasToolChange(tool);
      }
      
      // Ensure grid elements are in correct z-order after a short delay
      setTimeout(() => {
        if (fabricCanvasRef.current) {
          arrangeGridElements(fabricCanvasRef.current, gridLayerRef);
        }
      }, TIMING_CONSTANTS.GRID_ARRANGEMENT_DELAY);
    }
  }, [fabricCanvasRef, gridLayerRef, tool, handleCanvasToolChange]);

  return {
    clearDrawings: clearCanvasDrawings,
    handleToolChange: handleCanvasToolChange,
    handleZoom: handleCanvasZoom
  };
};
