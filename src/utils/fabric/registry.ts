
/**
 * Canvas registry utilities
 * @module fabric/registry
 */
import logger from '@/utils/logger';

/**
 * Registry to track canvas elements
 */
interface CanvasRegistry {
  canvases: Map<string, HTMLCanvasElement>;
  lastRegistered: string | null;
}

// Initialize global registry
const registry: CanvasRegistry = {
  canvases: new Map(),
  lastRegistered: null
};

/**
 * Register a canvas element with an ID
 * @param id - Unique ID for the canvas
 * @param element - Canvas element to register
 * @returns Success status
 */
export const registerCanvasElement = (id: string, element: HTMLCanvasElement): boolean => {
  if (!element) {
    logger.error(`Cannot register null canvas with ID: ${id}`);
    return false;
  }
  
  try {
    // Register the element
    registry.canvases.set(id, element);
    registry.lastRegistered = id;
    logger.info(`Canvas registered with ID: ${id}`);
    return true;
  } catch (error) {
    logger.error(`Error registering canvas with ID ${id}:`, error);
    return false;
  }
};

/**
 * Check if a canvas ID is registered
 * @param id - Canvas ID to check
 * @returns Whether canvas is registered
 */
export const isCanvasRegistered = (id: string): boolean => {
  return registry.canvases.has(id);
};

/**
 * Get a registered canvas element
 * @param id - Canvas ID to retrieve
 * @returns Canvas element or null if not found
 */
export const getCanvasRegistration = (id: string): HTMLCanvasElement | null => {
  return registry.canvases.get(id) || null;
};
