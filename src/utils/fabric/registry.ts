
/**
 * Canvas registry for tracking canvas instances and elements
 * @module fabric/registry
 */
import { Canvas } from "fabric";

// Registry to track canvas elements and their state
const canvasRegistry = new WeakMap<HTMLCanvasElement, {
  initialized: boolean;
  timestamp: number;
  canvas: Canvas | null;
}>();

/**
 * Register a canvas element and its instance
 * @param {HTMLCanvasElement} element - Canvas element to register
 * @param {Canvas} canvas - Fabric canvas instance
 */
export const registerCanvasElement = (element: HTMLCanvasElement, canvas: Canvas): void => {
  if (!element || !canvas) return;
  
  canvasRegistry.set(element, {
    initialized: true,
    timestamp: Date.now(),
    canvas
  });
};

/**
 * Get canvas registration info
 * @param {HTMLCanvasElement} element - Canvas element to check
 * @returns {Object | undefined} Registration info or undefined
 */
export const getCanvasRegistration = (element: HTMLCanvasElement): {
  initialized: boolean;
  timestamp: number;
  canvas: Canvas | null;
} | undefined => {
  if (!element) return undefined;
  return canvasRegistry.get(element);
};

/**
 * Check if canvas element is registered
 * @param {HTMLCanvasElement} element - Canvas element to check
 * @returns {boolean} Whether element is registered
 */
export const isCanvasRegistered = (element: HTMLCanvasElement): boolean => {
  if (!element) return false;
  return canvasRegistry.has(element);
};

/**
 * Remove canvas element from registry
 * @param {HTMLCanvasElement} element - Canvas element to unregister
 * @returns {boolean} Whether removal was successful
 */
export const unregisterCanvasElement = (element: HTMLCanvasElement): boolean => {
  if (!element) return false;
  
  try {
    const exists = canvasRegistry.has(element);
    if (exists) {
      canvasRegistry.delete(element);
    }
    return exists;
  } catch (error) {
    console.error("Error unregistering canvas element:", error);
    return false;
  }
};
