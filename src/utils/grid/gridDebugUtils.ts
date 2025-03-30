
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { createReliableGrid } from './simpleGridCreator';
import { runGridDiagnostics } from './gridDiagnostics';
import { createBasicEmergencyGrid } from './gridCreationUtils';

/**
 * Dump grid state to console for debugging
 * @param canvas Fabric canvas
 * @param gridObjects Grid objects
 */
export const dumpGridState = (
  canvas: FabricCanvas,
  gridObjects: FabricObject[]
): void => {
  if (!canvas) {
    console.error('Cannot dump grid state: Canvas not available');
    return;
  }
  
  const diagnostics = runGridDiagnostics(canvas, gridObjects, true);
  
  console.group('📊 Grid State Dump');
  console.log('Canvas:', {
    width: canvas.width,
    height: canvas.height,
    totalObjects: canvas.getObjects().length
  });
  console.log('Grid objects:', {
    total: gridObjects.length,
    onCanvas: gridObjects.filter(obj => canvas.contains(obj)).length,
    visible: gridObjects.filter(obj => obj.visible).length
  });
  console.log('Diagnostics:', diagnostics);
  console.groupEnd();
};

/**
 * Force grid creation for debugging
 * @param canvas Fabric canvas
 * @returns Created grid objects
 */
export const forceCreateGrid = (
  canvas: FabricCanvas
): FabricObject[] => {
  if (!canvas) {
    console.error('Cannot force create grid: Canvas not available');
    return [];
  }
  
  // Remove existing grid objects
  const existingGridObjects = canvas.getObjects().filter(obj => 
    (obj as any).objectType === 'grid' || (obj as any).isGrid === true
  );
  
  existingGridObjects.forEach(obj => {
    canvas.remove(obj);
  });
  
  // Create temporary ref for grid objects
  const gridLayerRef = { current: [] };
  
  // Create new grid
  const gridObjects = createReliableGrid(canvas, gridLayerRef);
  
  console.log(`Force created ${gridObjects.length} grid objects`);
  
  return gridObjects;
};
