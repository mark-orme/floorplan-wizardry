
/**
 * Grid debugging utilities
 * @module grid/gridDebugUtils
 */
import { Canvas as FabricCanvas, Object as FabricObject, Line } from "fabric";
import { DebugInfoState } from "@/types";

/**
 * Dump the current state of the grid to the console
 * @param {FabricCanvas} canvas - The canvas instance
 * @param {FabricObject[]} gridLayer - Array of grid objects
 * @param {string} [message] - Optional message to prefix the dump
 * @returns {void}
 */
export const dumpGridState = (
  canvas: FabricCanvas,
  gridLayer: FabricObject[],
  message?: string
): void => {
  if (!canvas) {
    console.warn("Cannot dump grid state: Canvas is null");
    return;
  }

  console.group(message || "Grid State Dump");
  
  // Canvas state
  console.log("Canvas:", {
    width: canvas.width,
    height: canvas.height,
    viewportTransform: canvas.viewportTransform,
    zoom: canvas.getZoom(),
    objects: canvas.getObjects().length
  });
  
  // Grid layer state
  console.log("Grid Layer:", {
    objects: Array.isArray(gridLayer) ? gridLayer.length : "Not an array",
    visible: Array.isArray(gridLayer) ? gridLayer.some(obj => obj.visible) : false
  });
  
  // Object counts by type
  const objectsByType: Record<string, number> = {};
  canvas.getObjects().forEach(obj => {
    const type = obj.type || "unknown";
    objectsByType[type] = (objectsByType[type] || 0) + 1;
  });
  console.log("Objects by type:", objectsByType);
  
  console.groupEnd();
};

/**
 * Create a basic emergency grid when normal grid creation fails
 * @param {FabricCanvas} canvas - The canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects array
 * @param {number} [spacing=50] - The grid spacing
 * @param {string} [color="#FF0000"] - The grid color (red by default for emergency)
 * @returns {FabricObject[]} The created grid objects
 */
export const createBasicEmergencyGrid = (
  canvas: FabricCanvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>,
  spacing: number = 50,
  color: string = "#FF0000"
): FabricObject[] => {
  if (!canvas) {
    console.error("Cannot create emergency grid: Canvas is null");
    return [];
  }

  const width = canvas.width || 800;
  const height = canvas.height || 600;
  const gridObjects: FabricObject[] = [];

  try {
    // Create horizontal lines
    for (let y = 0; y <= height; y += spacing) {
      const line = new Line([0, y, width, y], {
        stroke: color,
        strokeWidth: 1,
        selectable: false,
        evented: false,
        strokeDashArray: [5, 5],
        opacity: 0.5
      });
      
      // Fix: sendToBack() doesn't exist on Line, use canvas methods instead
      canvas.add(line);
      canvas.sendObjectToBack(line);
      
      gridObjects.push(line);
    }

    // Create vertical lines
    for (let x = 0; x <= width; x += spacing) {
      const line = new Line([x, 0, x, height], {
        stroke: color,
        strokeWidth: 1,
        selectable: false,
        evented: false,
        strokeDashArray: [5, 5],
        opacity: 0.5
      });
      
      // Fix: sendToBack() doesn't exist on Line, use canvas methods instead
      canvas.add(line);
      canvas.sendObjectToBack(line);
      
      gridObjects.push(line);
    }

    console.warn(
      "Emergency grid created with",
      gridObjects.length,
      "lines. This is a fallback measure."
    );

    // Update the grid layer reference
    if (gridLayerRef && typeof gridLayerRef === 'object') {
      gridLayerRef.current = gridObjects;
    }

    return gridObjects;
  } catch (error) {
    console.error("Failed to create emergency grid:", error);
    return [];
  }
};

/**
 * Force creation of a grid on the canvas
 * @param {FabricCanvas} canvas - The canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 * @returns {FabricObject[]} The created grid objects
 */
export const forceCreateGrid = (
  canvas: FabricCanvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): FabricObject[] => {
  if (!canvas) {
    console.error("Cannot force create grid: Canvas is null");
    return [];
  }

  try {
    // Remove any existing grid objects
    if (gridLayerRef.current && gridLayerRef.current.length > 0) {
      gridLayerRef.current.forEach(obj => {
        if (canvas.contains(obj)) {
          canvas.remove(obj);
        }
      });
      gridLayerRef.current = [];
    }

    // Create a new emergency grid
    const gridObjects = createBasicEmergencyGrid(canvas, gridLayerRef);
    
    // Force render
    canvas.requestRenderAll();
    
    console.log(`Force created grid with ${gridObjects.length} objects`);
    return gridObjects;
  } catch (error) {
    console.error("Error in forceCreateGrid:", error);
    return [];
  }
};

/**
 * Update debug info with grid status
 * @param {DebugInfoState} debugInfo - Current debug info state
 * @param {FabricObject[]} gridLayer - Grid layer objects
 * @param {boolean} success - Whether grid operation was successful
 * @returns {DebugInfoState} Updated debug info
 */
export const updateGridDebugInfo = (
  debugInfo: DebugInfoState,
  gridLayer: FabricObject[],
  success: boolean
): DebugInfoState => {
  return {
    ...debugInfo,
    gridCreated: success,
    gridObjectCount: Array.isArray(gridLayer) ? gridLayer.length : 0,
    lastGridCreationTime: Date.now(),
    performanceStats: {
      ...debugInfo.performanceStats,
      gridCreationTime: Date.now() - (debugInfo.lastGridCreationTime || Date.now())
    }
  };
};
