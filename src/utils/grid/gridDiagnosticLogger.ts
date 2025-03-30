
/**
 * Grid Diagnostic Logger
 * Provides enhanced logging and troubleshooting for grid rendering issues
 * @module utils/grid/gridDiagnosticLogger
 */
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import logger from "../logger";
import { captureError } from "../sentryUtils";

/**
 * Log comprehensive grid state for troubleshooting
 * @param {FabricCanvas} canvas - The canvas to diagnose
 * @param {FabricObject[]} gridObjects - Grid objects to diagnose
 */
export const logGridState = (
  canvas: FabricCanvas | null,
  gridObjects: FabricObject[]
): void => {
  if (!canvas) {
    logger.error("Cannot log grid state: Canvas is null");
    console.error("Cannot log grid state: Canvas is null");
    return;
  }
  
  // Get a snapshot of the current canvas state
  const canvasState = {
    width: canvas.width,
    height: canvas.height,
    totalObjects: canvas.getObjects().length,
    viewportTransform: canvas.viewportTransform,
    zoom: canvas.getZoom(),
    renderOnAddRemove: canvas.renderOnAddRemove,
    selection: canvas.selection
    // Removed stateful and interactive properties as they don't exist in Fabric.js v6
  };
  
  // Get info about grid objects
  const gridState = {
    count: gridObjects.length,
    onCanvas: gridObjects.filter(obj => canvas.contains(obj)).length,
    visible: gridObjects.filter(obj => obj.visible).length,
    types: {} as Record<string, number>
  };
  
  // Count object types
  gridObjects.forEach(obj => {
    const type = obj.type || 'unknown';
    gridState.types[type] = (gridState.types[type] || 0) + 1;
  });
  
  // Log the current state
  logger.info("Grid diagnostic report", {
    canvas: canvasState,
    grid: gridState,
    timestamp: new Date().toISOString()
  });
  
  console.log("📊 Grid Diagnostic Report:", {
    canvas: canvasState,
    grid: gridState
  });
  
  // Check for common issues
  const issues = [];
  
  if (gridState.count === 0) {
    issues.push("No grid objects created");
  } else if (gridState.onCanvas === 0) {
    issues.push("Grid objects exist but none are on canvas");
  } else if (gridState.onCanvas < gridState.count) {
    issues.push(`Only ${gridState.onCanvas} of ${gridState.count} grid objects are on canvas`);
  }
  
  if (gridState.visible === 0 && gridState.count > 0) {
    issues.push("All grid objects are invisible");
  }
  
  if (!canvas.renderOnAddRemove) {
    issues.push("Canvas renderOnAddRemove is disabled");
  }
  
  if (canvas.width === 0 || canvas.height === 0) {
    issues.push(`Canvas has invalid dimensions: ${canvas.width}x${canvas.height}`);
  }
  
  if (issues.length > 0) {
    logger.warn("Grid rendering issues detected:", { issues });
    console.warn("⚠️ Grid rendering issues detected:", issues);
    
    // Report serious issues to Sentry
    if (issues.some(issue => issue.includes("No grid objects") || issue.includes("invalid dimensions"))) {
      captureError(
        new Error(`Grid rendering failure: ${issues.join(", ")}`),
        "grid-diagnostic",
        {
          level: "error",
          extra: {
            canvasState,
            gridState,
            issues
          }
        }
      );
    }
  }
};

/**
 * Add diagnostic event listeners to canvas
 * Helps track rendering and object management issues
 * @param {FabricCanvas} canvas - The canvas to monitor
 */
export const setupGridDiagnosticMonitoring = (canvas: FabricCanvas): void => {
  if (!canvas) return;
  
  // Monitor object additions
  canvas.on('object:added', (e) => {
    if (e.target?.type?.includes('line') || e.target?.type?.includes('grid')) {
      logger.debug("Grid object added to canvas", {
        type: e.target.type,
        visible: e.target.visible,
        id: e.target.id
      });
    }
  });
  
  // Monitor object removals
  canvas.on('object:removed', (e) => {
    if (e.target?.type?.includes('line') || e.target?.type?.includes('grid')) {
      logger.debug("Grid object removed from canvas", {
        type: e.target.type,
        id: e.target.id
      });
    }
  });
  
  // Monitor render events
  let renderCount = 0;
  canvas.on('after:render', () => {
    renderCount++;
    if (renderCount % 10 === 0) { // Log every 10th render to avoid spam
      logger.debug(`Canvas rendered (${renderCount} times)`);
    }
  });
  
  logger.info("Grid diagnostic monitoring set up successfully");
};
