
/**
 * Grid Diagnostics Utility
 * Provides comprehensive diagnostic tools and tests for grid functionality
 * @module utils/grid/gridDiagnostics
 */
import { Canvas as FabricCanvas, Object as FabricObject, Line } from "fabric";
import { captureError } from "../sentryUtils";
import logger from "../logger";
import { toast } from "sonner";
import { GRID_CONSTANTS } from "@/constants/gridConstants";

// Track diagnostics across attempts for pattern analysis
let diagnosticRuns: Record<string, any>[] = [];
const MAX_DIAGNOSTICS_HISTORY = 10;

/**
 * Run comprehensive grid diagnostics to identify issues
 * @param {FabricCanvas} canvas - The canvas to diagnose
 * @param {FabricObject[]} gridObjects - The grid objects to check
 * @param {boolean} verbose - Whether to log verbose diagnostics
 * @returns {Object} Diagnostic results
 */
export const runGridDiagnostics = (
  canvas: FabricCanvas | null,
  gridObjects: FabricObject[],
  verbose: boolean = false
): Record<string, any> => {
  const startTime = performance.now();
  const timestamp = new Date().toISOString();
  
  // Create diagnostic result object
  const diagnostics: Record<string, any> = {
    timestamp,
    status: 'unknown',
    canvasInfo: {},
    gridInfo: {},
    issues: [],
    recommendations: [],
    renderingInfo: {}
  };
  
  // Check if canvas exists
  if (!canvas) {
    diagnostics.status = 'critical';
    diagnostics.issues.push('Canvas is null or undefined');
    diagnostics.recommendations.push('Ensure canvas initialization completes before grid creation');
    
    logDiagnostics(diagnostics, verbose);
    return diagnostics;
  }
  
  // Canvas information
  diagnostics.canvasInfo = {
    width: canvas.width,
    height: canvas.height,
    valid: Boolean(canvas.width && canvas.height && canvas.width > 0 && canvas.height > 0),
    objectCount: canvas.getObjects().length,
    disposed: Boolean((canvas as any)._isDisposed),
    renderOnAddRemove: canvas.renderOnAddRemove,
    contextExists: Boolean((canvas as any).contextContainer)
  };
  
  // Check canvas validity
  if (!diagnostics.canvasInfo.valid) {
    diagnostics.status = 'critical';
    diagnostics.issues.push(`Canvas has invalid dimensions: ${canvas.width}x${canvas.height}`);
    diagnostics.recommendations.push('Ensure canvas is properly initialized with valid dimensions');
  }
  
  // Grid information
  const objectsOnCanvas = gridObjects.filter(obj => {
    try {
      return canvas.contains(obj);
    } catch (error) {
      return false;
    }
  }).length;
  
  diagnostics.gridInfo = {
    total: gridObjects.length,
    objectsOnCanvas,
    missingObjects: gridObjects.length - objectsOnCanvas,
    percentOnCanvas: gridObjects.length ? Math.round((objectsOnCanvas / gridObjects.length) * 100) : 0
  };
  
  // Check grid status
  if (gridObjects.length === 0) {
    diagnostics.status = 'critical';
    diagnostics.issues.push('No grid objects exist');
    diagnostics.recommendations.push('Create grid objects using createGridElements');
  } else if (objectsOnCanvas === 0) {
    diagnostics.status = 'critical';
    diagnostics.issues.push('Grid objects exist but none are on canvas');
    diagnostics.recommendations.push('Add existing grid objects to canvas or recreate grid');
  } else if (objectsOnCanvas < gridObjects.length) {
    diagnostics.status = 'warning';
    diagnostics.issues.push(`${gridObjects.length - objectsOnCanvas} grid objects are missing from canvas`);
    diagnostics.recommendations.push('Re-add missing grid objects to canvas');
  } else {
    diagnostics.status = 'ok';
  }
  
  // Rendering information
  try {
    const context = (canvas as any).contextContainer;
    diagnostics.renderingInfo = {
      contextExists: Boolean(context),
      renderCallsAvailable: typeof canvas.renderAll === 'function' && typeof canvas.requestRenderAll === 'function',
      lastRenderTime: (canvas as any)._lastRenderTime || 'unknown'
    };
    
    if (!context) {
      diagnostics.status = 'critical';
      diagnostics.issues.push('Canvas rendering context is missing');
      diagnostics.recommendations.push('Recreate canvas with valid context');
    }
  } catch (error) {
    diagnostics.renderingInfo = {
      error: String(error)
    };
    diagnostics.issues.push('Error checking rendering info: ' + String(error));
  }
  
  // Calculate timing
  diagnostics.timing = {
    diagnosticTime: performance.now() - startTime
  };
  
  // Store diagnostic run (limited history)
  diagnosticRuns.unshift(diagnostics);
  if (diagnosticRuns.length > MAX_DIAGNOSTICS_HISTORY) {
    diagnosticRuns.pop();
  }
  
  // Log diagnostics
  logDiagnostics(diagnostics, verbose);
  
  return diagnostics;
};

