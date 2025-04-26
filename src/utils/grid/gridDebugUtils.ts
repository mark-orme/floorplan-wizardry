
/**
 * Grid debugging utilities
 * @module utils/grid/gridDebugUtils
 */
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import logger from '@/utils/logger';

interface GridDebugInfo {
  objectCount: number;
  visibleCount: number;
  hiddenCount: number;
  outOfBoundsCount: number;
  dimensions: {
    width: number;
    height: number;
    zoom: number;
  };
}

interface GridAnalysisResult {
  hasIssues: boolean;
  issues: string[];
  diagnostics: Record<string, unknown>;
}

/**
 * Dump grid state to console for debugging
 * @param canvas - Fabric canvas
 */
export const dumpGridState = (canvas: FabricCanvas): void => {
  if (!canvas) {
    console.log('Cannot dump grid state: Canvas is null');
    return;
  }
  
  // Get all objects on canvas
  const allObjects = canvas.getObjects();
  
  // Filter grid objects
  const gridObjects = allObjects.filter(obj => 
    (obj as { objectType?: string }).objectType === 'grid' || (obj as { isGrid?: boolean }).isGrid === true
  );
  
  // Log counts
  console.log('---- GRID STATE DUMP ----');
  console.log(`Total canvas objects: ${allObjects.length}`);
  console.log(`Grid objects: ${gridObjects.length}`);
  
  if (gridObjects.length === 0) {
    console.log('No grid objects found on canvas');
  } else {
    // Log grid objects details
    console.log('Grid objects visibility:');
    const visibleCount = gridObjects.filter(obj => obj.visible).length;
    const hiddenCount = gridObjects.filter(obj => !obj.visible).length;
    
    console.log(`- Visible grid objects: ${visibleCount}`);
    console.log(`- Hidden grid objects: ${hiddenCount}`);
    
    // Check grid object properties
    const gridTypes = gridObjects.map(obj => (obj as { objectType?: string }).objectType || 'unknown');
    const uniqueTypes = [...new Set(gridTypes)];
    console.log('Grid object types:', uniqueTypes);
    
    // Check if any grid objects are out of bounds
    const canvasWidth = canvas.width || 0;
    const canvasHeight = canvas.height || 0;
    
    const outOfBoundsGridObjects = gridObjects.filter(obj => {
      if (obj.left === undefined || obj.top === undefined) return false;
      return obj.left < 0 || obj.left > canvasWidth || obj.top < 0 || obj.top > canvasHeight;
    });
    
    if (outOfBoundsGridObjects.length > 0) {
      console.log(`Out of bounds grid objects: ${outOfBoundsGridObjects.length}`);
    }
  }
  
  // Log canvas dimensions and state
  console.log('Canvas dimensions:', {
    width: canvas.width,
    height: canvas.height,
    zoom: canvas.getZoom()
  });
  
  console.log('---- END GRID STATE DUMP ----');
};

/**
 * Analyze grid issues on a canvas
 * @param canvas - Fabric canvas
 * @param gridObjects - Grid objects to analyze
 * @returns Analysis results
 */
export const analyzeGridIssues = (canvas: FabricCanvas, gridObjects: FabricObject[]): GridAnalysisResult => {
  const issues: string[] = [];
  const diagnostics: Record<string, unknown> = {};
  
  // Check for canvas issues
  if (!canvas) {
    issues.push('Canvas is null or undefined');
    return { hasIssues: true, issues, diagnostics };
  }
  
  // Check canvas dimensions
  if (!canvas.width || !canvas.height || canvas.width === 0 || canvas.height === 0) {
    issues.push('Canvas has invalid dimensions');
    diagnostics.dimensions = { width: canvas.width, height: canvas.height };
  }
  
  // Check for missing grid objects
  if (!gridObjects || gridObjects.length === 0) {
    issues.push('No grid objects found');
  } else {
    // Check for invisible grid objects
    const invisibleGridObjects = gridObjects.filter(obj => !obj.visible);
    if (invisibleGridObjects.length > 0) {
      issues.push(`${invisibleGridObjects.length} grid objects are invisible`);
    }
    
    // Check if grid objects are on canvas
    const canvasObjects = canvas.getObjects();
    const missingFromCanvas = gridObjects.filter(obj => !canvasObjects.includes(obj));
    
    if (missingFromCanvas.length > 0) {
      issues.push(`${missingFromCanvas.length} grid objects are missing from canvas`);
    }
  }
  
  diagnostics.canvas = {
    objectCount: canvas.getObjects().length,
    dimensions: { width: canvas.width, height: canvas.height },
    zoom: canvas.getZoom()
  };
  
  diagnostics.grid = {
    gridObjectCount: gridObjects.length,
    visibleGridCount: gridObjects.filter(obj => obj.visible).length
  };
  
  return {
    hasIssues: issues.length > 0,
    issues,
    diagnostics
  };
};
