
/**
 * Fabric canvas registry utilities
 * Functions for tracking and managing canvas instances
 * @module fabric/registry
 */
import { Canvas as FabricCanvas } from "fabric";
import logger from "@/utils/logger";

/**
 * Canvas registration entry type
 * @interface CanvasRegistration
 */
interface CanvasRegistration {
  /** Canvas instance */
  canvas: FabricCanvas;
  /** Element ID associated with canvas */
  elementId: string;
  /** Registration timestamp */
  timestamp: number;
  /** Canvas purpose or role */
  purpose?: string;
}

/**
 * Registry of all active canvases
 */
const canvasRegistry: Map<string, CanvasRegistration> = new Map();

/**
 * Register a canvas in the registry
 * @param {FabricCanvas} canvas - Canvas to register
 * @param {string} elementId - ID of the canvas element
 * @param {string} purpose - Purpose or role of the canvas
 * @returns {boolean} Whether registration was successful
 */
export const registerCanvasElement = (
  canvas: FabricCanvas,
  elementId: string,
  purpose?: string
): boolean => {
  if (!canvas || !elementId) {
    logger.error("Cannot register canvas: Invalid canvas or element ID");
    return false;
  }
  
  try {
    // Create registration entry
    const registration: CanvasRegistration = {
      canvas,
      elementId,
      timestamp: Date.now(),
      purpose
    };
    
    // Add to registry
    canvasRegistry.set(elementId, registration);
    
    logger.info(`Canvas registered: ${elementId}${purpose ? ` (${purpose})` : ''}`);
    return true;
  } catch (error) {
    logger.error("Error registering canvas:", error);
    return false;
  }
};

/**
 * Check if a canvas is registered
 * @param {string} elementId - ID of the canvas element
 * @returns {boolean} Whether the canvas is registered
 */
export const isCanvasRegistered = (elementId: string): boolean => {
  return canvasRegistry.has(elementId);
};

/**
 * Get a registered canvas by element ID
 * @param {string} elementId - ID of the canvas element
 * @returns {CanvasRegistration | undefined} Registration entry or undefined if not found
 */
export const getCanvasRegistration = (elementId: string): CanvasRegistration | undefined => {
  return canvasRegistry.get(elementId);
};

/**
 * Unregister a canvas
 * @param {string} elementId - ID of the canvas element
 * @returns {boolean} Whether unregistration was successful
 */
export const unregisterCanvasElement = (elementId: string): boolean => {
  if (!elementId) {
    logger.error("Cannot unregister canvas: Invalid element ID");
    return false;
  }
  
  try {
    // Check if registered
    if (!canvasRegistry.has(elementId)) {
      logger.warn(`Canvas not found in registry: ${elementId}`);
      return false;
    }
    
    // Remove from registry
    canvasRegistry.delete(elementId);
    
    logger.info(`Canvas unregistered: ${elementId}`);
    return true;
  } catch (error) {
    logger.error("Error unregistering canvas:", error);
    return false;
  }
};

/**
 * Get all registered canvases
 * @returns {CanvasRegistration[]} Array of all registered canvases
 */
export const getAllRegisteredCanvases = (): CanvasRegistration[] => {
  return Array.from(canvasRegistry.values());
};

/**
 * Get count of registered canvases
 * @returns {number} Number of registered canvases
 */
export const getRegisteredCanvasCount = (): number => {
  return canvasRegistry.size;
};
