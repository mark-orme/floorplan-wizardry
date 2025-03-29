
/**
 * Grid debugging utilities
 * Advanced debugging and testing tools for grid functionality
 * @module utils/grid/gridDebugUtils
 */
import { Canvas as FabricCanvas, Object as FabricObject, Line } from "fabric";
import { captureError } from "../sentryUtils";
import logger from "../logger";
import { GRID_CONSTANTS } from "@/constants/gridConstants";

// Track grid debug stats across page loads
export const gridDebugStats = {
  attempts: 0,
  successfulCreations: 0,
  failedCreations: 0,
  errorMessages: [] as string[],
  lastError: null as Error | null,
  lastSuccessTime: null as number | null,
  creationTimes: [] as number[],
  gridStats: [] as Record<string, any>[]
};

/**
 * Create basic emergency grid directly
 * Uses minimal approach for maximum reliability
 * 
 * @param {FabricCanvas} canvas - Canvas to create grid on
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 * @returns {FabricObject[]} Created grid objects
 */
export const createBasicEmergencyGrid = (
  canvas: FabricCanvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): FabricObject[] => {
  console.log("Creating basic emergency grid");
  
  try {
    // Start performance measurement
    const startTime = performance.now();
    
    // Set basic constants
    const gridSize = 50; // Large grid only for emergency
    const gridColor = "#aaaaaa";
    const gridWidth = 0.5;
    
    // Clear existing grid if any
    if (gridLayerRef.current.length > 0) {
      gridLayerRef.current.forEach(obj => {
        if (canvas.contains(obj)) {
          canvas.remove(obj);
        }
      });
      gridLayerRef.current = [];
    }
    
    // Create emergency grid
    const gridObjects: FabricObject[] = [];
    
    // Disable rendering during creation for better performance
    const originalRenderOnAddRemove = canvas.renderOnAddRemove;
    canvas.renderOnAddRemove = false;
    
    // Create vertical lines with basic constructor
    for (let x = 0; x <= canvas.width; x += gridSize) {
      const line = new Line([x, 0, x, canvas.height], {
        stroke: gridColor,
        strokeWidth: gridWidth,
        selectable: false,
        evented: false
      });
      
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Create horizontal lines with basic constructor
    for (let y = 0; y <= canvas.height; y += gridSize) {
      const line = new Line([0, y, canvas.width, y], {
        stroke: gridColor,
        strokeWidth: gridWidth,
        selectable: false,
        evented: false
      });
      
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Restore rendering setting and force render
    canvas.renderOnAddRemove = originalRenderOnAddRemove;
    canvas.requestRenderAll();
    
    // Store the created grid in the reference
    gridLayerRef.current = gridObjects;
    
    // Track timing
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    // Update debug stats
    gridDebugStats.attempts++;
    gridDebugStats.successfulCreations++;
    gridDebugStats.lastSuccessTime = Date.now();
    gridDebugStats.creationTimes.push(duration);
    
    console.log(`Emergency grid created with ${gridObjects.length} objects in ${duration.toFixed(1)}ms`);
    
    return gridObjects;
  } catch (error) {
    console.error("Error creating emergency grid:", error);
    
    // Update debug stats
    gridDebugStats.attempts++;
    gridDebugStats.failedCreations++;
    gridDebugStats.errorMessages.push(String(error));
    gridDebugStats.lastError = error instanceof Error ? error : new Error(String(error));
    
    // Report to Sentry
    captureError(error, "emergency-grid-creation-error", {
      level: "error",
      tags: {
        component: "gridDebugUtils",
        function: "createBasicEmergencyGrid"
      }
    });
    
    return [];
  }
};

/**
 * Dump grid state to console and Sentry
 * Provides comprehensive diagnostic information
 * 
 * @param {FabricCanvas} canvas - Canvas to diagnose
 * @param {FabricObject[]} gridObjects - Grid objects to inspect
 */
export const dumpGridState = (
  canvas: FabricCanvas,
  gridObjects: FabricObject[]
): Record<string, any> | null => {
  try {
    // Collect canvas info
    const canvasInfo = {
      width: canvas.width,
      height: canvas.height,
      totalObjects: canvas.getObjects().length,
      viewportTransform: canvas.viewportTransform,
      zoom: canvas.getZoom(),
      rendered: 'unknown', // Changed from using isRendered
      renderOnAddRemove: canvas.renderOnAddRemove
    };
    
    // Collect grid info
    const gridInfo = {
      total: gridObjects.length,
      onCanvas: gridObjects.filter(obj => canvas.contains(obj)).length,
      visible: gridObjects.filter(obj => obj.visible !== false).length,
      types: gridObjects.reduce((acc, obj) => {
        const type = obj.type || 'unknown';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
    
    // Sample a few grid objects
    const sampleObjects = gridObjects.slice(0, 3).map(obj => ({
      type: obj.type,
      visible: obj.visible !== false,
      onCanvas: canvas.contains(obj),
      coords: obj.type === 'line' ? 
        [(obj as any).x1, (obj as any).y1, (obj as any).x2, (obj as any).y2] : 
        [obj.left, obj.top, obj.width, obj.height]
    }));
    
    // Build diagnostic object
    const diagnostics = {
      timestamp: new Date().toISOString(),
      canvas: canvasInfo,
      grid: gridInfo,
      sampleObjects,
      constants: {
        SMALL_GRID_SIZE: GRID_CONSTANTS.SMALL_GRID_SIZE,
        LARGE_GRID_SIZE: GRID_CONSTANTS.LARGE_GRID_SIZE
      },
      debugStats: { ...gridDebugStats }
    };
    
    // Log to console
    console.group("🔍 Grid State Dump");
    console.log("Canvas:", canvasInfo);
    console.log("Grid:", gridInfo);
    console.log("Sample Objects:", sampleObjects);
    console.groupEnd();
    
    // Report to Sentry as diagnostic
    captureError(
      new Error("Grid state dump"),
      "grid-state-dump",
      {
        level: "info",
        extra: diagnostics
      }
    );
    
    // Update debug stats
    gridDebugStats.gridStats.push({
      timestamp: Date.now(),
      gridCount: gridInfo.total,
      onCanvas: gridInfo.onCanvas
    });
    
    // Only keep last 10 stats
    if (gridDebugStats.gridStats.length > 10) {
      gridDebugStats.gridStats.shift();
    }
    
    return diagnostics;
  } catch (error) {
    console.error("Error dumping grid state:", error);
    return null;
  }
};

/**
 * Force creation of grid by trying multiple strategies
 * Last resort utility for fixing grids
 * 
 * @param {FabricCanvas} canvas - Canvas to create grid on
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 * @returns {boolean} Whether grid creation was successful
 */
export const forceCreateGrid = (
  canvas: FabricCanvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): FabricObject[] => {
  console.log("Forcing grid creation with multiple strategies");
  
  try {
    // First try standard emergency grid
    let success = false;
    let gridObjects = createBasicEmergencyGrid(canvas, gridLayerRef);
    
    if (gridObjects.length > 0) {
      console.log("Standard emergency grid created successfully");
      success = true;
    } else {
      // Try alternative approach with default fabric constructor
      console.log("Standard approach failed, trying alternative grid creation");
      gridObjects = [];
      
      // Set basic constants
      const gridSize = 100; // Even larger grid for last resort
      const gridColor = "#999999";
      const gridWidth = 0.5;
      
      // Disable rendering during creation
      canvas.renderOnAddRemove = false;
      
      // Create very basic grid
      for (let x = 0; x <= canvas.width; x += gridSize) {
        const line = new Line([x, 0, x, canvas.height], {
          stroke: gridColor,
          strokeWidth: gridWidth,
          selectable: false
        });
        canvas.add(line);
        gridObjects.push(line);
      }
      
      for (let y = 0; y <= canvas.height; y += gridSize) {
        const line = new Line([0, y, canvas.width, y], {
          stroke: gridColor,
          strokeWidth: gridWidth,
          selectable: false
        });
        canvas.add(line);
        gridObjects.push(line);
      }
      
      // Re-enable rendering and force render
      canvas.renderOnAddRemove = true;
      canvas.requestRenderAll();
      
      // Update reference
      gridLayerRef.current = gridObjects;
      
      success = gridObjects.length > 0;
      console.log(`Alternative grid creation ${success ? 'succeeded' : 'failed'}`);
    }
    
    // Report result
    if (success) {
      logger.info(`Forced grid creation successful with ${gridObjects.length} objects`);
      
      captureError(
        new Error("Force grid creation succeeded"),
        "force-grid-creation-success",
        {
          level: "info",
          extra: {
            objectsCreated: gridObjects.length,
            canvasDimensions: `${canvas.width}x${canvas.height}`
          }
        }
      );
    } else {
      logger.error("Force grid creation failed with all approaches");
      
      captureError(
        new Error("Force grid creation failed"),
        "force-grid-creation-failed",
        {
          level: "error",
          extra: {
            canvasDimensions: `${canvas.width}x${canvas.height}`
          }
        }
      );
    }
    
    return gridObjects;
  } catch (error) {
    console.error("Error in force grid creation:", error);
    return [];
  }
};

/**
 * Diagnose grid failure and report comprehensive information
 * @param {FabricCanvas | null} canvas - Canvas to diagnose
 * @param {FabricObject[] | null} gridObjects - Grid objects to diagnose
 * @param {string} context - Context for the diagnosis
 */
export const diagnoseGridFailure = (
  canvas: FabricCanvas | null,
  gridObjects: FabricObject[] | null,
  context: string = "grid-failure"
): void => {
  // Get as much diagnostic info as possible
  const diagnostics: Record<string, any> = {
    timestamp: new Date().toISOString(),
    context,
    debugStats: { ...gridDebugStats }
  };
  
  // Canvas information
  diagnostics.canvas = canvas ? {
    exists: true,
    width: canvas.width,
    height: canvas.height,
    valid: !!(canvas.width && canvas.height && canvas.width > 0 && canvas.height > 0),
    objectCount: canvas.getObjects()?.length || 0,
    contextExists: !!(canvas as any).contextContainer,
    renderOnAddRemove: canvas.renderOnAddRemove,
    rendered: 'unknown' // Changed from using isRendered
  } : {
    exists: false
  };
  
  // Grid information
  diagnostics.grid = gridObjects ? {
    exists: true,
    count: gridObjects.length,
    onCanvas: canvas ? gridObjects.filter(obj => {
      try { return canvas.contains(obj); } catch { return false; }
    }).length : 'N/A',
    types: gridObjects.reduce((acc, obj) => {
      const type = obj.type || 'unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  } : {
    exists: false
  };
  
  // Identify issues
  diagnostics.issues = [];
  
  if (!canvas) {
    diagnostics.issues.push('Canvas is null');
  } else if (!canvas.width || !canvas.height || canvas.width <= 0 || canvas.height <= 0) {
    diagnostics.issues.push(`Canvas has invalid dimensions: ${canvas.width}x${canvas.height}`);
  }
  
  if (!gridObjects || gridObjects.length === 0) {
    diagnostics.issues.push('No grid objects exist');
  } else if (canvas && diagnostics.grid.onCanvas === 0) {
    diagnostics.issues.push('Grid objects exist but none are on canvas');
  } else if (canvas && diagnostics.grid.onCanvas < gridObjects.length) {
    diagnostics.issues.push(`${gridObjects.length - diagnostics.grid.onCanvas} grid objects are missing from canvas`);
  }
  
  // Log diagnostic information
  console.group(`🔍 Grid Failure Diagnosis: ${context}`);
  console.log("Diagnostics:", diagnostics);
  console.groupEnd();
  
  logger.error(`Grid failure diagnosed (${context}):`, diagnostics);
  
  // Report to Sentry
  captureError(
    new Error(`Grid failure diagnosis: ${context}`),
    "grid-failure-diagnosis",
    {
      level: "error",
      tags: {
        component: "grid",
        context
      },
      extra: diagnostics
    }
  );
};
