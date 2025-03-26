
/**
 * Canvas validation utilities
 * Provides type-safe functions for validating canvas objects
 * @module fabric/canvasValidation
 */
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import logger from '@/utils/logger';
import { ObjectId, isValidObjectId } from '@/types/fabricTypes';

/**
 * Check if a canvas instance is valid and usable
 * @param {unknown} canvas - Canvas to check
 * @returns {canvas is FabricCanvas} Whether canvas is valid
 */
export const isCanvasValid = (canvas: unknown): canvas is FabricCanvas => {
  if (!canvas) return false;
  
  try {
    // Type guard to check if the object resembles a Fabric.js canvas
    const canvasObj = canvas as Record<string, unknown>;
    
    return (
      typeof canvasObj.getWidth === 'function' &&
      typeof canvasObj.getHeight === 'function' &&
      typeof canvasObj.add === 'function' &&
      typeof canvasObj.remove === 'function' &&
      typeof canvasObj.getObjects === 'function'
    );
  } catch (error) {
    logger.error('Error checking canvas validity:', error);
    return false;
  }
};

/**
 * Check if a fabric object is valid
 * @param {unknown} object - Object to check
 * @returns {object is FabricObject} Whether object is valid
 */
export const isFabricObjectValid = (object: unknown): object is FabricObject => {
  if (!object) return false;
  
  try {
    // Type guard to check if the object resembles a Fabric.js object
    const fabricObj = object as Record<string, unknown>;
    
    return (
      typeof fabricObj.get === 'function' &&
      typeof fabricObj.set === 'function' &&
      typeof fabricObj.toObject === 'function'
    );
  } catch (error) {
    logger.error('Error checking fabric object validity:', error);
    return false;
  }
};

/**
 * Check if canvas is empty (contains no objects)
 * @param {FabricCanvas | null} canvas - Canvas to check
 * @returns {boolean} Whether canvas is empty
 */
export const isCanvasEmpty = (canvas: FabricCanvas | null): boolean => {
  if (!isCanvasValid(canvas)) return true;
  
  try {
    const objects = canvas.getObjects();
    return objects.length === 0;
  } catch (error) {
    logger.error('Error checking if canvas is empty:', error);
    return true;
  }
};

/**
 * Get canvas dimensions safely
 * @param {FabricCanvas | null} canvas - Canvas to check
 * @returns {{width: number, height: number}} Canvas dimensions
 */
export const getCanvasDimensions = (canvas: FabricCanvas | null): {width: number, height: number} => {
  if (!isCanvasValid(canvas)) return {width: 0, height: 0};
  
  try {
    return {
      width: canvas.getWidth(),
      height: canvas.getHeight()
    };
  } catch (error) {
    logger.error('Error getting canvas dimensions:', error);
    return {width: 0, height: 0};
  }
};

/**
 * Verify canvas configuration is valid
 * @param {FabricCanvas | null} canvas - Canvas to check
 * @returns {boolean} Whether canvas configuration is valid
 */
export const verifyCanvasConfiguration = (canvas: FabricCanvas | null): boolean => {
  if (!isCanvasValid(canvas)) return false;
  
  try {
    // Check basic canvas properties
    const width = canvas.getWidth();
    const height = canvas.getHeight();
    return width > 0 && height > 0;
  } catch (error) {
    logger.error('Error verifying canvas configuration:', error);
    return false;
  }
};

/**
 * Safely get canvas element from DOM
 * @param {string} canvasId - Canvas element ID
 * @returns {HTMLCanvasElement | null} Canvas element or null
 */
export const safelyGetCanvasElement = (canvasId: string): HTMLCanvasElement | null => {
  try {
    const element = document.getElementById(canvasId);
    if (!element || !(element instanceof HTMLCanvasElement)) {
      return null;
    }
    return element;
  } catch (error) {
    logger.error(`Error getting canvas element with ID ${canvasId}:`, error);
    return null;
  }
};

/**
 * Check if canvas has been disposed
 * @param {FabricCanvas | null} canvas - Canvas to check
 * @returns {boolean} Whether canvas is disposed
 */
export const isCanvasDisposed = (canvas: FabricCanvas | null): boolean => {
  if (!canvas) return true;
  
  try {
    // Try to access a method that would fail if canvas is disposed
    canvas.getWidth();
    return false;
  } catch (error) {
    // If accessing the method throws an error, canvas is likely disposed
    return true;
  }
};

/**
 * Safely get object by ID from canvas
 * @param {FabricCanvas | null} canvas - Canvas to search
 * @param {ObjectId} id - Object ID to find
 * @returns {FabricObject | null} Found object or null
 */
export const safeGetObjectById = (
  canvas: FabricCanvas | null, 
  id: ObjectId
): FabricObject | null => {
  if (!isCanvasValid(canvas) || !isValidObjectId(id)) return null;
  
  try {
    const objects = canvas.getObjects();
    // Type-safe check for id property
    return objects.find(obj => 'id' in obj && obj.id === id) || null;
  } catch (error) {
    logger.error(`Error getting object with ID ${id}:`, error);
    return null;
  }
};

/**
 * Safely check if canvas contains an object
 * @param {FabricCanvas | null} canvas - Canvas to check
 * @param {FabricObject | null} obj - Object to look for
 * @returns {boolean} Whether canvas contains the object
 */
export const safeCanvasContains = (
  canvas: FabricCanvas | null, 
  obj: FabricObject | null
): boolean => {
  if (!isCanvasValid(canvas) || !isFabricObjectValid(obj)) return false;
  
  try {
    return canvas.contains(obj);
  } catch (error) {
    logger.error('Error checking if canvas contains object:', error);
    return false;
  }
};