/**
 * Apply fixes based on diagnostic results
 * @param {FabricCanvas} canvas - The canvas to fix
 * @param {FabricObject[]} gridObjects - The grid objects to fix
 * @returns {boolean} Whether fixes were applied
 */
export const applyGridFixes = (
  canvas: FabricCanvas,
  gridObjects: FabricObject[]
): boolean => {
  const diagnostics = runGridDiagnostics(canvas, gridObjects, true);
  let fixesApplied = false;
  
  try {
    // If we have grid objects but they're not on canvas, add them
    if (diagnostics.gridInfo.total > 0 && diagnostics.gridInfo.objectsOnCanvas === 0) {
      console.log("Fixing missing grid - adding all grid objects to canvas");
      
      // Add all grid objects to canvas
      gridObjects.forEach(obj => {
        if (!canvas.contains(obj)) {
          canvas.add(obj);
        }
      });
      
      // Force render
      canvas.requestRenderAll();
      fixesApplied = true;
      
      toast.success("Grid display fixed", {
        id: "grid-fix",
        duration: 2000
      });
    }
    
    // If only some objects are missing, add just those
    else if (diagnostics.gridInfo.missingObjects > 0) {
      console.log(`Fixing partially missing grid - adding ${diagnostics.gridInfo.missingObjects} objects`);
      
      // Find and add missing objects
      gridObjects.forEach(obj => {
        if (!canvas.contains(obj)) {
          canvas.add(obj);
        }
      });
      
      // Force render
      canvas.requestRenderAll();
      fixesApplied = true;
    }
    
    // If canvas has invalid dimensions but exists
    if (!diagnostics.canvasInfo.valid && canvas) {
      console.log("Canvas has invalid dimensions - forcing minimum dimensions");
      
      // Force minimum dimensions
      if (!canvas.width || canvas.width < 100) {
        console.log("Setting minimum canvas width");
        canvas.setWidth(800);
      }
      
      if (!canvas.height || canvas.height < 100) {
        console.log("Setting minimum canvas height");
        canvas.setHeight(600);
      }
      
      fixesApplied = true;
      
      // Force canvas to update
      canvas.renderAll();
    }
    
    // Log result to Sentry
    if (fixesApplied) {
      captureError(
        new Error("Grid fixes applied successfully"),
        "grid-fixes-applied",
        {
          level: "info",
          extra: {
            diagnostics,
            fixTime: new Date().toISOString()
          }
        }
      );
    }
    
    return fixesApplied;
  } catch (error) {
    console.error("Error applying grid fixes:", error);
    
    captureError(error, "grid-fix-error", {
      level: "error",
      extra: { diagnostics }
    });
    
    return false;
  }
};

/**
 * Log grid diagnostics
 * @param {Object} diagnostics - Diagnostic results
 * @param {boolean} verbose - Whether to log verbose output
 */
function logDiagnostics(diagnostics: Record<string, any>, verbose: boolean): void {
  // Always log critical issues
  if (diagnostics.status === 'critical') {
    console.error("🚨 CRITICAL GRID ISSUES:", diagnostics.issues);
    
    // Report to Sentry
    captureError(
      new Error(`Critical grid issues: ${diagnostics.issues.join(', ')}`),
      "grid-critical-issues",
      {
        level: "error",
        extra: diagnostics
      }
    );
  } 
  // Log warnings if verbose or there are issues
  else if (verbose || diagnostics.status === 'warning') {
    console.warn("⚠️ Grid diagnostic:", diagnostics);
  }
  // Log success if verbose
  else if (verbose && diagnostics.status === 'ok') {
    console.log("✅ Grid diagnostic: OK", diagnostics);
  }
  
  // Log to the logger service
  if (diagnostics.status !== 'ok') {
    logger.warn(`Grid diagnostic: ${diagnostics.status}`, diagnostics);
  } else if (verbose) {
    logger.info("Grid diagnostic: OK", diagnostics);
  }
}

