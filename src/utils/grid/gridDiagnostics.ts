/**
 * Grid diagnostics and repair utilities
 */
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { createGrid } from '@/utils/canvasGrid';
import { createBasicEmergencyGrid, resetGridProgress } from '@/utils/gridCreationUtils';
import logger from '@/utils/logger';

export interface GridDiagnosticResult {
  hasGrid: boolean;
  gridObjectCount: number;
  brokenGridObjects: number;
  fixApplied: boolean;
  fixResult: string;
  fixedGrid?: FabricObject[];
}

/**
 * Run diagnostics on the grid system
 */
export function runGridDiagnostics(canvas: FabricCanvas): GridDiagnosticResult {
  if (!canvas) {
    return {
      hasGrid: false,
      gridObjectCount: 0,
      brokenGridObjects: 0, 
      fixApplied: false,
      fixResult: 'Cannot run diagnostics: Canvas is null'
    };
  }
  
  try {
    // Find all grid objects
    const gridObjects = canvas.getObjects().filter(
      obj => (obj as any).objectType === 'grid' || (obj as any).isGrid === true
    );
    
    // Count "broken" grid objects (invisible or invalid)
    const brokenGridObjects = gridObjects.filter(
      obj => !obj.visible || obj.width === 0 || obj.height === 0
    ).length;
    
    return {
      hasGrid: gridObjects.length > 0,
      gridObjectCount: gridObjects.length,
      brokenGridObjects,
      fixApplied: false,
      fixResult: `Found ${gridObjects.length} grid objects, ${brokenGridObjects} broken`
    };
  } catch (error) {
    logger.error('Error running grid diagnostics:', error);
    return {
      hasGrid: false,
      gridObjectCount: 0,
      brokenGridObjects: 0,
      fixApplied: false,
      fixResult: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Fix grid issues
 */
export function applyGridFixes(canvas: FabricCanvas): GridDiagnosticResult {
  if (!canvas) {
    return {
      hasGrid: false,
      gridObjectCount: 0,
      brokenGridObjects: 0, 
      fixApplied: false,
      fixResult: 'Cannot apply fixes: Canvas is null'
    };
  }
  
  try {
    // First run diagnostics
    const diagnostics = runGridDiagnostics(canvas);
    
    // Remove all existing grid objects
    const gridObjects = canvas.getObjects().filter(
      obj => (obj as any).objectType === 'grid' || (obj as any).isGrid === true
    );
    
    gridObjects.forEach(obj => {
      canvas.remove(obj);
    });
    
    // Reset grid progress
    resetGridProgress();
    
    // Create new grid
    const newGridObjects = createGrid(canvas);
    
    return {
      hasGrid: newGridObjects.length > 0,
      gridObjectCount: newGridObjects.length,
      brokenGridObjects: 0,
      fixApplied: true,
      fixResult: `Removed ${gridObjects.length} old grid objects, created ${newGridObjects.length} new grid objects`,
      fixedGrid: newGridObjects
    };
  } catch (error) {
    logger.error('Error applying grid fixes:', error);
    return {
      hasGrid: false,
      gridObjectCount: 0,
      brokenGridObjects: 0,
      fixApplied: true,
      fixResult: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Emergency grid fix for critical situations
 * This is a last resort when normal grid creation fails
 */
export function emergencyGridFix(canvas: FabricCanvas): FabricObject[] {
  if (!canvas) {
    logger.error('Cannot apply emergency grid fix: Canvas is null');
    return [];
  }
  
  try {
    logger.info('Applying emergency grid fix');
    
    // Remove any existing grid objects
    const existingGridObjects = canvas.getObjects().filter(
      obj => (obj as any).objectType === 'grid' || (obj as any).isGrid === true
    );
    
    existingGridObjects.forEach(obj => {
      canvas.remove(obj);
    });
    
    // Reset grid progress
    resetGridProgress();
    
    // Create emergency grid with simplified approach
    const emergencyGrid = createBasicEmergencyGrid(canvas);
    
    if (emergencyGrid.length > 0) {
      logger.info(`Emergency grid created with ${emergencyGrid.length} objects`);
      
      // Ensure grid objects are sent to back and visible
      emergencyGrid.forEach(obj => {
        canvas.sendToBack(obj);
        obj.set('visible', true);
      });
      
      canvas.requestRenderAll();
    } else {
      logger.error('Emergency grid creation failed');
    }
    
    return emergencyGrid;
    
  } catch (error) {
    logger.error('Error in emergency grid fix:', error);
    return [];
  }
}
