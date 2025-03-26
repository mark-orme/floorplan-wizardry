
/**
 * Canvas layer ordering utilities
 * Provides functions for handling z-order of canvas objects
 * @module canvasLayerOrdering
 */
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import logger from "@/utils/logger";

/**
 * Object with objectType property for type identification
 * Using FabricObject with our custom properties
 */
interface TypedFabricObject {
  /** Type identifier for specialized handling */
  objectType?: string;
  /** Stroke width for lines - made optional to prevent TypeScript error */
  strokeWidth?: number;
  /** Object type from Fabric.js */
  type: string;
}

/**
 * Arrange grid elements in the correct z-order
 * Ensures grid is in the background and markers are on top
 * 
 * @param {FabricCanvas} fabricCanvas - The Fabric canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 * @returns {void}
 */
export const arrangeGridElements = (
  fabricCanvas: FabricCanvas | null,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): void => {
  if (!fabricCanvas) {
    logger.debug("arrangeGridElements: Canvas is null");
    return;
  }
  
  const gridElements = gridLayerRef.current;
  
  if (!gridElements || gridElements.length === 0) {
    logger.debug("No grid elements to arrange");
    return;
  }
  
  // Find grid markers (scale indicators)
  const gridMarkers = gridElements.filter(obj => {
    const typedObj = obj as unknown as TypedFabricObject;
    return (typedObj.type === 'text') || 
           (typedObj.type === 'line' && typedObj.strokeWidth && typedObj.strokeWidth >= 1.2);
  });
  
  // Find grid lines
  const gridLines = gridElements.filter(obj => {
    const typedObj = obj as unknown as TypedFabricObject;
    return typedObj.type === 'line' && (!typedObj.strokeWidth || typedObj.strokeWidth < 1.2);
  });
  
  logger.debug(`Found ${gridMarkers.length} grid markers and ${gridLines.length} grid lines to arrange`);
  
  // First send all grid lines to the back
  gridLines.forEach(line => {
    if (fabricCanvas.contains(line)) {
      fabricCanvas.sendObjectToBack(line);
    }
  });
  
  // Then bring markers to the front
  gridMarkers.forEach(marker => {
    if (fabricCanvas.contains(marker)) {
      fabricCanvas.bringObjectToFront(marker);
    }
  });
  
  // Use requestRenderAll instead of renderAll for Fabric.js v6 compatibility
  fabricCanvas.requestRenderAll();
  logger.debug("Grid elements arranged successfully");
};

/**
 * Ensure all grid elements are added to canvas
 * Adds any grid elements that aren't already on the canvas
 * 
 * @param {FabricCanvas} fabricCanvas - The Fabric canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 * @returns {void}
 */
export const ensureGridElementsAdded = (
  fabricCanvas: FabricCanvas | null,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): void => {
  if (!fabricCanvas || !gridLayerRef.current) {
    return;
  }
  
  // Check each grid element and add if not on canvas
  gridLayerRef.current.forEach(gridObj => {
    if (!fabricCanvas.contains(gridObj)) {
      fabricCanvas.add(gridObj);
    }
  });
  
  // Arrange grid elements after ensuring they're all added
  arrangeGridElements(fabricCanvas, gridLayerRef);
};

export default {
  arrangeGridElements,
  ensureGridElementsAdded
};
