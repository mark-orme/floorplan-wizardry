/**
 * Canvas tool operation utilities
 * Provides functions for handling specific tool operations
 * @module canvasToolOperations
 */
import { Canvas as FabricCanvas } from "fabric";
import { toast } from "sonner";
import { clearCanvasObjects } from "@/utils/fabricHelpers";
import { enablePanning, enableSelection, disableSelection } from "@/utils/fabricInteraction";
import { DrawingTool } from "@/hooks/useCanvasState";
import { arrangeGridElements } from "./canvasLayerOrdering";

/**
 * Clear all drawings from the canvas while preserving the grid
 * @param {FabricCanvas} fabricCanvas - The Fabric canvas instance
 * @param {React.MutableRefObject<any[]>} gridLayerRef - Reference to grid objects
 * @param {Function} createGrid - Function to recreate grid if needed
 * @returns {void}
 */
export const clearDrawings = (
  fabricCanvas: FabricCanvas | null,
  gridLayerRef: React.MutableRefObject<any[]>,
  createGrid: (canvas: FabricCanvas) => any[]
): void => {
  if (!fabricCanvas) {
    console.error("Cannot clear drawings: fabric canvas is null");
    return;
  }
  
  const gridObjects = [...gridLayerRef.current];
  
  clearCanvasObjects(fabricCanvas, gridObjects);
  
  if (gridObjects.length === 0 || !fabricCanvas.contains(gridObjects[0])) {
    console.log("Recreating grid during clearDrawings...");
    createGrid(fabricCanvas);
  }
  
  fabricCanvas.requestRenderAll();
};

/**
 * Change the current drawing tool and set up canvas accordingly
 * @param {DrawingTool} newTool - The tool to switch to
 * @param {FabricCanvas} fabricCanvas - The Fabric canvas instance
 * @param {React.MutableRefObject<any[]>} gridLayerRef - Reference to grid objects
 * @param {number} lineThickness - Current line thickness setting
 * @param {string} lineColor - Current line color setting
 * @param {React.Dispatch<React.SetStateAction<DrawingTool>>} setTool - State setter for tool
 * @returns {void}
 */
export const handleToolChange = (
  newTool: DrawingTool,
  fabricCanvas: FabricCanvas | null,
  gridLayerRef: React.MutableRefObject<any[]>,
  lineThickness: number,
  lineColor: string,
  setTool: React.Dispatch<React.SetStateAction<DrawingTool>>
): void => {
  if (!fabricCanvas) return;
  
  // Disable current tool settings
  fabricCanvas.isDrawingMode = false;
  disableSelection(fabricCanvas);
  
  // Enable new tool settings
  switch (newTool) {
    case "draw":
    case "straightLine":
    case "room":
      fabricCanvas.isDrawingMode = true;
      
      // Initialize brush with current settings if needed
      if (fabricCanvas.freeDrawingBrush) {
        fabricCanvas.freeDrawingBrush.width = lineThickness;
        fabricCanvas.freeDrawingBrush.color = lineColor;
      }
      break;
    case "select":
      enableSelection(fabricCanvas);
      toast.success("Select tool activated. You can now select and resize walls.");
      break;
    case "hand":
      enablePanning(fabricCanvas);
      toast.success("Hand (Pan) tool selected");
      break;
    case "none":
      enableSelection(fabricCanvas);
      newTool = "select"; // Override to select
      toast.success("Select tool activated");
      break;
    default:
      fabricCanvas.isDrawingMode = false;
  }
  
  setTool(newTool);
  
  // Use the imported arrangeGridElements function
  arrangeGridElements(fabricCanvas, gridLayerRef);
};

/**
 * Zoom the canvas in or out in exact 10% increments
 * @param {string} direction - The zoom direction ("in" or "out")
 * @param {FabricCanvas} fabricCanvas - The Fabric canvas instance
 * @param {number} currentZoomLevel - Current zoom level
 * @param {React.Dispatch<React.SetStateAction<number>>} setZoomLevel - State setter for zoom level
 * @returns {void}
 */
export const handleZoom = (
  direction: "in" | "out",
  fabricCanvas: FabricCanvas | null,
  currentZoomLevel: number,
  setZoomLevel: React.Dispatch<React.SetStateAction<number>>
): void => {
  if (!fabricCanvas) return;
  
  // Use exact 10% increments for zooming
  const zoomStep = 0.1; // 10% step
  const minZoom = 0.5;  // 50% minimum zoom
  const maxZoom = 3.0;  // 300% maximum zoom
  
  // Calculate the new zoom level in 10% increments
  let newZoom: number;
  if (direction === "in") {
    // Round up to next 10% increment
    newZoom = Math.min(Math.ceil((currentZoomLevel + 0.05) * 10) / 10, maxZoom);
  } else {
    // Round down to previous 10% increment
    newZoom = Math.max(Math.floor((currentZoomLevel - 0.05) * 10) / 10, minZoom);
  }
  
  // Only apply zoom if it's different from current
  if (newZoom !== currentZoomLevel) {
    fabricCanvas.setZoom(newZoom);
    setZoomLevel(newZoom);
    
    // Trigger custom event for zoom change detection - use a custom event name
    fabricCanvas.fire('custom:zoom-changed', { zoom: newZoom });
    
    // Show rounded percentage zoom level
    toast(`Zoom: ${Math.round(newZoom * 100)}%`, {
      duration: 1500,
      id: 'zoom-level'
    });
  }
};
