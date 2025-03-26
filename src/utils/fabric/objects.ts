
/**
 * Fabric.js object manipulation utilities
 * @module fabric/objects
 */
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { isCanvasValid } from './canvasValidation';
import logger from '@/utils/logger';

/**
 * Clear all objects from canvas
 * @param canvas - Canvas to clear
 * @returns Number of objects removed
 */
export const clearCanvasObjects = (canvas: FabricCanvas | null): number => {
  if (!isCanvasValid(canvas)) return 0;
  
  try {
    const objectCount = canvas!.getObjects().length;
    canvas!.clear();
    canvas!.requestRenderAll();
    return objectCount;
  } catch (error) {
    logger.error('Error clearing canvas objects:', error);
    return 0;
  }
};

/**
 * Move canvas to a specific point
 * @param canvas - Canvas to move
 * @param x - X coordinate
 * @param y - Y coordinate
 */
export const canvasMoveTo = (canvas: FabricCanvas | null, x: number, y: number): void => {
  if (!isCanvasValid(canvas)) return;
  
  try {
    const vpt = canvas!.viewportTransform;
    if (vpt) {
      // Set translation components of the transform matrix
      vpt[4] = x;
      vpt[5] = y;
      canvas!.requestRenderAll();
    }
  } catch (error) {
    logger.error('Error moving canvas:', error);
  }
};

/**
 * Move object to front of canvas
 * @param canvas - Canvas containing object
 * @param obj - Object to move
 */
export const bringObjectToFront = (canvas: FabricCanvas | null, obj: FabricObject): void => {
  if (!isCanvasValid(canvas) || !obj) return;
  
  try {
    canvas!.bringToFront(obj);
    canvas!.requestRenderAll();
  } catch (error) {
    logger.error('Error bringing object to front:', error);
  }
};

/**
 * Move object to back of canvas
 * @param canvas - Canvas containing object
 * @param obj - Object to move
 */
export const sendObjectToBack = (canvas: FabricCanvas | null, obj: FabricObject): void => {
  if (!isCanvasValid(canvas) || !obj) return;
  
  try {
    canvas!.sendToBack(obj);
    canvas!.requestRenderAll();
  } catch (error) {
    logger.error('Error sending object to back:', error);
  }
};
