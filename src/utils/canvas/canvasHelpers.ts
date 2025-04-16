
import { Canvas as FabricCanvas } from "fabric";

/**
 * Safely get canvas from ref
 * @param ref Canvas reference object
 * @returns The canvas instance or null if not available
 */
export const getCanvas = (ref: { current: FabricCanvas | null }): FabricCanvas | null => {
  const canvas = ref.current;
  if (!canvas) return null;
  return canvas;
};

/**
 * Safely render canvas
 * @param canvas Canvas instance
 */
export const safeRender = (canvas?: FabricCanvas | null): void => {
  if (canvas) canvas.requestRenderAll();
};

/**
 * Default fabric object options
 * Common settings for non-interactive fabric objects
 */
export const defaultFabricOptions = {
  selectable: false,
  evented: false,
  objectCaching: true,
};

/**
 * Default fabric interactive object options
 * Common settings for interactive fabric objects
 */
export const defaultInteractiveOptions = {
  selectable: true,
  evented: true,
  objectCaching: true,
};

/**
 * Default grid options
 * Common settings for grid lines
 */
export const gridLineOptions = {
  ...defaultFabricOptions,
  stroke: '#e0e0e0',
  strokeWidth: 1,
  objectType: 'grid',
  isGrid: true,
};

/**
 * Safely dispose canvas
 * @param canvas Canvas instance
 */
export const safeDispose = (canvas?: FabricCanvas | null): void => {
  if (canvas) {
    try {
      canvas.dispose();
    } catch (err) {
      console.error('Error disposing canvas:', err);
    }
  }
};

/**
 * Check if canvas is valid and usable
 * @param canvas Canvas instance to check
 * @returns True if canvas is valid and usable
 */
export const isCanvasValid = (canvas: FabricCanvas | null): boolean => {
  return Boolean(
    canvas && 
    !canvas.disposed && 
    canvas.width !== undefined && 
    canvas.height !== undefined
  );
};
