
import { Canvas, Object as FabricObject } from 'fabric';
import { captureMessage } from '@/utils/sentryUtils';

/**
 * Run diagnostics on grid objects
 * @param canvas The fabric canvas
 * @returns Diagnostic results
 */
export function runGridDiagnostics(canvas: Canvas) {
  if (!canvas) {
    return { error: 'Canvas not available' };
  }
  
  const allObjects = canvas.getObjects();
  const gridObjects = allObjects.filter(obj => {
    return (obj as any).objectType === 'grid' || (obj as any).isGrid === true;
  });
  
  const visibleGridObjects = gridObjects.filter(obj => obj.visible);
  
  return {
    totalObjects: allObjects.length,
    gridObjects: gridObjects.length,
    visibleGridObjects: visibleGridObjects.length,
    canvasDimensions: {
      width: canvas.getWidth(),
      height: canvas.getHeight()
    }
  };
}

/**
 * Apply fixes to grid issues
 * @param canvas The fabric canvas
 * @returns Results of the fixes
 */
export function applyGridFixes(canvas: Canvas) {
  if (!canvas) {
    return { error: 'Canvas not available' };
  }
  
  const gridObjects = canvas.getObjects().filter(obj => {
    return (obj as any).objectType === 'grid' || (obj as any).isGrid === true;
  });
  
  const fixedGrid = gridObjects.filter(obj => {
    if (!obj.visible) {
      if (typeof (obj as any).set === 'function') {
        (obj as any).set('visible', true);
        return true;
      }
    }
    return false;
  });
  
  if (fixedGrid.length > 0) {
    canvas.requestRenderAll();
    captureMessage("Fixed grid visibility issues", {
      level: 'info',
      tags: { component: "GridFixer" },
      extra: { fixedCount: fixedGrid.length }
    });
  }
  
  return {
    fixedGrid,
    fixedCount: fixedGrid.length
  };
}

/**
 * Emergency fix to recreate grid
 * @param canvas The fabric canvas
 * @returns New grid objects
 */
export function emergencyGridFix(canvas: Canvas): FabricObject[] {
  if (!canvas) {
    return [];
  }
  
  // Remove all existing grid objects
  const gridObjects = canvas.getObjects().filter(obj => {
    return (obj as any).objectType === 'grid' || (obj as any).isGrid === true;
  });
  
  gridObjects.forEach(obj => {
    canvas.remove(obj);
  });
  
  // Create new grid
  const width = canvas.getWidth();
  const height = canvas.getHeight();
  const gridSize = 20;
  const newGridObjects: FabricObject[] = [];
  
  // Create vertical lines
  for (let x = 0; x <= width; x += gridSize) {
    const isLargeLine = x % (gridSize * 5) === 0;
    const line = new fabric.Line([x, 0, x, height], {
      stroke: isLargeLine ? '#c0c0c0' : '#e0e0e0',
      strokeWidth: isLargeLine ? 1 : 0.5,
      selectable: false,
      evented: false,
      objectType: 'grid',
      isGrid: true,
      visible: true
    });
    
    canvas.add(line);
    newGridObjects.push(line);
  }
  
  // Create horizontal lines
  for (let y = 0; y <= height; y += gridSize) {
    const isLargeLine = y % (gridSize * 5) === 0;
    const line = new fabric.Line([0, y, width, y], {
      stroke: isLargeLine ? '#c0c0c0' : '#e0e0e0',
      strokeWidth: isLargeLine ? 1 : 0.5,
      selectable: false,
      evented: false,
      objectType: 'grid',
      isGrid: true,
      visible: true
    });
    
    canvas.add(line);
    newGridObjects.push(line);
  }
  
  // Send grid to back
  newGridObjects.forEach(obj => {
    canvas.sendToBack(obj);
  });
  
  canvas.requestRenderAll();
  
  captureMessage("Applied emergency grid fix", {
    level: 'info',
    tags: { component: "GridFixer" },
    extra: { newGridCount: newGridObjects.length }
  });
  
  return newGridObjects;
}

/**
 * Log grid state
 * @param canvas The fabric canvas
 * @param gridObjects Grid objects
 */
export function logGridState(canvas: Canvas, gridObjects: FabricObject[]) {
  if (!canvas) return;
  
  console.log("Grid State:", {
    canvasDimensions: {
      width: canvas.getWidth(),
      height: canvas.getHeight()
    },
    totalObjects: canvas.getObjects().length,
    gridObjects: gridObjects.length,
    visibleGridObjects: gridObjects.filter(obj => obj.visible).length
  });
}
