
/**
 * Fabric object manipulation utilities
 * Functions for working with Fabric.js objects
 * @module fabric/objects
 */
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import logger from "@/utils/logger";
import { isCanvasValid } from "./canvasValidation";

/**
 * Clear all objects from the canvas
 * @param {FabricCanvas | null | undefined} canvas - Fabric canvas instance
 * @param {boolean} preserveGrid - Whether to preserve grid elements
 * @returns {boolean} Whether the operation was successful
 */
export const clearCanvasObjects = (
  canvas: FabricCanvas | null | undefined,
  preserveGrid: boolean = true
): boolean => {
  if (!isCanvasValid(canvas)) {
    return false;
  }
  
  try {
    if (preserveGrid) {
      // Remove all non-grid objects
      const objects = canvas!.getObjects();
      const toRemove = [];
      
      for (const obj of objects) {
        const objectType = (obj as any).objectType;
        if (!objectType || !objectType.includes('grid')) {
          toRemove.push(obj);
        }
      }
      
      // Remove collected objects
      toRemove.forEach(obj => canvas!.remove(obj));
    } else {
      // Remove all objects including grid
      canvas!.clear();
    }
    
    canvas!.requestRenderAll();
    return true;
  } catch (error) {
    logger.error("Error clearing canvas objects:", error);
    return false;
  }
};

/**
 * Move canvas view to a specific point (panning)
 * @param {FabricCanvas} canvas - Fabric canvas instance
 * @param {number} x - X coordinate to move to
 * @param {number} y - Y coordinate to move to
 * @param {boolean} absolute - Whether coordinates are absolute or relative
 * @returns {boolean} Whether the operation was successful
 */
export const canvasMoveTo = (
  canvas: FabricCanvas | null | undefined,
  x: number,
  y: number,
  absolute: boolean = true
): boolean => {
  if (!isCanvasValid(canvas)) {
    return false;
  }
  
  try {
    if (absolute) {
      // For absolute positioning, use viewportTransform directly
      const vpt = canvas!.viewportTransform;
      if (vpt) {
        vpt[4] = x;
        vpt[5] = y;
        canvas!.requestRenderAll();
      }
    } else {
      // For relative positioning, use relativePan
      canvas!.relativePan({ x, y });
    }
    
    return true;
  } catch (error) {
    logger.error("Error moving canvas view:", error);
    return false;
  }
};

/**
 * Group objects together
 * @param {FabricCanvas} canvas - Fabric canvas instance
 * @param {FabricObject[]} objects - Objects to group
 * @param {Object} options - Group options
 * @returns {FabricObject | null} Created group or null if failed
 */
export const groupObjects = (
  canvas: FabricCanvas | null | undefined,
  objects: FabricObject[],
  options: Record<string, any> = {}
): FabricObject | null => {
  if (!isCanvasValid(canvas) || !objects || objects.length === 0) {
    return null;
  }
  
  try {
    // Remove objects from canvas first
    objects.forEach(obj => canvas!.remove(obj));
    
    // Create group with the objects
    const group = new fabric.Group(objects, options);
    
    // Add group to canvas
    canvas!.add(group);
    canvas!.requestRenderAll();
    
    return group;
  } catch (error) {
    logger.error("Error grouping objects:", error);
    return null;
  }
};

/**
 * Bring object to front of canvas
 * @param {FabricCanvas} canvas - Fabric canvas instance
 * @param {FabricObject} object - Object to bring to front
 * @returns {boolean} Whether the operation was successful
 */
export const bringToFront = (
  canvas: FabricCanvas | null | undefined,
  object: FabricObject
): boolean => {
  if (!isCanvasValid(canvas) || !object) {
    return false;
  }
  
  try {
    canvas!.bringToFront(object);
    canvas!.requestRenderAll();
    return true;
  } catch (error) {
    logger.error("Error bringing object to front:", error);
    return false;
  }
};
