
/**
 * Grid diagnostics utilities
 * @module utils/grid/gridDiagnostics
 */
import { Canvas as FabricCanvas, Object as FabricObject, Line } from 'fabric';
import { createGrid } from './gridRenderers';
import logger from '@/utils/logger';

/**
 * Represents diagnostic results for grid
 */
export interface GridDiagnosticResult {
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

/**
 * Apply emergency fix for grid when standard fixes fail
 * Creates a basic grid regardless of current state
 * @param canvas - Fabric canvas
 * @returns New grid objects
 */
export function emergencyGridFix(canvas: FabricCanvas): FabricObject[] {
  if (!canvas) {
    logger.error('Cannot apply emergency grid fix: Canvas is null');
    return [];
  }
  
  try {
    // Remove any existing grid objects first
    const existingGridObjects = canvas.getObjects().filter(obj => 
      (obj as any).objectType === 'grid'
    );
    
    existingGridObjects.forEach(obj => {
      canvas.remove(obj);
    });
    
    // Create a very basic grid with minimal options
    const width = canvas.width || 800;
    const height = canvas.height || 600;
    const gridSize = 20;
    const gridObjects: FabricObject[] = [];
    
    // Create horizontal lines
    for (let i = 0; i <= height; i += gridSize) {
      const line = new Line([0, i, width, i], {
        stroke: '#e0e0e0',
        strokeWidth: 0.5,
        selectable: false,
        evented: false,
        objectType: 'grid'
      } as any);
      
      canvas.add(line);
      gridObjects.push(line);
      canvas.sendObjectToBack(line);
    }
    
    // Create vertical lines
    for (let i = 0; i <= width; i += gridSize) {
      const line = new Line([i, 0, i, height], {
        stroke: '#e0e0e0',
        strokeWidth: 0.5,
        selectable: false,
        evented: false,
        objectType: 'grid'
      } as any);
      
      canvas.add(line);
      gridObjects.push(line);
      canvas.sendObjectToBack(line);
    }
    
    canvas.requestRenderAll();
    
    logger.info(`Emergency grid fix: Created ${gridObjects.length} new grid objects`);
    return gridObjects;
  } catch (error) {
    logger.error('Error applying emergency grid fix:', error);
    return [];
  }
}
