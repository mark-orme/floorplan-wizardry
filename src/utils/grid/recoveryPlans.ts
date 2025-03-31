
import { Canvas as FabricCanvas } from "fabric";
import logger from "@/utils/logger";
import { captureMessage } from "@/utils/sentry";
import { createGrid } from "./gridRenderers";

/**
 * Grid recovery plan interface
 */
interface GridRecoveryPlan {
  actions: Array<() => Promise<boolean>>;
  description: string;
}

/**
 * Create a recovery plan for grid creation issues
 * @param canvas - Fabric canvas
 * @param error - Error that occurred
 * @returns Recovery plan with actions to take
 */
export const createGridRecoveryPlan = (canvas: FabricCanvas, error?: Error): GridRecoveryPlan => {
  if (!canvas) {
    logger.error("Cannot create recovery plan: Canvas is null");
    return {
      actions: [],
      description: "No canvas available for recovery"
    };
  }
  
  // Log recovery plan creation
  logger.info("Creating grid recovery plan", {
    hasError: !!error,
    errorMessage: error?.message
  });
  
  // Capture recovery plan event
  captureMessage("Grid recovery plan created", "grid-recovery", {
    tags: { component: "GridRecovery" },
    extra: { 
      hasError: !!error,
      errorMessage: error?.message,
      canvasWidth: canvas.width,
      canvasHeight: canvas.height
    }
  });
  
  // Define recovery actions
  const actions: Array<() => Promise<boolean>> = [
    // Action: Try to create a basic grid
    async () => {
      try {
        const gridObjects = createGrid(canvas);
        return gridObjects.length > 0;
      } catch (err) {
        logger.error("Recovery action failed: Create basic grid", err);
        return false;
      }
    },
    
    // Action: Try to clear and recreate grid
    async () => {
      try {
        // Remove all existing grid objects
        const existingGridObjects = canvas.getObjects().filter(obj => 
          (obj as any).objectType === 'grid' || (obj as any).isGrid === true
        );
        
        if (existingGridObjects.length > 0) {
          canvas.remove(...existingGridObjects);
        }
        
        // Create new grid
        const gridObjects = createGrid(canvas);
        return gridObjects.length > 0;
      } catch (err) {
        logger.error("Recovery action failed: Clear and recreate grid", err);
        return false;
      }
    }
  ];
  
  return {
    actions,
    description: `Recovery plan with ${actions.length} actions`
  };
};
