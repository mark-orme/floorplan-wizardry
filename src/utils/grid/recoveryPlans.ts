
/**
 * Grid recovery planning
 * Provides recovery strategies for grid failures
 * @module grid/recoveryPlans
 */
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import logger from "../logger";
import { captureMessage } from "../sentry";

/**
 * Create a recovery plan for grid issues
 * Provides multi-step recovery strategy for grid failures
 * 
 * @param {Canvas} canvas - The canvas instance
 * @param {FabricObject[]} gridObjects - The grid objects
 * @param {string} failureContext - Context in which the failure occurred
 * @returns {Object} Recovery plan with steps to fix the issues
 */
export const createGridRecoveryPlan = (
  canvas: FabricCanvas,
  gridObjects: FabricObject[],
  failureContext: string
): Record<string, any> => {
  // Create a recovery plan based on identified issues
  const plan = {
    timestamp: new Date().toISOString(),
    context: failureContext,
    needsCanvasReset: false,
    needsGridRecreation: false,
    needsFullRefresh: false,
    suggestedActions: [] as string[],
    diagnostic: {}
  };
  
  // Check for critical issues
  if (!canvas || !canvas.width || !canvas.height) {
    plan.needsFullRefresh = true;
    plan.suggestedActions.push("Refresh the page to reinitialize canvas");
    plan.diagnostic = { canvas: "invalid" };
    return plan;
  }
  
  // Check grid objects
  const gridObjectsOnCanvas = gridObjects.filter(obj => canvas.contains(obj)).length;
  plan.diagnostic = {
    canvasDimensions: { width: canvas.width, height: canvas.height },
    totalGridObjects: gridObjects.length,
    gridObjectsOnCanvas,
    percentOnCanvas: gridObjects.length ? Math.round((gridObjectsOnCanvas / gridObjects.length) * 100) : 0
  };
  
  // Grid is completely missing
  if (gridObjects.length === 0) {
    plan.needsGridRecreation = true;
    plan.suggestedActions.push("Recreate entire grid");
  }
  // Grid is partially missing
  else if (gridObjectsOnCanvas < gridObjects.length) {
    if (gridObjectsOnCanvas === 0) {
      plan.needsGridRecreation = true;
      plan.suggestedActions.push("Recreate entire grid - all objects missing from canvas");
    } else {
      plan.needsGridRecreation = true;
      plan.suggestedActions.push(`Recreate grid - only ${gridObjectsOnCanvas}/${gridObjects.length} objects on canvas`);
    }
  }
  
  // Log the recovery plan to application log
  logger.info(`Grid recovery plan for ${failureContext}:`, plan);
  
  // Report the recovery plan to Sentry
  captureMessage(
    `Grid recovery plan for ${failureContext}`,
    "grid-recovery-plan",
    {
      level: "info",
      tags: {
        component: "grid",
        operation: "recovery",
        context: failureContext,
        needs_recreation: plan.needsGridRecreation.toString(),
        needs_refresh: plan.needsFullRefresh.toString()
      },
      extra: plan
    }
  );
  
  return plan;
};
