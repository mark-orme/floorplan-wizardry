
/**
 * Utilities for canvas panning functionality
 * @module fabric/panning
 */
import { Canvas, TPointerEvent, TPointerEventInfo } from "fabric";
import logger from "../logger";

/**
 * Panning state interface
 */
interface PanningState {
  isPanning: boolean;
  lastPosX: number;
  lastPosY: number;
}

// Panning state tracking
const panningState: PanningState = {
  isPanning: false,
  lastPosX: 0,
  lastPosY: 0
};

/**
 * Enable panning mode on canvas
 * @param {Canvas} canvas - The Fabric canvas instance
 */
export const enablePanning = (canvas: Canvas): void => {
  if (!canvas) return;
  
  // Store original values to restore later
  const originalSelection = canvas.selection;
  
  // Disable selection during panning
  canvas.selection = false;
  
  // Set panning cursor
  canvas.defaultCursor = 'grab';
  canvas.hoverCursor = 'grab';
  
  // Setup mouse down handler for panning
  const mouseDownHandler = (opt: TPointerEventInfo<TPointerEvent>) => {
    const evt = opt.e as MouseEvent;
    panningState.isPanning = true;
    panningState.lastPosX = evt.clientX;
    panningState.lastPosY = evt.clientY;
    canvas.defaultCursor = 'grabbing';
    canvas.hoverCursor = 'grabbing';
  };
  
  // Setup mouse move handler for panning
  const mouseMoveHandler = (opt: TPointerEventInfo<TPointerEvent>) => {
    if (panningState.isPanning) {
      const evt = opt.e as MouseEvent;
      const deltaX = evt.clientX - panningState.lastPosX;
      const deltaY = evt.clientY - panningState.lastPosY;
      
      // Update viewport position using fabric's point structure
      canvas.relativePan({ x: deltaX, y: deltaY } as any);
      
      // Update last position
      panningState.lastPosX = evt.clientX;
      panningState.lastPosY = evt.clientY;
      
      // Force render
      canvas.requestRenderAll();
    }
  };
  
  // Setup mouse up handler to end panning
  const mouseUpHandler = () => {
    panningState.isPanning = false;
    canvas.defaultCursor = 'grab';
    canvas.hoverCursor = 'grab';
    
    // Restore original settings
    canvas.selection = originalSelection;
  };
  
  // Add event listeners (with proper type casting for Fabric.js v6)
  canvas.on('mouse:down', mouseDownHandler as any);
  canvas.on('mouse:move', mouseMoveHandler as any);
  canvas.on('mouse:up', mouseUpHandler);
  
  logger.info("Panning mode enabled");
};

/**
 * Disable panning mode on canvas
 * @param {Canvas} canvas - The Fabric canvas instance
 */
export const disablePanning = (canvas: Canvas): void => {
  if (!canvas) return;
  
  // Reset cursor
  canvas.defaultCursor = 'default';
  canvas.hoverCursor = 'move';
  
  // Remove all mouse event handlers
  canvas.off('mouse:down');
  canvas.off('mouse:move');
  canvas.off('mouse:up');
  
  // Reset panning state
  panningState.isPanning = false;
  
  logger.info("Panning mode disabled");
};
