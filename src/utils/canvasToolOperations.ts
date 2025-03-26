/**
 * Canvas tool operations module
 * Provides functions for handling tool changes and canvas operations
 * @module canvasToolOperations
 */
import { Canvas, Object as FabricObject, Line, PencilBrush } from "fabric";
import { DrawingTool } from "@/hooks/useCanvasState";
import { separateGridAndDrawingObjects } from "./canvasLayerOrdering";
import { 
  DEFAULT_LINE_THICKNESS,
  LARGE_GRID, 
  SMALL_GRID
} from "@/constants/numerics";

/**
 * Function to clear all drawings from the canvas
 * @param {Canvas | null} canvas - The Fabric.js canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 * @param {(canvas: Canvas) => FabricObject[]} createGrid - Function to create grid
 */
export const clearDrawings = (
  canvas: Canvas | null,
  gridLayerRef: React.MutableRefObject<FabricObject[]>,
  createGrid: (canvas: Canvas) => FabricObject[]
): void => {
  if (!canvas) return;
  
  const { gridObjects, drawingObjects } = separateGridAndDrawingObjects(canvas);
  
  // Remove all drawing objects
  drawingObjects.forEach(obj => {
    canvas.remove(obj);
  });
  
  // Reset grid if needed
  if (gridObjects.length === 0 && createGrid) {
    const newGrid = createGrid(canvas);
    if (newGrid && gridLayerRef) {
      gridLayerRef.current = newGrid;
    }
  }
  
  // Force a render to update the display
  canvas.requestRenderAll();
};

/**
 * Function to handle tool changes
 * @param {DrawingTool} newTool - The tool to switch to
 * @param {Canvas | null} canvas - The Fabric.js canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 * @param {number} lineThickness - Current line thickness
 * @param {string} lineColor - Current line color
 * @param {React.Dispatch<React.SetStateAction<DrawingTool>>} setTool - Function to update tool state
 */
export const handleToolChange = (
  newTool: DrawingTool,
  canvas: Canvas | null,
  gridLayerRef: React.MutableRefObject<FabricObject[]>,
  lineThickness: number,
  lineColor: string,
  setTool: React.Dispatch<React.SetStateAction<DrawingTool>>
): void => {
  if (!canvas) return;
  
  // Update the tool state
  setTool(newTool);
  
  // Apply tool-specific settings
  switch (newTool) {
    case "pen":
      canvas.isDrawingMode = true;
      if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.width = lineThickness || DEFAULT_LINE_THICKNESS;
        canvas.freeDrawingBrush.color = lineColor || "#000000";
      }
      break;
    case "eraser":
      // Implement eraser tool logic
      canvas.isDrawingMode = false;
      break;
    case "line":
      // Implement line tool logic
      canvas.isDrawingMode = false;
      break;
    case "select":
      canvas.isDrawingMode = false;
      canvas.selection = true;
      break;
    case "hand":
      canvas.isDrawingMode = false;
      canvas.selection = false;
      // Set panning mode
      break;
    default:
      canvas.isDrawingMode = false;
      break;
  }
  
  // Ensure proper z-ordering of elements
  if (gridLayerRef && gridLayerRef.current) {
    gridLayerRef.current.forEach(gridObj => {
      if (canvas.contains(gridObj)) {
        canvas.sendObjectToBack(gridObj);
      }
    });
  }
  
  // Request a render to update canvas
  canvas.requestRenderAll();
};

/**
 * Function to handle canvas zooming
 * @param {"in" | "out"} direction - Zoom direction
 * @param {Canvas | null} canvas - The Fabric.js canvas instance
 * @param {number} zoomLevel - Current zoom level
 * @param {React.Dispatch<React.SetStateAction<number>>} setZoomLevel - Function to update zoom level
 */
export const handleZoom = (
  direction: "in" | "out",
  canvas: Canvas | null,
  zoomLevel: number,
  setZoomLevel: React.Dispatch<React.SetStateAction<number>>
): void => {
  if (!canvas) return;
  
  const zoomFactor = 0.1; // 10% zoom step
  const minZoom = 0.1;    // Minimum zoom level (10%)
  const maxZoom = 5.0;    // Maximum zoom level (500%)
  
  // Calculate new zoom level
  let newZoom = zoomLevel;
  if (direction === "in") {
    newZoom = Math.min(newZoom + zoomFactor, maxZoom);
  } else {
    newZoom = Math.max(newZoom - zoomFactor, minZoom);
  }
  
  // Only update if zoom level changed
  if (newZoom !== zoomLevel) {
    // Apply zoom to canvas
    canvas.setZoom(newZoom);
    
    // Update zoom level state
    setZoomLevel(newZoom);
    
    // Request a render to update display
    canvas.requestRenderAll();
  }
};

/**
 * Set the active tool on the canvas
 * @param {Canvas | null} canvas - The Fabric.js canvas instance
 * @param {DrawingTool} tool - The tool to set
 */
export const setActiveTool = (
  canvas: Canvas | null,
  tool: DrawingTool
): void => {
  if (!canvas) return;
  
  // Apply tool-specific settings
  switch (tool) {
    case "pen":
      canvas.isDrawingMode = true;
      break;
    case "select":
      canvas.isDrawingMode = false;
      canvas.selection = true;
      break;
    case "hand":
      canvas.isDrawingMode = false;
      canvas.selection = false;
      // Additional panning mode setup would go here
      break;
    default:
      canvas.isDrawingMode = false;
      break;
  }
  
  // Request a render to update display
  canvas.requestRenderAll();
};
