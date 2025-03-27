/**
 * Grid creation utilities
 * Reliable grid creation functions for canvas
 */
import { Canvas as FabricCanvas, Line, Object as FabricObject } from 'fabric';
import logger from '@/utils/logger';

// Constants to avoid magic numbers
const SMALL_GRID_COLOR = '#f0f0f0';
const LARGE_GRID_COLOR = '#e0e0e0';
const SMALL_GRID_SPACING = 10;
const LARGE_GRID_SPACING = 100;
const SMALL_GRID_WIDTH = 0.5;
const LARGE_GRID_WIDTH = 1;

/**
 * Creates a basic emergency grid when normal grid creation fails
 * Simplified version that always works even with problematic canvas
 * 
 * @param canvas Fabric.js canvas instance
 * @param gridLayerRef Optional reference to store grid objects
 * @returns Array of created grid objects
 */
export const createBasicEmergencyGrid = (
  canvas: FabricCanvas,
  gridLayerRef?: React.MutableRefObject<FabricObject[]>
): FabricObject[] => {
  if (!canvas) {
    console.error("Cannot create emergency grid: Canvas is null");
    return [];
  }
  
  try {
    console.log("Creating basic emergency grid...");
    
    // Get canvas dimensions
    const width = canvas.getWidth?.() || canvas.width || 800;
    const height = canvas.getHeight?.() || canvas.height || 600;
    
    if (!width || !height || width <= 0 || height <= 0) {
      console.error(`Cannot create grid: Invalid canvas dimensions (${width}x${height})`);
      return [];
    }
    
    // Store created objects
    const gridObjects: FabricObject[] = [];
    
    // Create horizontal small grid lines
    for (let y = 0; y <= height; y += SMALL_GRID_SPACING) {
      const line = new Line([0, y, width, y], {
        stroke: SMALL_GRID_COLOR,
        strokeWidth: SMALL_GRID_WIDTH,
        selectable: false,
        evented: false,
        excludeFromExport: true,
        hoverCursor: 'default'
      });
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Create vertical small grid lines
    for (let x = 0; x <= width; x += SMALL_GRID_SPACING) {
      const line = new Line([x, 0, x, height], {
        stroke: SMALL_GRID_COLOR,
        strokeWidth: SMALL_GRID_WIDTH,
        selectable: false,
        evented: false,
        excludeFromExport: true,
        hoverCursor: 'default'
      });
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Create horizontal large grid lines
    for (let y = 0; y <= height; y += LARGE_GRID_SPACING) {
      const line = new Line([0, y, width, y], {
        stroke: LARGE_GRID_COLOR,
        strokeWidth: LARGE_GRID_WIDTH,
        selectable: false,
        evented: false,
        excludeFromExport: true,
        hoverCursor: 'default'
      });
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Create vertical large grid lines
    for (let x = 0; x <= width; x += LARGE_GRID_SPACING) {
      const line = new Line([x, 0, x, height], {
        stroke: LARGE_GRID_COLOR,
        strokeWidth: LARGE_GRID_WIDTH,
        selectable: false,
        evented: false,
        excludeFromExport: true,
        hoverCursor: 'default'
      });
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Update the grid layer reference if provided
    if (gridLayerRef) {
      gridLayerRef.current = gridObjects;
    }
    
    // Force render all objects
    canvas.renderAll();
    
    console.log(`Created emergency grid with ${gridObjects.length} objects`);
    return gridObjects;
  } catch (error) {
    console.error("Error creating emergency grid:", error);
    logger.error("Emergency grid creation failed:", error);
    return [];
  }
};

/**
 * Creates a simple grid on the canvas with guaranteed performance
 * Simplified version with minimal dependencies for maximum reliability
 * 
 * @param canvas Fabric.js canvas instance
 * @returns Array of created grid objects
 */
export const createSimpleGrid = (canvas: FabricCanvas): FabricObject[] => {
  if (!canvas) {
    console.error("Cannot create simple grid: Canvas is null");
    return [];
  }
  
  try {
    console.log("Creating simple grid...");
    
    // Get canvas dimensions with fallbacks
    const width = canvas.getWidth?.() || canvas.width || 800;
    const height = canvas.getHeight?.() || canvas.height || 600;
    
    const gridObjects: FabricObject[] = [];
    
    // Only create large grid lines for better performance
    // Create horizontal lines
    for (let y = 0; y <= height; y += LARGE_GRID_SPACING) {
      const line = new Line([0, y, width, y], {
        stroke: LARGE_GRID_COLOR,
        strokeWidth: LARGE_GRID_WIDTH,
        selectable: false,
        evented: false
      });
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Create vertical lines
    for (let x = 0; x <= width; x += LARGE_GRID_SPACING) {
      const line = new Line([x, 0, x, height], {
        stroke: LARGE_GRID_COLOR,
        strokeWidth: LARGE_GRID_WIDTH,
        selectable: false,
        evented: false
      });
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Force render all objects
    canvas.renderAll();
    
    console.log(`Created simple grid with ${gridObjects.length} objects`);
    return gridObjects;
  } catch (error) {
    console.error("Error creating simple grid:", error);
    return [];
  }
};

/**
 * Verify if the grid exists on the canvas
 * Checks if grid objects are present on the canvas
 * 
 * @param canvas Fabric.js canvas instance
 * @param gridLayerRef Reference to grid objects
 * @returns Whether grid exists on canvas
 */
export const verifyGridExists = (
  canvas: FabricCanvas | null,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): boolean => {
  if (!canvas || !gridLayerRef.current || gridLayerRef.current.length === 0) {
    return false;
  }

  // Check if grid objects are on canvas
  return gridLayerRef.current.some(obj => canvas.contains(obj));
};

/**
 * Retry a function with exponential backoff
 * Useful for operations that might fail temporarily
 * 
 * @param fn Function to retry
 * @param attempt Current attempt number (starting at 0)
 * @param maxAttempts Maximum number of attempts
 * @returns Delay used for the retry or 0 if max attempts reached
 */
export const retryWithBackoff = (
  fn: () => void,
  attempt: number,
  maxAttempts: number
): number => {
  // Check if we've exceeded maximum attempts
  if (attempt >= maxAttempts) {
    console.error(`Maximum retry attempts (${maxAttempts}) reached`);
    return 0;
  }

  // Calculate delay with exponential backoff
  // Base delay of 100ms, doubled for each attempt, with some randomness
  const delay = Math.min(100 * Math.pow(2, attempt) + Math.random() * 100, 5000);
  
  // Schedule retry
  setTimeout(() => {
    console.log(`Retry attempt ${attempt + 1}/${maxAttempts} after ${delay.toFixed(0)}ms`);
    fn();
  }, delay);
  
  return delay;
};