/**
 * Get diagnostic history for analysis
 * @returns {Array} Diagnostic history
 */
export const getDiagnosticHistory = (): Record<string, any>[] => {
  return [...diagnosticRuns];
};

/**
 * Verify if grid is visible and properly rendered
 * @param {FabricCanvas} canvas - The canvas to check
 * @param {FabricObject[]} gridObjects - The grid objects to check
 * @returns {boolean} Whether grid is properly visible
 */
export const verifyGridVisibility = (
  canvas: FabricCanvas | null,
  gridObjects: FabricObject[]
): boolean => {
  if (!canvas) return false;
  
  try {
    const diagnostics = runGridDiagnostics(canvas, gridObjects, false);
    
    // Consider grid visible if most objects are on canvas
    const visibilityThreshold = 0.9; // 90% of objects must be visible
    const visibilityRatio = diagnostics.gridInfo.objectsOnCanvas / diagnostics.gridInfo.total;
    
    return visibilityRatio >= visibilityThreshold;
  } catch (error) {
    console.error("Error verifying grid visibility:", error);
    return false;
  }
};

/**
 * Emergency fix - try to make grid visible when all else fails
 * @param {FabricCanvas} canvas - The canvas to fix
 * @param {FabricObject[]} gridObjects - The grid objects to fix
 * @returns {boolean} Whether emergency fix was successful
 */
export const emergencyGridFix = (
  canvas: FabricCanvas | null,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): boolean => {
  if (!canvas) return false;
  
  try {
    console.log("🚨 Applying emergency grid fix");
    
    // Force canvas dimensions if they're invalid
    if (!canvas.width || canvas.width <= 0) {
      canvas.setWidth(800);
    }
    
    if (!canvas.height || canvas.height <= 0) {
      canvas.setHeight(600);
    }
    
    // Remove all existing grid objects first
    const gridObjects = gridLayerRef.current;
    gridObjects.forEach(obj => {
      if (canvas.contains(obj)) {
        canvas.remove(obj);
      }
    });
    
    // Create emergency grid lines
    const emergencyGrid: FabricObject[] = [];
    
    // Get grid size from constants
    const smallGridSize = GRID_CONSTANTS.SMALL_GRID_SIZE;
    const largeGridSize = GRID_CONSTANTS.LARGE_GRID_SIZE;
    
    // Function to create a single grid line
    const createGridLine = (coords: [number, number, number, number], isLarge: boolean) => {
      const line = new Line(coords, {
        stroke: isLarge ? GRID_CONSTANTS.LARGE_GRID_COLOR : GRID_CONSTANTS.SMALL_GRID_COLOR,
        strokeWidth: isLarge ? GRID_CONSTANTS.LARGE_GRID_WIDTH : GRID_CONSTANTS.SMALL_GRID_WIDTH,
        selectable: false,
        evented: false,
        opacity: GRID_CONSTANTS.GRID_OPACITY
      });
      
      // Add custom properties
      (line as any).objectType = 'grid';
      (line as any).gridType = isLarge ? 'large' : 'small';
      
      canvas.add(line);
      emergencyGrid.push(line);
    };
    
    // Create vertical lines (large grid only for performance)
    for (let x = 0; x <= canvas.width; x += largeGridSize) {
      createGridLine([x, 0, x, canvas.height], true);
    }
    
    // Create horizontal lines (large grid only for performance)
    for (let y = 0; y <= canvas.height; y += largeGridSize) {
      createGridLine([0, y, canvas.width, y], true);
    }
    
    // Update grid reference
    gridLayerRef.current = emergencyGrid;
    
    // Force render
    canvas.requestRenderAll();
    
    // Log success
    console.log(`✅ Emergency grid created with ${emergencyGrid.length} lines`);
    toast.success("Emergency grid created", {
      duration: 2000
    });
    
    // Report to Sentry
    captureError(
      new Error("Emergency grid fix applied"),
      "grid-emergency-fix",
      {
        level: "warning",
        extra: {
          linesCreated: emergencyGrid.length,
          canvasDimensions: `${canvas.width}x${canvas.height}`
        }
      }
    );
    
    return true;
  } catch (error) {
    console.error("Emergency grid fix failed:", error);
    
    captureError(error, "grid-emergency-fix-error", {
      level: "error"
    });
    
    return false;
  }
};
