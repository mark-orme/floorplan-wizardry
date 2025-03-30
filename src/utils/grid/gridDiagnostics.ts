
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { createBasicEmergencyGrid } from './gridRenderers';

/**
 * Check grid health
 * @param canvas Fabric canvas
 * @param gridObjects Grid objects
 * @param detailed Whether to include detailed info
 * @returns Diagnostics results
 */
export const runGridDiagnostics = (
  canvas: FabricCanvas,
  gridObjects: FabricObject[],
  detailed = false
): Record<string, any> => {
  if (!canvas) {
    return { status: 'error', message: 'Canvas not available' };
  }
  
  const issues: string[] = [];
  
  // Check if grid exists
  if (!gridObjects || gridObjects.length === 0) {
    issues.push('Grid objects array is empty');
  }
  
  // Check if grid objects are on canvas
  const gridObjectsOnCanvas = gridObjects.filter(obj => canvas.contains(obj));
  if (gridObjectsOnCanvas.length < gridObjects.length) {
    issues.push(`${gridObjects.length - gridObjectsOnCanvas.length} grid objects missing from canvas`);
  }
  
  // Check grid visibility
  const visibleObjects = gridObjects.filter(obj => obj.visible);
  if (visibleObjects.length === 0 && gridObjects.length > 0) {
    issues.push('All grid objects are hidden');
  }
  
  // Prepare results
  const results = {
    status: issues.length === 0 ? 'ok' : 'issues',
    issues,
    totalGridObjects: gridObjects.length,
    visibleGridObjects: visibleObjects.length,
    gridObjectsOnCanvas: gridObjectsOnCanvas.length
  };
  
  // Add detailed info if requested
  if (detailed) {
    return {
      ...results,
      details: {
        canvas: {
          width: canvas.width,
          height: canvas.height,
          objectCount: canvas.getObjects().length
        },
        gridObjects: gridObjects.map(obj => ({
          visible: obj.visible,
          onCanvas: canvas.contains(obj),
          type: obj.type
        }))
      }
    };
  }
  
  return results;
};

/**
 * Apply fixes to grid issues
 * @param canvas Fabric canvas
 * @param gridObjects Grid objects
 * @returns Fixed issues count
 */
export const applyGridFixes = (
  canvas: FabricCanvas,
  gridObjects: FabricObject[]
): number => {
  if (!canvas) return 0;
  
  let fixCount = 0;
  
  // Add missing objects back to canvas
  gridObjects.forEach(obj => {
    if (!canvas.contains(obj)) {
      canvas.add(obj);
      fixCount++;
    }
  });
  
  if (fixCount > 0) {
    canvas.requestRenderAll();
  }
  
  return fixCount;
};

/**
 * Emergency fix for grid rendering issues
 * @param canvas Fabric canvas
 * @param gridLayerRef Reference to grid objects
 * @returns Whether the fix was successful
 */
export const emergencyGridFix = (
  canvas: FabricCanvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): boolean => {
  if (!canvas) return false;
  
  try {
    // Clear existing grid first
    if (gridLayerRef.current.length > 0) {
      gridLayerRef.current.forEach(obj => {
        if (canvas.contains(obj)) {
          canvas.remove(obj);
        }
      });
      gridLayerRef.current = [];
    }
    
    // Create emergency grid
    const emergencyGrid = createBasicEmergencyGrid(canvas);
    
    if (emergencyGrid.length > 0) {
      gridLayerRef.current = emergencyGrid;
      canvas.requestRenderAll();
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Error in emergency grid fix:", error);
    return false;
  }
};
