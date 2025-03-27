
/**
 * Grid creation utilities
 * Functions for creating and verifying grid elements
 * @module gridCreationUtils
 */
import { Canvas, Object as FabricObject, Line } from "fabric";

/**
 * Create an emergency grid with basic lines when other methods fail
 * @param {Canvas} canvas - The fabric canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to store grid objects
 * @returns {FabricObject[]} The created grid objects
 */
export const createBasicEmergencyGrid = (
  canvas: Canvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): FabricObject[] => {
  console.log("Creating emergency basic grid...");
  
  // If we already have grid objects, don't recreate
  if (gridLayerRef.current.length > 0) {
    console.log("Grid already exists, not creating emergency grid");
    return gridLayerRef.current;
  }
  
  // Clear any existing grid objects (safety check)
  try {
    gridLayerRef.current.forEach(obj => {
      if (canvas.contains(obj)) {
        canvas.remove(obj);
      }
    });
    gridLayerRef.current = [];
  } catch (e) {
    console.error("Error clearing existing grid:", e);
  }
  
  // Get dimensions (with safety)
  const width = canvas.width || 800;
  const height = canvas.height || 600;
  
  const gridSize = 50; // Grid spacing in pixels
  const gridObjects: FabricObject[] = [];
  
  // Create horizontal grid lines
  for (let y = 0; y <= height; y += gridSize) {
    const line = new Line([0, y, width, y], {
      stroke: '#E0E0E0',
      strokeWidth: 0.5,
      selectable: false,
      evented: false,
      objectType: 'grid'
    });
    canvas.add(line);
    gridObjects.push(line);
  }
  
  // Create vertical grid lines
  for (let x = 0; x <= width; x += gridSize) {
    const line = new Line([x, 0, x, height], {
      stroke: '#E0E0E0',
      strokeWidth: 0.5,
      selectable: false,
      evented: false,
      objectType: 'grid'
    });
    canvas.add(line);
    gridObjects.push(line);
  }
  
  // Add main axis lines
  const xAxis = new Line([0, height/2, width, height/2], {
    stroke: '#CCCCCC',
    strokeWidth: 1,
    selectable: false,
    evented: false,
    objectType: 'grid'
  });
  canvas.add(xAxis);
  gridObjects.push(xAxis);
  
  const yAxis = new Line([width/2, 0, width/2, height], {
    stroke: '#CCCCCC',
    strokeWidth: 1,
    selectable: false,
    evented: false,
    objectType: 'grid'
  });
  canvas.add(yAxis);
  gridObjects.push(yAxis);
  
  // Store the grid objects in the ref
  gridLayerRef.current = gridObjects;
  
  // Make sure grid is sent to the back
  gridObjects.forEach(obj => canvas.sendToBack(obj));
  
  // Force a render
  canvas.renderAll();
  
  console.log(`Created emergency grid with ${gridObjects.length} objects`);
  
  return gridObjects;
};

/**
 * Verify that the grid exists and is valid
 * @param {Canvas} canvas - The fabric canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 * @returns {boolean} Whether grid exists and is valid
 */
export const verifyGridExists = (
  canvas: Canvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): boolean => {
  // Check if we have grid objects
  if (gridLayerRef.current.length === 0) {
    return false;
  }
  
  // Check if grid objects are on the canvas
  const gridObjectsOnCanvas = gridLayerRef.current.filter(obj => canvas.contains(obj));
  
  return gridObjectsOnCanvas.length > 0;
};

/**
 * Get grid objects that are on the canvas
 * @param {Canvas} canvas - The fabric canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 * @returns {FabricObject[]} Grid objects on canvas
 */
export const getGridObjectsOnCanvas = (
  canvas: Canvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): FabricObject[] => {
  return gridLayerRef.current.filter(obj => canvas.contains(obj));
};
