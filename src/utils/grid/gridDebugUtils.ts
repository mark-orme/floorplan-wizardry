
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { captureMessage } from "@/utils/sentry";
import logger from "@/utils/logger";

/**
 * Dump grid state to console for debugging
 * @param canvas - Fabric canvas to analyze
 * @param verbose - Whether to output detailed grid info
 */
export const dumpGridState = (canvas: FabricCanvas, verbose: boolean = false): void => {
  if (!canvas) {
    logger.error("Cannot dump grid state: Canvas is null");
    return;
  }

  try {
    const allObjects = canvas.getObjects();
    const gridObjects = allObjects.filter(obj => 
      (obj as any).objectType === 'grid' || (obj as any).isGrid === true
    );
    
    console.group("Grid State");
    console.log(`Total objects: ${allObjects.length}`);
    console.log(`Grid objects: ${gridObjects.length}`);
    console.log(`Canvas dimensions: ${canvas.width} × ${canvas.height}`);
    
    if (verbose) {
      console.group("Grid Objects");
      gridObjects.forEach((obj, index) => {
        console.log(`Object ${index}:`, {
          type: obj.type,
          visible: obj.visible,
          left: obj.left,
          top: obj.top,
          width: obj.width,
          height: obj.height,
          metadata: (obj as any).metadata
        });
      });
      console.groupEnd();
      
      console.group("Canvas State");
      console.log("Zoom:", canvas.getZoom());
      console.log("Viewport transform:", canvas.viewportTransform);
      console.log("Selection:", canvas.getActiveObjects());
      console.groupEnd();
    }
    
    console.groupEnd();
    
    captureMessage("Grid state dumped", "grid-debug", {
      tags: { component: "GridDebug" },
      extra: { 
        objectCount: allObjects.length,
        gridObjectCount: gridObjects.length,
        canvasDimensions: { width: canvas.width, height: canvas.height }
      }
    });
  } catch (error) {
    logger.error("Error dumping grid state:", error);
  }
};

/**
 * Create a grid on the canvas, regardless of state
 * @param canvas - Fabric canvas to create grid on
 * @returns Array of created grid objects
 */
export const forceCreateGrid = (canvas: FabricCanvas): FabricObject[] => {
  if (!canvas) {
    logger.error("Cannot force create grid: Canvas is null");
    return [];
  }
  
  try {
    logger.info("Force creating grid");
    
    // First, clear existing grid objects
    const existingGridObjects = canvas.getObjects().filter(obj => 
      (obj as any).objectType === 'grid' || (obj as any).isGrid === true
    );
    
    if (existingGridObjects.length > 0) {
      logger.info(`Removing ${existingGridObjects.length} existing grid objects`);
      canvas.remove(...existingGridObjects);
    }
    
    // Create basic grid lines
    const gridSize = 20;
    const canvasWidth = canvas.width || 800;
    const canvasHeight = canvas.height || 600;
    const gridObjects: FabricObject[] = [];
    
    // Create vertical lines
    for (let i = 0; i <= canvasWidth; i += gridSize) {
      const line = new FabricObject({
        type: 'line',
        points: [i, 0, i, canvasHeight],
        stroke: '#CCCCCC',
        strokeWidth: 1,
        selectable: false,
        evented: false
      } as any);
      
      (line as any).objectType = 'grid';
      (line as any).isGrid = true;
      
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Create horizontal lines
    for (let i = 0; i <= canvasHeight; i += gridSize) {
      const line = new FabricObject({
        type: 'line',
        points: [0, i, canvasWidth, i],
        stroke: '#CCCCCC',
        strokeWidth: 1,
        selectable: false,
        evented: false
      } as any);
      
      (line as any).objectType = 'grid';
      (line as any).isGrid = true;
      
      canvas.add(line);
      gridObjects.push(line);
    }
    
    canvas.renderAll();
    logger.info(`Created ${gridObjects.length} grid objects`);
    
    return gridObjects;
  } catch (error) {
    logger.error("Error force creating grid:", error);
    return [];
  }
};
