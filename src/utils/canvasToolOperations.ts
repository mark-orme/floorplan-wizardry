
/**
 * Canvas tool operations module
 * Provides functions for handling tool changes and canvas operations
 * @module canvasToolOperations
 */
import { Canvas, Object as FabricObject, Line, PencilBrush } from "fabric";
import { DrawingMode } from "@/constants/drawingModes";
import { separateGridAndDrawingObjects } from "./canvasLayerOrdering";
import { 
  DEFAULT_LINE_THICKNESS,
  LARGE_GRID, 
  SMALL_GRID
} from "@/constants/numerics";
import { disableSelection, enableSelection } from "./fabric/selection";

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
  
  console.log("Clearing drawings from canvas");
  
  const { gridObjects, drawingObjects } = separateGridAndDrawingObjects(canvas);
  
  // Remove all drawing objects
  drawingObjects.forEach(obj => {
    canvas.remove(obj);
  });
  
  // Reset grid if needed
  if (gridObjects.length === 0 && createGrid) {
    console.log("No grid objects found, recreating grid");
    try {
      const newGrid = createGrid(canvas);
      if (newGrid && gridLayerRef) {
        gridLayerRef.current = Array.isArray(newGrid) ? newGrid : [];
      }
    } catch (error) {
      console.error("Error recreating grid after clearing drawings:", error);
    }
  }
  
  // Force a render to update the display
  canvas.requestRenderAll();
  
  console.log(`Cleared ${drawingObjects.length} drawing objects from canvas`);
};

/**
 * Function to ensure brush is properly initialized
 * @param {Canvas} canvas - The Fabric.js canvas instance
 * @param {string} lineColor - Current line color
 * @param {number} lineThickness - Current line thickness
 */
const ensureBrushIsInitialized = (
  canvas: Canvas,
  lineColor: string,
  lineThickness: number
): void => {
  // If the brush doesn't exist or isn't properly initialized, create a new one
  if (!canvas.freeDrawingBrush || !(canvas.freeDrawingBrush instanceof PencilBrush)) {
    console.log("Creating new PencilBrush for canvas");
    canvas.freeDrawingBrush = new PencilBrush(canvas);
  }
  
  // Set brush properties
  canvas.freeDrawingBrush.color = lineColor || "#000000";
  canvas.freeDrawingBrush.width = lineThickness || DEFAULT_LINE_THICKNESS;
  
  console.log(`Brush initialized: color=${lineColor}, width=${lineThickness}`);
};

/**
 * Function to handle tool changes
 * @param {DrawingMode} newTool - The tool to switch to
 * @param {Canvas | null} canvas - The Fabric.js canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 * @param {number} lineThickness - Current line thickness
 * @param {string} lineColor - Current line color
 * @param {React.Dispatch<React.SetStateAction<DrawingMode>>} setTool - Function to update tool state
 */
