
/**
 * Emergency grid utilities
 * Fallback grid rendering when normal grid creation fails
 * @module emergencyGridUtils
 */
import { Canvas, Object as FabricObject, Line } from "fabric";
import { GRID_SPACING } from "@/constants/numerics";

/**
 * Create a minimalist grid as fallback
 * @param canvas - The Fabric canvas
 * @returns Array of created grid objects
 */
export const createMinimalistGrid = (canvas: Canvas): FabricObject[] => {
  if (!canvas) return [];
  
  const width = canvas.width || 800;
  const height = canvas.height || 600;
  const gridObjects: FabricObject[] = [];
  
  // Create horizontal lines
  for (let y = 0; y <= height; y += 100) {
    const line = new Line([0, y, width, y], {
      stroke: '#e0e0e0',
      strokeWidth: 1,
      selectable: false,
      evented: false,
      objectType: 'grid'
    });
    gridObjects.push(line);
    canvas.add(line);
  }
  
  // Create vertical lines
  for (let x = 0; x <= width; x += 100) {
    const line = new Line([x, 0, x, height], {
      stroke: '#e0e0e0',
      strokeWidth: 1,
      selectable: false,
      evented: false,
      objectType: 'grid'
    });
    gridObjects.push(line);
    canvas.add(line);
  }
  
  canvas.renderAll();
  return gridObjects;
};

/**
 * Create a basic emergency grid with small and large lines
 * Uses simplified approach for robustness
 * @param canvas - The canvas instance
 * @returns Array of created grid objects
 */
export const createBasicEmergencyGrid = (canvas: Canvas): FabricObject[] => {
  if (!canvas) return [];
  
  const width = canvas.width || 800;
  const height = canvas.height || 600;
  const gridObjects: FabricObject[] = [];
  
  // Use small grid spacing constant directly instead of the object
  const smallSpacing = GRID_SPACING.SMALL;
  
  // Create small grid lines
  for (let y = 0; y <= height; y += smallSpacing) {
    const line = new Line([0, y, width, y], {
      stroke: '#f0f0f0',
      strokeWidth: 0.5,
      selectable: false,
      evented: false,
      objectType: 'grid'
    });
    gridObjects.push(line);
    canvas.add(line);
  }
  
  for (let x = 0; x <= width; x += smallSpacing) {
    const line = new Line([x, 0, x, height], {
      stroke: '#f0f0f0',
      strokeWidth: 0.5,
      selectable: false,
      evented: false,
      objectType: 'grid'
    });
    gridObjects.push(line);
    canvas.add(line);
  }
  
  // Use large grid spacing constant directly
  const largeSpacing = GRID_SPACING.LARGE;
  
  // Create large grid lines
  for (let y = 0; y <= height; y += largeSpacing) {
    const line = new Line([0, y, width, y], {
      stroke: '#d0d0d0',
      strokeWidth: 1,
      selectable: false,
      evented: false,
      objectType: 'grid'
    });
    gridObjects.push(line);
    canvas.add(line);
  }
  
  for (let x = 0; x <= width; x += largeSpacing) {
    const line = new Line([x, 0, x, height], {
      stroke: '#d0d0d0',
      strokeWidth: 1,
      selectable: false,
      evented: false,
      objectType: 'grid'
    });
    gridObjects.push(line);
    canvas.add(line);
  }
  
  canvas.renderAll();
  return gridObjects;
};
