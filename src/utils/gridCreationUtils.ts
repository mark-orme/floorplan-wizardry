
/**
 * Grid creation utilities
 * Provides direct grid creation functions for emergency use
 * @module gridCreationUtils
 */
import { Canvas, Line, Object as FabricObject } from 'fabric';
import { GRID_SPACING } from '@/constants/numerics';
import { GRID_COLORS } from '@/constants/colorConstants';
import logger from './logger';
import { toast } from 'sonner';

/**
 * Create a basic emergency grid with minimal operations
 * Used when normal grid creation fails
 * 
 * @param {Canvas} canvas - The canvas to create grid on
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 * @returns {boolean} Success status
 */
export const createBasicEmergencyGrid = (
  canvas: Canvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): boolean => {
  if (!canvas) {
    logger.error("Cannot create emergency grid: Canvas is null");
    console.error("⛔️ Emergency grid creation failed: Canvas is null");
    return false;
  }
  
  try {
    console.log("🚨 Creating basic emergency grid");
    
    // Clear any existing objects in the grid layer first
    if (gridLayerRef.current.length > 0) {
      gridLayerRef.current.forEach(obj => {
        if (canvas.contains(obj)) {
          canvas.remove(obj);
        }
      });
      gridLayerRef.current = [];
    }
    
    // Get canvas dimensions
    const width = canvas.getWidth();
    const height = canvas.getHeight();
    
    if (width <= 0 || height <= 0) {
      logger.error("Cannot create emergency grid: Invalid canvas dimensions", { width, height });
      console.error("⛔️ Emergency grid creation failed: Invalid canvas dimensions", { width, height });
      return false;
    }
    
    console.log("📏 Creating emergency grid with dimensions:", { width, height });
    
    // Create a simple grid with minimal operations
    const gridObjects: FabricObject[] = [];
    const gridSpacing = GRID_SPACING;
    
    // Create vertical grid lines
    for (let i = 0; i < width; i += gridSpacing) {
      const line = new Line([i, 0, i, height], {
        stroke: GRID_COLORS.SMALL_GRID,
        strokeWidth: 0.5,
        selectable: false,
        evented: false,
        hoverCursor: 'default'
      });
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Create horizontal grid lines
    for (let i = 0; i < height; i += gridSpacing) {
      const line = new Line([0, i, width, i], {
        stroke: GRID_COLORS.SMALL_GRID,
        strokeWidth: 0.5,
        selectable: false,
        evented: false,
        hoverCursor: 'default'
      });
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Add a few thicker lines for better orientation
    for (let i = 0; i < width; i += gridSpacing * 10) {
      const line = new Line([i, 0, i, height], {
        stroke: GRID_COLORS.LARGE_GRID,
        strokeWidth: 1.5,
        selectable: false,
        evented: false,
        hoverCursor: 'default'
      });
      canvas.add(line);
      gridObjects.push(line);
    }
    
    for (let i = 0; i < height; i += gridSpacing * 10) {
      const line = new Line([0, i, width, i], {
        stroke: GRID_COLORS.LARGE_GRID,
        strokeWidth: 1.5,
        selectable: false,
        evented: false,
        hoverCursor: 'default'
      });
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Update the grid layer reference
    gridLayerRef.current = gridObjects;
    
    // Force canvas to render
    canvas.requestRenderAll();
    
    console.log("✅ Emergency grid created with", gridObjects.length, "lines");
    logger.info(`Emergency grid created with ${gridObjects.length} lines`);
    
    // Optional: Notify user with toast
    toast.success("Emergency grid created");
    
    return true;
  } catch (error) {
    console.error("❌ Error creating emergency grid:", error);
    logger.error("Error creating emergency grid:", error);
    
    // Clear any partially created grid
    try {
      gridLayerRef.current.forEach(obj => {
        if (canvas.contains(obj)) {
          canvas.remove(obj);
        }
      });
      gridLayerRef.current = [];
    } catch (clearError) {
      // Just log, don't throw
    }
    
    return false;
  }
};

/**
 * Verify if grid exists on canvas
 * Checks if grid objects are properly attached
 * 
 * @param {Canvas} canvas - The canvas to check
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 * @returns {boolean} Whether grid exists
 */
export const verifyGridExists = (
  canvas: Canvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): boolean => {
  if (!canvas || !gridLayerRef.current || gridLayerRef.current.length === 0) {
    return false;
  }
  
  // Check if at least 50% of grid objects are on canvas
  const totalObjects = gridLayerRef.current.length;
  let objectsOnCanvas = 0;
  
  gridLayerRef.current.forEach(obj => {
    if (canvas.contains(obj)) {
      objectsOnCanvas++;
    }
  });
  
  return objectsOnCanvas >= totalObjects * 0.5;
};
