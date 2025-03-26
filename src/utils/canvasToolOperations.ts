
/**
 * Canvas tool operations
 * @module canvasToolOperations
 */
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { toast } from "sonner";
import { DrawingTool } from "@/hooks/useCanvasState";
import { initializeDrawingBrush } from "./fabricBrush";
import { enablePanning, enableSelection, disableSelection } from "./fabricInteraction";
import logger from "./logger";

/**
 * Type definition for fabric objects with tool-specific properties
 */
interface ToolOperationObject {
  /** Type of the object */
  type: string;
  /** Whether the object is selectable */
  selectable: boolean;
  /** Cursor to show when hovering */
  hoverCursor?: string;
  /** Type of object for custom handling */
  objectType?: string;
}

/**
 * Clear all drawings from canvas while preserving the grid
 * Removes all non-grid objects from the canvas
 * 
 * @param {FabricCanvas | null} canvas - The fabric canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 * @param {Function} createGrid - Function to recreate grid if needed
 */
export const clearDrawings = (
  canvas: FabricCanvas | null,
  gridLayerRef: React.MutableRefObject<FabricObject[]>,
  createGrid: (canvas: FabricCanvas) => FabricObject[]
): void => {
  if (!canvas) return;
  
  // Pause rendering for performance
  canvas.renderOnAddRemove = false;
  
  try {
    // Get all objects that are not part of the grid
    const objects = canvas.getObjects().filter(obj => {
      const typedObj = obj as unknown as ToolOperationObject;
      return !typedObj.objectType?.includes('grid');
    });
    
    // Remove non-grid objects
    objects.forEach(obj => canvas.remove(obj));
    
    // Ensure grid is still intact, recreate if needed
    if (gridLayerRef.current.length === 0) {
      createGrid(canvas);
    }
    
    // Resume rendering and refresh
    canvas.renderOnAddRemove = true;
    canvas.requestRenderAll();
    
    // Show success toast
    toast.success("Canvas cleared successfully");
  } catch (error) {
    logger.error("Error clearing canvas:", error);
    
    // Show error toast
    toast.error("Failed to clear canvas");
    
    // Resume rendering in case of error
    canvas.renderOnAddRemove = true;
  }
};

/**
 * Change current drawing tool
 * Updates canvas mode and cursor based on selected tool
 * 
 * @param {DrawingTool} tool - The selected drawing tool
 * @param {FabricCanvas | null} canvas - The fabric canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 * @param {number} lineThickness - Current line thickness
 * @param {string} lineColor - Current line color
 * @param {Function} setTool - State setter for current tool
 */
export const handleToolChange = (
  tool: DrawingTool,
  canvas: FabricCanvas | null,
  gridLayerRef: React.MutableRefObject<FabricObject[]>,
  lineThickness: number,
  lineColor: string,
  setTool: React.Dispatch<React.SetStateAction<DrawingTool>>
): void => {
  if (!canvas) return;
  
  logger.info(`Changing tool to: ${tool}`);
  
  // Update state
  setTool(tool);
  
  // Configure canvas based on selected tool
  switch (tool) {
    case "hand":
      // Enable panning mode for hand tool
      canvas.isDrawingMode = false;
      enablePanning(canvas, true);
      break;
      
    case "select":
      // Enable selection mode
      canvas.isDrawingMode = false;
      enablePanning(canvas, false);
      enableSelection(canvas);
      break;
      
    case "wall":
    case "door":
    case "window":
    case "furniture":
    case "straightLine":
    case "area":
      // Drawing tools - enable drawing mode with appropriate settings
      canvas.isDrawingMode = true;
      enablePanning(canvas, false);
      disableSelection(canvas);
      
      if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.color = lineColor;
        canvas.freeDrawingBrush.width = lineThickness;
      } else {
        // Initialize brush if it doesn't exist
        const brush = initializeDrawingBrush(canvas);
        if (brush) {
          brush.color = lineColor;
          brush.width = lineThickness;
          canvas.freeDrawingBrush = brush;
        }
      }
      break;
      
    default:
      // Default to selection mode for unknown tools
      canvas.isDrawingMode = false;
      enablePanning(canvas, false);
      enableSelection(canvas);
      break;
  }
  
  // Render changes
  canvas.requestRenderAll();
};

/**
 * Handle zoom operations
 * Zooms canvas in or out in 10% increments
 * 
 * @param {"in" | "out"} direction - Zoom direction
 * @param {FabricCanvas | null} canvas - The fabric canvas instance
 * @param {number} zoomLevel - Current zoom level
 * @param {Function} setZoomLevel - State setter for zoom level
 */
export const handleZoom = (
  direction: "in" | "out",
  canvas: FabricCanvas | null,
  zoomLevel: number,
  setZoomLevel: React.Dispatch<React.SetStateAction<number>>
): void => {
  if (!canvas) return;
  
  // Calculate new zoom level (in 10% increments)
  let newZoom = zoomLevel;
  
  if (direction === "in") {
    // Zoom in (max 5x)
    newZoom = Math.min(5, zoomLevel + 0.1);
  } else {
    // Zoom out (min 0.1x)
    newZoom = Math.max(0.1, zoomLevel - 0.1);
  }
  
  // Only update if zoom level changed
  if (newZoom !== zoomLevel) {
    // Apply zoom centered on current viewport
    const center = canvas.getCenter();
    canvas.zoomToPoint({ x: center.left, y: center.top }, newZoom);
    
    // Update state
    setZoomLevel(newZoom);
    
    // Trigger zoom change event
    canvas.fire('zoom:changed' as any);
    
    // Render changes
    canvas.requestRenderAll();
    
    logger.info(`Zoom level changed to: ${newZoom.toFixed(1)}x`);
  }
};
