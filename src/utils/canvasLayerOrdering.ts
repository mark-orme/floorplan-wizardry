
/**
 * Canvas layer ordering utilities
 * Provides functions for handling z-order of canvas objects
 * @module canvasLayerOrdering
 */
import { Canvas as FabricCanvas } from "fabric";

/**
 * Arrange grid elements in the correct z-order
 * Ensures grid is in the background and markers are on top
 * 
 * @param {FabricCanvas} fabricCanvas - The Fabric canvas instance
 * @param {React.MutableRefObject<any[]>} gridLayerRef - Reference to grid objects
 * @returns {void}
 */
export const arrangeGridElements = (
  fabricCanvas: FabricCanvas | null,
  gridLayerRef: React.MutableRefObject<any[]>
): void => {
  if (!fabricCanvas) return;
  
  const gridElements = gridLayerRef.current;
  
  // Find grid markers (scale indicators)
  const gridMarkers = gridElements.filter(obj => 
    obj.type === 'line' && obj.strokeWidth === 2 || 
    obj.type === 'text');
  
  // Find grid lines
  const gridLines = gridElements.filter(obj => 
    obj.type === 'line' && obj.strokeWidth !== 2);
  
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
};
