
/**
 * Utilities for canvas validation and element management
 * @module fabric/canvasValidation
 */
import { Canvas } from "fabric";

// Registry to track canvas elements and their state
const canvasRegistry = new WeakMap<HTMLCanvasElement, {
  initialized: boolean,
  timestamp: number,
  canvas: Canvas | null
}>();

// Set to track disposed canvases
const disposedCanvases = new WeakSet<Canvas>();

/**
 * Safely check if a canvas is valid and not already disposed
 * @param {Canvas|null} canvas - The Fabric canvas instance to check
 * @returns {boolean} Whether the canvas is valid
 */
export const isCanvasValid = (canvas: Canvas | null): boolean => {
  if (!canvas) return false;
  
  // If we know this canvas has been disposed, return false immediately
  if (disposedCanvases.has(canvas)) {
    return false;
  }
  
  try {
    // Check if the canvas has been explicitly marked as disposed
    if ((canvas as any).disposed === true) {
      return false;
    }
    
    // Try to access some methods that should exist on valid canvas instances
    return (
      typeof canvas.getObjects === 'function' &&
      typeof canvas.renderAll === 'function'
    );
  } catch (error) {
    console.warn("Error checking canvas validity:", error);
    return false;
  }
};

/**
 * Safely get canvas element if available
 * @param {Canvas} canvas - The Fabric canvas instance
 * @returns {HTMLCanvasElement|null} The canvas element or null
 */
export const safelyGetCanvasElement = (canvas: Canvas): HTMLCanvasElement | null => {
  if (!canvas) return null;
  
  try {
    // First check if we can directly access the element via lowerCanvasEl (fabric implementation detail)
    const directElement = (canvas as any).lowerCanvasEl;
    if (directElement instanceof HTMLCanvasElement) {
      return directElement;
    }
    
    // If not, try the getElement method if available
    if (typeof canvas.getElement === 'function') {
      try {
        const element = canvas.getElement();
        return element instanceof HTMLCanvasElement ? element : null;
      } catch (error) {
        console.warn("Error accessing canvas element:", error);
        return null;
      }
    }
  } catch (error) {
    console.warn("Error getting canvas element:", error);
  }
  
  return null;
};

/**
 * Check if a canvas is already disposed
 * @param {Canvas|null} canvas - The Fabric canvas instance to check
 * @returns {boolean} Whether the canvas is disposed
 */
export const isCanvasDisposed = (canvas: Canvas | null): boolean => {
  if (!canvas) return true;
  
  return disposedCanvases.has(canvas) || 
         (canvas as any).disposed === true;
};

/**
 * Check if a canvas element has a Fabric.js instance attached
 * @param {HTMLCanvasElement} element - Canvas element to check
 * @returns {boolean} Whether element is initialized
 */
export const isCanvasElementInitialized = (element: HTMLCanvasElement | null): boolean => {
  if (!element) return false;
  
  try {
    // First check for Fabric's data attribute
    if (element.hasAttribute('data-fabric')) {
      return true;
    }
    
    // Then check our registry
    return canvasRegistry.has(element);
  } catch (error) {
    console.warn("Error checking canvas element initialization:", error);
    return false;
  }
};

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
 * Add canvas to the disposed canvases set
 * @param {Canvas} canvas - Canvas to mark as disposed
 */
export const markCanvasAsDisposed = (canvas: Canvas): void => {
  if (!canvas) return;
  
  // Mark this canvas as disposed to prevent future disposal attempts
  disposedCanvases.add(canvas);
  (canvas as any).disposed = true;
};