export const handleToolChange = (
  newTool: DrawingMode,
  canvas: Canvas | null,
  gridLayerRef: React.MutableRefObject<FabricObject[]>,
  lineThickness: number,
  lineColor: string,
  setTool: React.Dispatch<React.SetStateAction<DrawingMode>>
): void => {
  if (!canvas) {
    console.error("Cannot change tool: Canvas is null");
    return;
  }
  
  console.log(`Changing tool to: ${newTool}`);
  
  // Update the tool state
  setTool(newTool);
  
  // Ensure brush is initialized
  ensureBrushIsInitialized(canvas, lineColor, lineThickness);
  
  // Apply tool-specific settings
  switch (newTool) {
    case DrawingMode.DRAW:
      // Enable drawing mode
      canvas.isDrawingMode = true;
      if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.width = lineThickness || DEFAULT_LINE_THICKNESS;
        canvas.freeDrawingBrush.color = lineColor || "#000000";
      }
      disableSelection(canvas);
      // Change cursor to crosshair
      canvas.defaultCursor = 'crosshair';
      canvas.hoverCursor = 'crosshair';
      canvas.selection = false; // Disable object selection while drawing
      console.log("Drawing mode enabled", {
        isDrawingMode: canvas.isDrawingMode,
        brushWidth: canvas.freeDrawingBrush?.width,
        brushColor: canvas.freeDrawingBrush?.color
      });
      break;
      
    case DrawingMode.STRAIGHT_LINE:
      // Special handling for straight line tool
      canvas.isDrawingMode = false;
      canvas.selection = false;
      canvas.defaultCursor = 'crosshair';
      canvas.hoverCursor = 'crosshair';
      disableSelection(canvas);
      console.log(`Straight line mode enabled, selection disabled`);
      break;
      
    case DrawingMode.WALL:
    case DrawingMode.ROOM:
    case DrawingMode.LINE:
    case DrawingMode.MEASURE:
      // Custom drawing modes - disable native drawing but also disable selection
      canvas.isDrawingMode = false;
      canvas.selection = false;
      canvas.defaultCursor = 'crosshair';
      canvas.hoverCursor = 'crosshair';
      disableSelection(canvas);
      console.log(`Custom drawing mode: ${newTool}, selection disabled`);
      break;
      
    case DrawingMode.SELECT:
      canvas.isDrawingMode = false;
      canvas.selection = true; // Enable selection of objects
      canvas.defaultCursor = 'default';
      canvas.hoverCursor = 'move';
      enableSelection(canvas);
      console.log("Selection mode enabled");
      break;
      
    case DrawingMode.ERASER:
      canvas.isDrawingMode = false;
      canvas.selection = true;
      canvas.defaultCursor = 'cell';
      canvas.hoverCursor = 'cell';
      console.log("Eraser mode enabled");
      break;
      
    case DrawingMode.HAND:
      canvas.isDrawingMode = false;
      canvas.selection = false;
      canvas.defaultCursor = 'grab';
      canvas.hoverCursor = 'grab';
      disableSelection(canvas);
      console.log("Hand (pan) mode enabled");
      break;
      
    default:
      canvas.isDrawingMode = false;
      canvas.selection = true;
      canvas.defaultCursor = 'default';
      canvas.hoverCursor = 'default';
      console.log(`Unhandled tool type: ${newTool}, using default settings`);
      break;
  }
  
  // Send grid objects to back (ensure they're behind drawn objects)
  if (gridLayerRef && gridLayerRef.current && gridLayerRef.current.length > 0) {
    console.log(`Sending ${gridLayerRef.current.length} grid objects to back`);
    gridLayerRef.current.forEach(gridObj => {
      if (canvas.contains(gridObj)) {
        // Fix: Use canvas.sendObjectToBack instead of sendToBack
        canvas.sendObjectToBack(gridObj);
      }
    });
  }
  
  // Request a render to update canvas
  canvas.requestRenderAll();
  
  console.log(`Tool changed to ${newTool}`, {
    isDrawingMode: canvas.isDrawingMode,
    selection: canvas.selection,
    defaultCursor: canvas.defaultCursor
  });
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
 * @param {DrawingMode} tool - The tool to set
 */
export const setActiveTool = (
  canvas: Canvas | null,
  tool: DrawingMode
): void => {
  if (!canvas) return;
  
  // Apply tool-specific settings
  switch (tool) {
    case DrawingMode.DRAW:
      canvas.isDrawingMode = true;
      break;
    case DrawingMode.SELECT:
      canvas.isDrawingMode = false;
      canvas.selection = true;
      break;
    case DrawingMode.ERASER:
      canvas.isDrawingMode = false;
      canvas.selection = true;
      break;
    default:
      canvas.isDrawingMode = false;
      break;
  }
  
  // Request a render to update display
  canvas.requestRenderAll();
};

/**
 * Determines if a canvas object is part of the grid
 * @param {FabricObject} obj - The fabric object to check
 * @returns {boolean} True if the object is a grid element
 */
export const isGridObject = (obj: FabricObject): boolean => {
  return obj.objectType === 'grid';
};

/**
 * Force refreshes all canvas tools and states
 * Useful when canvas behavior becomes inconsistent
 * @param {Canvas | null} canvas - The Fabric.js canvas instance
 * @param {DrawingMode} currentTool - Current active tool
 * @param {string} lineColor - Current line color 
 * @param {number} lineThickness - Current line thickness
 */
export const refreshCanvasToolState = (
  canvas: Canvas | null,
  currentTool: DrawingMode,
  lineColor: string,
  lineThickness: number
): void => {
  if (!canvas) return;
  
  console.log("Forcing refresh of canvas tool state");
  
  // Re-initialize the brush
  if (!canvas.freeDrawingBrush || !(canvas.freeDrawingBrush instanceof PencilBrush)) {
    canvas.freeDrawingBrush = new PencilBrush(canvas);
  }
  
  // Reset brush properties
  canvas.freeDrawingBrush.color = lineColor || "#000000";
  canvas.freeDrawingBrush.width = lineThickness || DEFAULT_LINE_THICKNESS;
  
  // Set drawing mode based on tool
  canvas.isDrawingMode = currentTool === DrawingMode.DRAW;
  
  // Reset selection state based on tool
  if (currentTool === DrawingMode.SELECT) {
    canvas.selection = true;
    enableSelection(canvas);
  } else {
    canvas.selection = false;
    disableSelection(canvas);
  }
  
  // Force render
  canvas.requestRenderAll();
  
  console.log("Canvas tool state refreshed:", {
    tool: currentTool,
    isDrawingMode: canvas.isDrawingMode,
    selection: canvas.selection,
    brushColor: canvas.freeDrawingBrush.color,
    brushWidth: canvas.freeDrawingBrush.width
  });
};
