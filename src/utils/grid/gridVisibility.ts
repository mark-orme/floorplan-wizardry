
import { Canvas as FabricCanvas, Line } from 'fabric';
import { GRID_CONSTANTS } from '@/constants/gridConstants';

/**
 * Forces the creation and visibility of the grid
 * @param canvas - Fabric canvas instance
 * @returns {boolean} True if grid created successfully
 */
export const forceGridCreationAndVisibility = (canvas: FabricCanvas): boolean => {
  try {
    // Check if canvas is valid
    if (!canvas || typeof canvas.getObjects !== 'function') {
      console.warn('Invalid canvas for grid creation');
      return false;
    }
    
    // Clear existing grid
    const existingGrids = canvas.getObjects().filter(obj => 
      obj.objectType === 'grid');
    
    existingGrids.forEach(grid => {
      canvas.remove(grid);
    });
    
    const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight();
    const zoom = canvas.getZoom();
    
    // Scale grid size based on zoom
    const scaleFactor = 1 / zoom;
    const smallGridSize = GRID_CONSTANTS.SMALL_GRID_SIZE * scaleFactor;
    const largeGridSize = GRID_CONSTANTS.LARGE_GRID_SIZE * scaleFactor;
    
    // Calculate grid lines needed
    const smallGridLines = Math.ceil(Math.max(canvasWidth, canvasHeight) * zoom / smallGridSize) + 10;
    const largeGridLines = Math.ceil(Math.max(canvasWidth, canvasHeight) * zoom / largeGridSize) + 10;
    
    // Create small grid lines
    for (let i = -smallGridLines; i <= smallGridLines; i++) {
      // Vertical lines
      canvas.add(new Line(
        [i * smallGridSize, -canvasHeight * zoom, i * smallGridSize, canvasHeight * zoom],
        {
          stroke: GRID_CONSTANTS.SMALL_GRID_COLOR,
          strokeWidth: GRID_CONSTANTS.SMALL_GRID_WIDTH,
          selectable: false,
          evented: false,
          objectType: 'grid',
          excludeFromExport: true
        }
      ));
      
      // Horizontal lines
      canvas.add(new Line(
        [-canvasWidth * zoom, i * smallGridSize, canvasWidth * zoom, i * smallGridSize],
        {
          stroke: GRID_CONSTANTS.SMALL_GRID_COLOR,
          strokeWidth: GRID_CONSTANTS.SMALL_GRID_WIDTH,
          selectable: false,
          evented: false,
          objectType: 'grid',
          excludeFromExport: true
        }
      ));
    }
    
    // Create large grid lines
    for (let i = -largeGridLines; i <= largeGridLines; i++) {
      // Vertical lines
      canvas.add(new Line(
        [i * largeGridSize, -canvasHeight * zoom, i * largeGridSize, canvasHeight * zoom],
        {
          stroke: GRID_CONSTANTS.LARGE_GRID_COLOR,
          strokeWidth: GRID_CONSTANTS.LARGE_GRID_WIDTH,
          selectable: false,
          evented: false,
          objectType: 'grid',
          excludeFromExport: true
        }
      ));
      
      // Horizontal lines
      canvas.add(new Line(
        [-canvasWidth * zoom, i * largeGridSize, canvasWidth * zoom, i * largeGridSize],
        {
          stroke: GRID_CONSTANTS.LARGE_GRID_COLOR,
          strokeWidth: GRID_CONSTANTS.LARGE_GRID_WIDTH,
          selectable: false,
          evented: false,
          objectType: 'grid',
          excludeFromExport: true
        }
      ));
    }
    
    // Send grid to back
    canvas.getObjects().filter(obj => obj.objectType === 'grid').forEach(grid => {
      canvas.sendToBack(grid);
    });
    
    canvas.renderAll();
    return true;
  } catch (error) {
    console.error('Error creating grid:', error);
    return false;
  }
};

/**
 * Updates the grid visibility based on zoom level
 * @param canvas - Fabric canvas instance
 */
export const updateGridWithZoom = (canvas: FabricCanvas): void => {
  if (!canvas) return;
  
  const zoom = canvas.getZoom();
  
  // Add lastRecordedZoom property to canvas as any to resolve type issue
  const canvasAny = canvas as any;
  
  // Only redraw grid if zoom change is significant
  if (canvasAny.lastRecordedZoom && 
      Math.abs(zoom - canvasAny.lastRecordedZoom) < 0.1) {
    return;
  }
  
  // Store current zoom level
  canvasAny.lastRecordedZoom = zoom;
  
  // Force grid recreation
  forceGridCreationAndVisibility(canvas);
};

/**
 * Sets the visibility of grid objects on the canvas
 * @param canvas - Fabric canvas instance
 * @param visible - Whether grid should be visible
 */
export const setGridVisibility = (canvas: FabricCanvas, visible: boolean): void => {
  if (!canvas) return;
  
  const gridObjects = canvas.getObjects().filter(obj => obj.objectType === 'grid');
  
  gridObjects.forEach(obj => {
    obj.visible = visible;
  });
  
  canvas.renderAll();
};
