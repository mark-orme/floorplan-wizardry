
/**
 * Emergency grid utility functions
 * Provides backup grid functionality when main grid fails
 * @module emergencyGridUtils
 */
import { Canvas as FabricCanvas, Line } from 'fabric';
import { GRID_SPACING } from '@/constants/numerics';
import logger from '@/utils/logger';

/**
 * Creates a basic grid on the canvas
 * Used as emergency backup when primary grid fails
 * 
 * @param canvas - Fabric canvas
 * @param width - Canvas width
 * @param height - Canvas height
 * @returns Array of grid lines
 */
export const createEmergencyGrid = (canvas: FabricCanvas, width?: number, height?: number) => {
  const gridLines = [];
  
  try {
    // Use provided dimensions or get from canvas
    const canvasWidth = width || canvas.getWidth() || 800;
    const canvasHeight = height || canvas.getHeight() || 600;
    
    if (!canvasWidth || !canvasHeight) {
      logger.warn('Invalid canvas dimensions for emergency grid');
      return [];
    }

    // Create vertical small grid lines
    for (let x = 0; x <= canvasWidth; x += GRID_SPACING.SMALL) {
      const line = new Line([x, 0, x, canvasHeight], {
        stroke: '#eeeeee',
        strokeWidth: 0.5,
        selectable: false,
        evented: false,
        objectType: 'grid',
        hoverCursor: 'default',
        visible: true
      });
      
      gridLines.push(line);
      canvas.add(line);
      canvas.sendObjectToBack(line);
    }

    // Create horizontal small grid lines
    for (let y = 0; y <= canvasHeight; y += GRID_SPACING.SMALL) {
      const line = new Line([0, y, canvasWidth, y], {
        stroke: '#eeeeee',
        strokeWidth: 0.5,
        selectable: false,
        evented: false,
        objectType: 'grid',
        hoverCursor: 'default',
        visible: true
      });
      
      gridLines.push(line);
      canvas.add(line);
      canvas.sendObjectToBack(line);
    }

    // Create vertical large grid lines
    for (let x = 0; x <= canvasWidth; x += GRID_SPACING.LARGE) {
      const line = new Line([x, 0, x, canvasHeight], {
        stroke: '#dddddd',
        strokeWidth: 1,
        selectable: false,
        evented: false,
        objectType: 'grid',
        hoverCursor: 'default',
        visible: true
      });
      
      gridLines.push(line);
      canvas.add(line);
      canvas.sendObjectToBack(line);
    }

    // Create horizontal large grid lines
    for (let y = 0; y <= canvasHeight; y += GRID_SPACING.LARGE) {
      const line = new Line([0, y, canvasWidth, y], {
        stroke: '#dddddd',
        strokeWidth: 1,
        selectable: false,
        evented: false,
        objectType: 'grid',
        hoverCursor: 'default',
        visible: true
      });
      
      gridLines.push(line);
      canvas.add(line);
      canvas.sendObjectToBack(line);
    }

    // Ensure visibility
    canvas.requestRenderAll();
    logger.info(`Created emergency grid with ${gridLines.length} lines`);
    
    return gridLines;
  } catch (error) {
    logger.error('Failed to create emergency grid:', error);
    return [];
  }
};

/**
 * Remove all grid lines from the canvas
 * @param canvas - Fabric canvas
 */
export const removeEmergencyGrid = (canvas: FabricCanvas) => {
  if (!canvas) return;

  try {
    const gridObjects = canvas.getObjects().filter(obj => 
      (obj as any).objectType === 'grid'
    );

    gridObjects.forEach(obj => canvas.remove(obj));
    canvas.requestRenderAll();
    logger.info(`Removed ${gridObjects.length} emergency grid lines`);
  } catch (error) {
    logger.error('Error removing emergency grid:', error);
  }
};

/**
 * Toggle grid visibility
 * @param canvas - Fabric canvas
 * @param visible - Whether grid should be visible
 */
export const toggleEmergencyGridVisibility = (canvas: FabricCanvas, visible: boolean) => {
  if (!canvas) return;

  try {
    const gridObjects = canvas.getObjects().filter(obj => 
      (obj as any).objectType === 'grid'
    );

    gridObjects.forEach(obj => {
      obj.set('visible', visible);
    });

    canvas.requestRenderAll();
    logger.info(`Set visibility to ${visible} for ${gridObjects.length} emergency grid lines`);
  } catch (error) {
    logger.error('Error toggling emergency grid visibility:', error);
  }
};
