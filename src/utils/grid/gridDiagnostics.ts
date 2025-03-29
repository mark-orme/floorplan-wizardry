
/**
 * Grid diagnostics utilities
 * Provides functions for diagnosing grid rendering issues
 * @module grid/gridDiagnostics
 */
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { toast } from "sonner";
import logger from "../logger";

/**
 * Grid diagnostic information
 */
interface GridDiagnostics {
  timestamp: string;
  canvasInfo: {
    width: number | null;
    height: number | null;
    objectCount: number;
    backgroundColor: string | null;
    initialized: boolean;
  };
  gridInfo: {
    objectCount: number;
    objectsOnCanvas: number;
    smallGridLines: number;
    largeGridLines: number;
    markers: number;
  };
  warnings: string[];
  status: 'ok' | 'warning' | 'error';
}

/**
 * Run comprehensive diagnostics on grid rendering
 * 
 * @param {FabricCanvas} canvas - The canvas to diagnose
 * @param {FabricObject[]} gridObjects - Grid objects to check
 * @param {boolean} verbose - Whether to log verbose output
 * @returns {GridDiagnostics} Diagnostic information 
 */
export const runGridDiagnostics = (
  canvas: FabricCanvas | null,
  gridObjects: FabricObject[] | null,
  verbose: boolean = false
): GridDiagnostics => {
  const warnings: string[] = [];
  let status: 'ok' | 'warning' | 'error' = 'ok';
  
  // Initialize diagnostics object
  const diagnostics: GridDiagnostics = {
    timestamp: new Date().toISOString(),
    canvasInfo: {
      width: null,
      height: null,
      objectCount: 0,
      backgroundColor: null,
      initialized: false
    },
    gridInfo: {
      objectCount: 0,
      objectsOnCanvas: 0,
      smallGridLines: 0,
      largeGridLines: 0,
      markers: 0
    },
    warnings,
    status
  };
  
  // Check canvas
  if (!canvas) {
    warnings.push("Canvas is null");
    status = 'error';
    console.error("Grid diagnostics: Canvas is null");
    return { ...diagnostics, warnings, status };
  }
  
  // Gather canvas info
  diagnostics.canvasInfo.width = canvas.width;
  diagnostics.canvasInfo.height = canvas.height;
  diagnostics.canvasInfo.objectCount = canvas.getObjects().length;
  diagnostics.canvasInfo.backgroundColor = canvas.backgroundColor as string | null;
  diagnostics.canvasInfo.initialized = !!(canvas.width && canvas.height && canvas.width > 0 && canvas.height > 0);
  
  // Check for canvas issues
  if (!canvas.width || !canvas.height || canvas.width === 0 || canvas.height === 0) {
    warnings.push("Canvas has invalid dimensions");
    status = 'error';
    console.error("Grid diagnostics: Canvas has invalid dimensions", {
      width: canvas.width,
      height: canvas.height
    });
  }
  
  // Check grid
  if (!gridObjects || gridObjects.length === 0) {
    warnings.push("No grid objects found");
    status = status === 'error' ? 'error' : 'warning';
    console.warn("Grid diagnostics: No grid objects found");
  } else {
    diagnostics.gridInfo.objectCount = gridObjects.length;
    
    // Count objects on canvas
    let objectsOnCanvas = 0;
    let smallGridLines = 0;
    let largeGridLines = 0;
    let markers = 0;
    
    gridObjects.forEach(obj => {
      if (canvas.contains(obj)) {
        objectsOnCanvas++;
        
        // Categorize objects
        if (obj.type === 'line') {
          const line = obj as any;
          if (line.strokeWidth && line.strokeWidth > 0.5) {
            largeGridLines++;
          } else {
            smallGridLines++;
          }
        } else if (obj.type === 'text') {
          markers++;
        }
      }
    });
    
    diagnostics.gridInfo.objectsOnCanvas = objectsOnCanvas;
    diagnostics.gridInfo.smallGridLines = smallGridLines;
    diagnostics.gridInfo.largeGridLines = largeGridLines;
    diagnostics.gridInfo.markers = markers;
    
    // Check if grid objects are on canvas
    if (objectsOnCanvas === 0) {
      warnings.push("No grid objects are on canvas");
      status = 'error';
      console.error("Grid diagnostics: No grid objects are on canvas");
    } else if (objectsOnCanvas < gridObjects.length) {
      warnings.push(`Only ${objectsOnCanvas}/${gridObjects.length} grid objects are on canvas`);
      status = status === 'error' ? 'error' : 'warning';
      console.warn(`Grid diagnostics: Only ${objectsOnCanvas}/${gridObjects.length} grid objects are on canvas`);
    }
  }
  
  // Set status
  diagnostics.status = status;
  diagnostics.warnings = warnings;
  
  // Log results
  if (verbose || status !== 'ok') {
    console.log("Grid diagnostics:", diagnostics);
    
    if (status === 'error') {
      logger.error("Grid diagnostics found errors:", warnings.join(", "));
    } else if (status === 'warning') {
      logger.warn("Grid diagnostics found warnings:", warnings.join(", "));
    }
    
    // Show toast for errors
    if (status === 'error') {
      toast.error("Grid rendering issue detected");
    }
  }
  
  return diagnostics;
};

/**
 * Fix common grid rendering issues
 * 
 * @param {FabricCanvas} canvas - The canvas to fix
 * @param {FabricObject[]} gridObjects - Grid objects to fix
 * @returns {boolean} Whether any fixes were applied
 */
export const applyGridFixes = (
  canvas: FabricCanvas | null,
  gridObjects: FabricObject[] | null
): boolean => {
  if (!canvas || !gridObjects || gridObjects.length === 0) {
    return false;
  }
  
  let fixesApplied = false;
  
  // Check if grid objects need to be added to canvas
  gridObjects.forEach(obj => {
    if (!canvas.contains(obj)) {
      canvas.add(obj);
      fixesApplied = true;
    }
  });
  
  // If fixes were applied, force render
  if (fixesApplied) {
    canvas.requestRenderAll();
    logger.info("Applied grid fixes");
    console.log("Applied grid fixes");
  }
  
  return fixesApplied;
};

// Export diagnostic functions
export default {
  runGridDiagnostics,
  applyGridFixes
};
