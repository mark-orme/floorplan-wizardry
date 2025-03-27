
/**
 * Grid debugging utilities
 * Helps identify and resolve grid rendering issues
 * @module gridDebugUtils
 */
import { Canvas, Object as FabricObject } from "fabric";
import logger from "../logger";
import { toast } from "sonner";
import { createBasicEmergencyGrid } from "../gridCreationUtils";

/**
 * Dump grid state to console for debugging
 * @param canvas - The fabric canvas
 * @param gridLayerRef - Reference to grid objects
 */
export const dumpGridState = (
  canvas: Canvas | null,
  gridLayerRef: React.MutableRefObject<FabricObject[]> | null
): void => {
  // Print canvas information
  console.log("===== GRID DEBUG INFO =====");
  
  if (!canvas) {
    console.log("Canvas: NULL");
    return;
  }
  
  // Canvas dimensions and state
  console.log("Canvas dimensions:", {
    width: canvas.getWidth?.() || canvas.width,
    height: canvas.getHeight?.() || canvas.height,
    clientWidth: canvas.getElement()?.clientWidth,
    clientHeight: canvas.getElement()?.clientHeight,
    zoomLevel: canvas.getZoom?.()
  });
  
  console.log("Canvas state:", {
    objectCount: canvas.getObjects().length,
    isDrawingMode: canvas.isDrawingMode,
    initialized: (canvas as any).initialized || false,
    viewportTransform: canvas.viewportTransform
  });
  
  // Grid object information
  if (!gridLayerRef) {
    console.log("Grid layer reference: NULL");
    return;
  }
  
  // Check grid objects
  const gridObjectsOnCanvas = gridLayerRef.current.filter(obj => canvas.contains(obj)).length;
  console.log("Grid objects:", {
    count: gridLayerRef.current.length,
    onCanvas: gridObjectsOnCanvas,
    percentage: gridLayerRef.current.length > 0 
      ? Math.round((gridObjectsOnCanvas / gridLayerRef.current.length) * 100) + '%' 
      : '0%'
  });
  
  // Sample a grid object if available
  if (gridLayerRef.current.length > 0) {
    const sampleObject = gridLayerRef.current[0];
    console.log("Sample grid object:", {
      type: sampleObject.type,
      visible: sampleObject.visible,
      selectable: sampleObject.selectable,
      stroke: (sampleObject as any).stroke,
      onCanvas: canvas.contains(sampleObject)
    });
  } else {
    console.log("No grid objects available to sample");
  }
  
  // Diagnose specific issues
  if (canvas.width === 0 || canvas.height === 0) {
    console.error("🚨 CRITICAL: Canvas has zero dimensions - grid cannot be created!");
  }
  
  if (gridLayerRef.current.length === 0) {
    console.error("🚨 CRITICAL: No grid objects exist!");
  } else if (gridObjectsOnCanvas === 0) {
    console.error("🚨 CRITICAL: Grid objects exist but NONE are on canvas!");
  } else if (gridObjectsOnCanvas < gridLayerRef.current.length) {
    console.warn("⚠️ WARNING: Some grid objects are missing from canvas!");
  }
  
  console.log("=========================");
};

/**
 * Attempt to recover grid by recreating it with emergency measures
 * @param canvas - The fabric canvas
 * @param gridLayerRef - Reference to grid objects
 * @param createGridFn - Function to create grid
 * @returns Whether recovery was successful
 */
