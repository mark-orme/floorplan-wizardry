
import { Canvas as FabricCanvas } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import logger from '@/utils/logger';
import * as Sentry from '@sentry/react';
import { captureMessage, captureError } from '@/utils/sentry';

/**
 * Test canvas drawing capabilities
 * @param canvas The fabric canvas to test
 */
export const testCanvasDrawingCapabilities = (canvas: FabricCanvas): void => {
  try {
    // Basic capability check
    if (!canvas.getObjects || typeof canvas.getObjects !== 'function') {
      throw new Error("Canvas API not properly available");
    }
    
    // Test object creation
    const objectCount = canvas.getObjects().length;
    logger.info("Canvas has objects", { count: objectCount });
    
  } catch (error) {
    logger.error("Error testing canvas drawing capabilities", { error });
    throw error;
  }
};

/**
 * Test straight line drawing functionality
 * @param canvas The fabric canvas
 * @param mode The drawing mode to check
 * @returns Test result information
 */
export const testStraightLineDrawing = (
  canvas: FabricCanvas, 
  mode: DrawingMode
): { success: boolean; message: string; error?: any } => {
  try {
    if (mode !== DrawingMode.STRAIGHT_LINE) {
      return { success: true, message: "Not in straight line mode, test skipped" };
    }
    
    // Check for necessary fabric properties
    const fabric = (window as any).fabric;
    if (!fabric || !fabric.Line) {
      return { success: false, message: "fabric.Line constructor not available" };
    }
    
    // Check canvas state for line drawing
    if (canvas.isDrawingMode) {
      return { success: false, message: "isDrawingMode should be false for straight line tool" };
    }
    
    return { success: true, message: "Straight line capabilities verified" };
  } catch (error) {
    return { 
      success: false, 
      message: "Error testing straight line capabilities", 
      error 
    };
  }
};
