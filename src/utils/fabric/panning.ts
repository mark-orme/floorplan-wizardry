
/**
 * Fabric panning utilities
 * Functions for panning and viewport manipulation
 * @module fabric/panning
 */
import { Canvas as FabricCanvas } from "fabric";
import logger from "@/utils/logger";

// Types for panning state
interface PanningState {
  isPanning: boolean;
  lastPosX: number;
  lastPosY: number;
  panMode: "drag" | "space" | "none";
}

// Global panning state
const panningState: PanningState = {
  isPanning: false,
  lastPosX: 0,
  lastPosY: 0,
  panMode: "none"
};

/**
 * Enable canvas panning
 * @param {FabricCanvas | null} canvas - Canvas to enable panning on
 * @param {"drag" | "space"} mode - Panning mode (drag or space bar)
 * @returns {boolean} Success status
 */
export const enableCanvasPanning = (
  canvas: FabricCanvas | null,
  mode: "drag" | "space" = "drag"
): boolean => {
  if (!canvas) return false;
  
  try {
    // Store the mode
    panningState.panMode = mode;
    
    if (mode === "drag") {
      setupDragPanning(canvas);
    } else if (mode === "space") {
      setupSpacebarPanning(canvas);
    }
    
    return true;
  } catch (error) {
    logger.error("Error enabling canvas panning:", error);
    return false;
  }
};

/**
 * Setup drag-based panning
 * @param {FabricCanvas} canvas - Canvas to set up panning on
 */
const setupDragPanning = (canvas: FabricCanvas): void => {
  // Mouse down event to start panning
  canvas.on("mouse:down", (opt) => {
    if (opt.e.altKey) {
      panningState.isPanning = true;
      panningState.lastPosX = opt.e.clientX;
      panningState.lastPosY = opt.e.clientY;
      canvas.defaultCursor = "grabbing";
      canvas.renderAll();
    }
  });
  
  // Mouse move event to perform panning
  canvas.on("mouse:move", (opt) => {
    if (panningState.isPanning) {
      const e = opt.e;
      const vpt = canvas.viewportTransform!;
      vpt[4] += e.clientX - panningState.lastPosX;
      vpt[5] += e.clientY - panningState.lastPosY;
      canvas.requestRenderAll();
      panningState.lastPosX = e.clientX;
      panningState.lastPosY = e.clientY;
    }
  });
  
  // Mouse up event to end panning
  canvas.on("mouse:up", () => {
    if (panningState.isPanning) {
      panningState.isPanning = false;
      canvas.setViewportTransform(canvas.viewportTransform!);
      canvas.defaultCursor = "default";
      canvas.renderAll();
      
      // Fire custom event for panning end
      canvas.fire("panning:end" as any);
    }
  });
};

/**
 * Setup spacebar-based panning
 * @param {FabricCanvas} canvas - Canvas to set up panning on
 */
const setupSpacebarPanning = (canvas: FabricCanvas): void => {
  // TODO: Implement spacebar panning
  logger.warn("Spacebar panning not yet implemented");
};

/**
 * Disable canvas panning
 * @param {FabricCanvas | null} canvas - Canvas to disable panning on
 * @returns {boolean} Success status
 */
export const disableCanvasPanning = (
  canvas: FabricCanvas | null
): boolean => {
  if (!canvas) return false;
  
  try {
    // Remove all panning-related event handlers
    canvas.off("mouse:down");
    canvas.off("mouse:move");
    canvas.off("mouse:up");
    
    // Reset state
    panningState.isPanning = false;
    panningState.panMode = "none";
    canvas.defaultCursor = "default";
    
    return true;
  } catch (error) {
    logger.error("Error disabling canvas panning:", error);
    return false;
  }
};

/**
 * Reset canvas viewport to original state
 * @param {FabricCanvas | null} canvas - Canvas to reset viewport for
 * @returns {boolean} Success status
 */
export const resetCanvasViewport = (
  canvas: FabricCanvas | null
): boolean => {
  if (!canvas) return false;
  
  try {
    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    canvas.renderAll();
    return true;
  } catch (error) {
    logger.error("Error resetting canvas viewport:", error);
    return false;
  }
};
