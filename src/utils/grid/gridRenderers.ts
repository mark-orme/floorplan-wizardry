/**
 * Grid rendering utilities
 */
import { Canvas as FabricCanvas, Line, Text, Object as FabricObject } from 'fabric';
import { GRID_CONSTANTS } from '@/constants/gridConstants';
import { clearGrid } from './gridBasics';
import { isCanvasValidForGrid } from './gridValidation';
import logger from '@/utils/logger';

// Grid options type
export interface GridOptions {
  smallGridSize?: number;
  largeGridSize?: number;
  smallGridColor?: string;
  largeGridColor?: string;
  smallGridWidth?: number;
  largeGridWidth?: number;
  showLabels?: boolean;
  labelColor?: string;
  labelSize?: number;
  visible?: boolean;
}

/**
 * Creates a basic grid on the canvas
 * @param canvas - Fabric canvas
 * @param options - Grid options
 * @returns Array of created grid objects
 */
export function createGrid(
  canvas: FabricCanvas,
  options: GridOptions = {}
): FabricObject[] {
  // Validate canvas
  if (!isCanvasValidForGrid(canvas)) {
    logger.warn('Canvas is not valid for grid creation');
    return [];
  }

  // Clear any existing grid
  clearGrid(canvas);

  // Use default or provided options
  const {
    smallGridSize = GRID_CONSTANTS.SMALL_GRID_SIZE,
    largeGridSize = GRID_CONSTANTS.LARGE_GRID_SIZE,
    smallGridColor = GRID_CONSTANTS.SMALL_GRID_COLOR,
    largeGridColor = GRID_CONSTANTS.LARGE_GRID_COLOR,
    smallGridWidth = GRID_CONSTANTS.SMALL_GRID_WIDTH,
    largeGridWidth = GRID_CONSTANTS.LARGE_GRID_WIDTH,
    showLabels = true,
    visible = true
  } = options;

  const gridObjects: FabricObject[] = [];
  const canvasWidth = canvas.getWidth() || 800;
  const canvasHeight = canvas.getHeight() || 600;

  // Debug output for canvas dimensions
  console.log(`Creating grid with dimensions: ${canvasWidth}x${canvasHeight}`);

  // Create small grid lines
  for (let i = 0; i <= canvasWidth; i += smallGridSize) {
    const line = new Line([i, 0, i, canvasHeight], {
      stroke: smallGridColor,
      strokeWidth: smallGridWidth,
      selectable: false,
      evented: false,
      objectType: 'grid',
      gridType: 'small',
      visible: visible
    });
    canvas.add(line);
    gridObjects.push(line);
  }

  for (let i = 0; i <= canvasHeight; i += smallGridSize) {
    const line = new Line([0, i, canvasWidth, i], {
      stroke: smallGridColor,
      strokeWidth: smallGridWidth,
      selectable: false,
      evented: false,
      objectType: 'grid',
      gridType: 'small',
      visible: visible
    });
    canvas.add(line);
    gridObjects.push(line);
  }

  // Create large grid lines
  for (let i = 0; i <= canvasWidth; i += largeGridSize) {
    const line = new Line([i, 0, i, canvasHeight], {
      stroke: largeGridColor,
      strokeWidth: largeGridWidth,
      selectable: false,
      evented: false,
      objectType: 'grid',
      gridType: 'large',
      visible: visible
    });
    canvas.add(line);
    gridObjects.push(line);
  }

  for (let i = 0; i <= canvasHeight; i += largeGridSize) {
    const line = new Line([0, i, canvasWidth, i], {
      stroke: largeGridColor,
      strokeWidth: largeGridWidth,
      selectable: false,
      evented: false,
      objectType: 'grid',
      gridType: 'large',
      visible: visible
    });
    canvas.add(line);
    gridObjects.push(line);
  }

  // Add labels for large grid
  if (showLabels) {
    // Add horizontal labels
    for (let i = largeGridSize; i <= canvasWidth; i += largeGridSize) {
      const labelText = `${i / 100}m`;
      const label = new Text(labelText, {
        left: i,
        top: 10,
        fontSize: 10,
        fill: largeGridColor,
        selectable: false,
        evented: false,
        objectType: 'grid',
        originX: 'center',
        visible: visible
      });
      canvas.add(label);
      gridObjects.push(label);
    }

    // Add vertical labels
    for (let i = largeGridSize; i <= canvasHeight; i += largeGridSize) {
      const labelText = `${i / 100}m`;
      const label = new Text(labelText, {
        left: 10,
        top: i,
        fontSize: 10,
        fill: largeGridColor,
        selectable: false,
        evented: false,
        objectType: 'grid',
        originY: 'center',
        visible: visible
      });
      canvas.add(label);
      gridObjects.push(label);
    }
  }

  // Move grid objects to the back
  gridObjects.forEach(obj => {
    // Use sendObjectToBack instead of sendToBack (which is deprecated)
    canvas.sendObjectToBack(obj);
  });

  // Force render to ensure grid is visible
  canvas.requestRenderAll();
  console.log(`Grid created with ${gridObjects.length} objects`);
  return gridObjects;
}