export const attemptGridRecovery = (
  canvas: Canvas | null,
  gridLayerRef: React.MutableRefObject<FabricObject[]>,
  createGridFn: ((canvas: Canvas) => FabricObject[]) | null = null
): boolean => {
  if (!canvas) {
    logger.error("Cannot recover grid: Canvas is null");
    console.error("Cannot recover grid: Canvas is null");
    return false;
  }
  
  try {
    // Clear any existing grid objects from canvas
    if (gridLayerRef.current.length > 0) {
      console.log(`Removing ${gridLayerRef.current.length} existing grid objects from canvas`);
      gridLayerRef.current.forEach(obj => {
        if (canvas.contains(obj)) {
          canvas.remove(obj);
        }
      });
      gridLayerRef.current = [];
    }
    
    // Check canvas dimensions and report any issues
    const width = canvas.getWidth?.() || canvas.width;
    const height = canvas.getHeight?.() || canvas.height;
    
    if (!width || !height || width <= 0 || height <= 0) {
      console.error(`Canvas has invalid dimensions: ${width}x${height}`);
      toast.error("Grid recovery failed: Canvas has invalid dimensions");
      return false;
    }
    
    console.log(`Attempting grid recovery on canvas (${width}x${height})`);
    
    // Try using the provided creation function first
    let gridObjects: FabricObject[] = [];
    
    if (createGridFn) {
      try {
        gridObjects = createGridFn(canvas);
        console.log(`Creation function returned ${gridObjects.length} objects`);
      } catch (createError) {
        console.error("Error in provided grid creation function:", createError);
      }
    }
    
    // If the creation function failed or wasn't provided, use emergency grid
    if (!gridObjects || gridObjects.length === 0) {
      console.log("Using emergency grid creation as fallback");
      gridObjects = createBasicEmergencyGrid(canvas, gridLayerRef);
    } else {
      // Store the successfully created grid objects
      gridLayerRef.current = gridObjects;
    }
    
    // Check success
    if (gridObjects && gridObjects.length > 0) {
      // Force render
      canvas.requestRenderAll();
      console.log(`Grid recovery successful: Created ${gridObjects.length} objects`);
      toast.success(`Grid recovered with ${gridObjects.length} objects`);
      return true;
    } else {
      logger.error("Grid recovery failed: No objects created");
      console.error("Grid recovery failed: No objects were created");
      toast.error("Grid recovery failed");
      return false;
    }
  } catch (error) {
    logger.error("Error during grid recovery:", error);
    console.error("Error during grid recovery:", error);
    toast.error("Grid recovery failed with an error");
    return false;
  }
};

/**
 * Force create grid with multiple strategies
 * A more aggressive approach to ensure grid is created
 * 
 * @param canvas - The fabric canvas 
 * @param gridLayerRef - Reference to grid objects
 * @returns Whether force creation was successful
 */
export const forceCreateGrid = (
  canvas: Canvas | null,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): boolean => {
  if (!canvas) {
    console.error("Cannot force create grid: Canvas is null");
    return false;
  }
  
  console.log("🔄 Force creating grid with multiple strategies...");
  
  try {
    // Ensure canvas has valid dimensions
    const width = canvas.getWidth?.() || canvas.width || 800;
    const height = canvas.getHeight?.() || canvas.height || 600;
    
    // Make sure canvas has real dimensions
    if (width <= 0 || height <= 0) {
      console.error("Force grid creation failed: Canvas has zero dimensions");
      canvas.setWidth(800);
      canvas.setHeight(600);
      console.log("Force set canvas dimensions to 800x600");
    }
    
    // Clear any existing grid
    console.log("Clearing existing grid objects");
    if (gridLayerRef.current.length > 0) {
      gridLayerRef.current.forEach(obj => {
        if (canvas.contains(obj)) {
          canvas.remove(obj);
        }
      });
      gridLayerRef.current = [];
    }
    
    // Create the emergency grid directly
    console.log("Creating basic emergency grid");
    const gridObjects = createBasicEmergencyGrid(canvas, gridLayerRef);
    
    if (gridObjects && gridObjects.length > 0) {
      console.log(`Force grid creation succeeded with ${gridObjects.length} objects`);
      
      // Ensure all objects are on canvas and send to back
      gridObjects.forEach(obj => {
        if (!canvas.contains(obj)) {
          canvas.add(obj);
        }
        canvas.sendToBack(obj);
      });
      
      // Force a render
      canvas.requestRenderAll();
      
      toast.success(`Created ${gridObjects.length} grid objects`);
      return true;
    } else {
      console.error("Force grid creation failed: No objects were created");
      toast.error("Force grid creation failed");
      return false;
    }
  } catch (error) {
    console.error("Error during force grid creation:", error);
    toast.error("Force grid creation failed with an error");
    return false;
  }
};
