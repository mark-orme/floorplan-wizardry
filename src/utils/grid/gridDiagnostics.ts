
/**
 * Grid diagnostics utilities
 * @module utils/grid/gridDiagnostics
 */
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { createGrid } from './gridRenderers';
import logger from '@/utils/logger';

/**
 * Represents diagnostic results for grid
 */
interface GridDiagnosticResult {
  canvasDimensions: { width: number | undefined; height: number | undefined };
  gridExists: boolean;
  gridObjectCount: number;
  issues: string[];
  timestamp: string;
}

/**
 * Run diagnostics on the grid
 * @param canvas - Fabric canvas
 * @returns Diagnostic results
 */
export function runGridDiagnostics(canvas: FabricCanvas): GridDiagnosticResult {
  if (!canvas) {
    return {
      canvasDimensions: { width: undefined, height: undefined },
      gridExists: false,
      gridObjectCount: 0,
      issues: ['Canvas is null or undefined'],
      timestamp: new Date().toISOString()
    };
  }

  const issues: string[] = [];
  
  // Check canvas dimensions
  if (!canvas.width || !canvas.height) {
    issues.push('Canvas has invalid dimensions');
  }
  
  // Check for grid objects
  const allObjects = canvas.getObjects();
  const gridObjects = allObjects.filter(obj => (obj as any).objectType === 'grid');
  
  if (gridObjects.length === 0) {
    issues.push('No grid objects found on canvas');
  }
  
  return {
    canvasDimensions: { width: canvas.width, height: canvas.height },
    gridExists: gridObjects.length > 0,
    gridObjectCount: gridObjects.length,
    issues,
    timestamp: new Date().toISOString()
  };
}

/**
 * Apply fixes to grid issues
 * @param canvas - Fabric canvas
 * @param diagnostics - Diagnostic results
 * @returns Fixed grid objects
 */
export function applyGridFixes(
  canvas: FabricCanvas,
  diagnostics: GridDiagnosticResult
): FabricObject[] {
  if (!canvas) {
    logger.error('Cannot apply grid fixes: Canvas is null');
    return [];
  }
  
  // If there are issues, try to fix them
  if (diagnostics.issues.length > 0) {
    try {
      // Remove any existing grid objects
      const existingGridObjects = canvas.getObjects().filter(obj => 
        (obj as any).objectType === 'grid'
      );
      
      existingGridObjects.forEach(obj => {
        canvas.remove(obj);
      });
      
      // Create new grid
      const gridObjects = createGrid(canvas);
      
      // Ensure all grid objects are at the back
      gridObjects.forEach(obj => {
        canvas.sendObjectToBack(obj);
      });
      
      canvas.requestRenderAll();
      
      logger.info(`Applied grid fixes: Created ${gridObjects.length} new grid objects`);
      return gridObjects;
    } catch (error) {
      logger.error('Error applying grid fixes:', error);
      return [];
    }
  }
  
  // If no issues, return existing grid objects
  return canvas.getObjects().filter(obj => (obj as any).objectType === 'grid');
}