/**
 * Creates a complete grid with all features
 */
export function createCompleteGrid(
  canvas: FabricCanvas,
  options: GridOptions = {}
): FabricObject[] {
  try {
    if (!canvas || !canvas.getWidth || !canvas.getHeight) {
      logger.error('Invalid canvas for grid creation');
      return [];
    }
    
    const width = canvas.getWidth();
    const height = canvas.getHeight();
    
    if (!width || !height || width <= 0 || height <= 0) {
      console.error('Invalid canvas dimensions:', { width, height });
      return [];
    }
    
    console.log(`Creating complete grid with dimensions: ${width}x${height}`);
    
    // Create grid with visible option explicitly set to true
    return createGrid(canvas, { 
      ...options,
      visible: true, // Force visibility
    });
  } catch (err) {
    logger.error('Error creating complete grid:', err);
    console.error('Error creating complete grid:', err);
    return [];
  }
}

/**
 * Creates a basic emergency grid with minimal features
 * Used as fallback when regular grid creation fails
 */
export function createBasicEmergencyGrid(
  canvas: FabricCanvas
): FabricObject[] {
  try {
    // Simplified grid with minimal options
    const gridObjects: FabricObject[] = [];
    const canvasWidth = canvas.getWidth() || 800;
    const canvasHeight = canvas.getHeight() || 600;
    const gridSize = 100; // Larger grid size for emergency mode
    
    if (!canvasWidth || !canvasHeight) {
      logger.warn('Canvas has invalid dimensions for emergency grid');
      return [];
    }

    // Create minimal grid lines
    for (let i = 0; i <= canvasWidth; i += gridSize) {
      const line = new Line([i, 0, i, canvasHeight], {
        stroke: '#cccccc',
        strokeWidth: 1,
        selectable: false,
        evented: false,
        objectType: 'grid',
        gridType: 'emergency',
        visible: true
      });
      canvas.add(line);
      gridObjects.push(line);
    }

    for (let i = 0; i <= canvasHeight; i += gridSize) {
      const line = new Line([0, i, canvasWidth, i], {
        stroke: '#cccccc',
        strokeWidth: 1,
        selectable: false,
        evented: false,
        objectType: 'grid',
        gridType: 'emergency',
        visible: true
      });
      canvas.add(line);
      gridObjects.push(line);
    }

    // Move grid objects to the back
    gridObjects.forEach(obj => {
      canvas.sendObjectToBack(obj);
    });

    // Force render
    canvas.requestRenderAll();
    logger.info('Created emergency grid as fallback');
    return gridObjects;
  } catch (error) {
    logger.error('Failed to create emergency grid:', error);
    return [];
  }
}

/**
 * Validates that a grid exists, creating one if it doesn't
 */
export function validateGrid(
  canvas: FabricCanvas,
  options: GridOptions = {}
): FabricObject[] {
  // Check if grid already exists
  const existingGrid = canvas.getObjects().filter(
    obj => (obj as any).objectType === 'grid'
  );
  
  if (existingGrid.length > 0) {
    return existingGrid;
  }
  
  // No grid exists, create one
  return createGrid(canvas, options);
}

/**
 * Ensures a grid exists, creating one if it doesn't
 * Creates a complete grid rather than a basic one
 */
export function ensureGrid(
  canvas: FabricCanvas,
  options: GridOptions = {}
): FabricObject[] {
  return validateGrid(canvas, options);
}
