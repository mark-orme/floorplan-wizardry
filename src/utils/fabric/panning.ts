
/**
 * Utilities for canvas panning functionality
 * @module fabric/panning
 */
import { Canvas } from "fabric";
import logger from "../logger";

// Panning state tracking
const panningState = {
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
  const originalInteractive = canvas.interactive;
  
  // Disable selection and interaction during panning
  canvas.selection = false;
  canvas.interactive = false;
  
  // Set panning cursor
  canvas.defaultCursor = 'grab';
  canvas.hoverCursor = 'grab';
  
  // Setup mouse down handler for panning
  const mouseDownHandler = (opt: { e: MouseEvent }) => {
    const evt = opt.e;
    panningState.isPanning = true;
    panningState.lastPosX = evt.clientX;
    panningState.lastPosY = evt.clientY;
    canvas.defaultCursor = 'grabbing';
    canvas.hoverCursor = 'grabbing';
  };
  
  // Setup mouse move handler for panning
  const mouseMoveHandler = (opt: { e: MouseEvent }) => {
    if (panningState.isPanning) {
      const evt = opt.e;
      const deltaX = evt.clientX - panningState.lastPosX;
      const deltaY = evt.clientY - panningState.lastPosY;
      
      // Update viewport position
      canvas.relativePan({ x: deltaX, y: deltaY });
      
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
    canvas.interactive = originalInteractive;
  };
  
  // Add event listeners
  canvas.on('mouse:down', mouseDownHandler);
  canvas.on('mouse:move', mouseMoveHandler);
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
