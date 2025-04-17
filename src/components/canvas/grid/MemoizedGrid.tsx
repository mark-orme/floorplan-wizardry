
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Canvas as FabricCanvas, Line, Object as FabricObject } from 'fabric';
import { GRID_CONSTANTS } from '@/constants/gridConstants';
import { batchCanvasOperations, requestOptimizedRender } from '@/utils/canvas/renderOptimizer';

interface MemoizedGridProps {
  canvas: FabricCanvas;
  gridSize?: number;
  largeGridSize?: number;
  smallGridColor?: string;
  largeGridColor?: string;
  showGrid?: boolean;
  onGridCreated?: (gridObjects: FabricObject[]) => void;
}

/**
 * Highly optimized memoized grid component 
 * Renders grid with batched operations and minimal re-renders
 */
export const MemoizedGrid = React.memo(({
  canvas,
  gridSize = GRID_CONSTANTS.GRID_SIZE,
  largeGridSize = GRID_CONSTANTS.LARGE_GRID_SIZE,
  smallGridColor = GRID_CONSTANTS.SMALL_GRID_COLOR,
  largeGridColor = GRID_CONSTANTS.LARGE_GRID_COLOR,
  showGrid = true,
  onGridCreated
}: MemoizedGridProps) => {
  // Reference to grid objects
  const gridObjectsRef = useRef<FabricObject[]>([]);
  const isGridCreatedRef = useRef(false);
  
  // Memoize grid creation function to prevent unnecessary recreations
  const createGrid = useCallback(() => {
    if (!canvas || isGridCreatedRef.current) return;
    
    // Remove any existing grid objects
    const existingGridObjects = canvas.getObjects().filter(
      obj => (obj as any).isGrid === true
    );
    
    if (existingGridObjects.length > 0) {
      canvas.remove(...existingGridObjects);
    }
    
    // Create all grid operations
    const operations: Array<(canvas: FabricCanvas) => void> = [];
    const gridObjects: FabricObject[] = [];
    const width = canvas.width || 2000;
    const height = canvas.height || 2000;
    
    // Calculate grid dimensions
    const gridWidth = Math.ceil(width / gridSize) + 1;
    const gridHeight = Math.ceil(height / gridSize) + 1;
    
    // Create vertical grid lines
    for (let i = 0; i <= gridWidth; i++) {
      const x = i * gridSize;
      const isLargeGrid = i % (largeGridSize / gridSize) === 0;
      
      const line = new Line([x, 0, x, height], {
        stroke: isLargeGrid ? largeGridColor : smallGridColor,
        strokeWidth: isLargeGrid ? 1 : 0.5,
        selectable: false,
        evented: false,
        excludeFromExport: true,
        visible: showGrid
      });
      
      // Mark as grid object
      (line as any).isGrid = true;
      (line as any).isLargeGrid = isLargeGrid;
      
      gridObjects.push(line);
      operations.push(canvas => canvas.add(line));
    }
    
    // Create horizontal grid lines
    for (let i = 0; i <= gridHeight; i++) {
      const y = i * gridSize;
      const isLargeGrid = i % (largeGridSize / gridSize) === 0;
      
      const line = new Line([0, y, width, y], {
        stroke: isLargeGrid ? largeGridColor : smallGridColor,
        strokeWidth: isLargeGrid ? 1 : 0.5,
        selectable: false,
        evented: false,
        excludeFromExport: true,
        visible: showGrid
      });
      
      // Mark as grid object
      (line as any).isGrid = true;
      (line as any).isLargeGrid = isLargeGrid;
      
      gridObjects.push(line);
      operations.push(canvas => canvas.add(line));
    }
    
    // Batch all grid creation operations
    batchCanvasOperations(canvas, operations);
    
    // Store grid objects reference
    gridObjectsRef.current = gridObjects;
    isGridCreatedRef.current = true;
    
    // Send grid objects to parent via callback
    if (onGridCreated) {
      onGridCreated(gridObjects);
    }
    
    // Move grid to back
    gridObjects.forEach(obj => {
      canvas.sendToBack(obj);
    });
    
    // Request a render
    requestOptimizedRender(canvas, 'grid-creation');
    
    console.log(`Grid created with ${gridObjects.length} lines`);
  }, [
    canvas, 
    gridSize, 
    largeGridSize, 
    smallGridColor, 
    largeGridColor, 
    showGrid, 
    onGridCreated
  ]);
  
  // Update grid visibility when showGrid changes
  useEffect(() => {
    if (!canvas || gridObjectsRef.current.length === 0) return;
    
    const gridObjects = gridObjectsRef.current;
    
    // Batch visibility update operations
    batchCanvasOperations(canvas, [
      canvas => {
        gridObjects.forEach(obj => {
          obj.set('visible', showGrid);
        });
      }
    ]);
    
  }, [canvas, showGrid]);
  
  // Create grid on mount
  useEffect(() => {
    if (canvas) {
      // Use requestAnimationFrame for better timing
      requestAnimationFrame(() => {
        createGrid();
      });
    }
    
    return () => {
      // Clean up grid on unmount
      if (canvas && gridObjectsRef.current.length > 0) {
        canvas.remove(...gridObjectsRef.current);
        isGridCreatedRef.current = false;
      }
    };
  }, [canvas, createGrid]);
  
  // Handle zoom changes
  useEffect(() => {
    if (!canvas || gridObjectsRef.current.length === 0) return;
    
    const handleZoom = () => {
      const zoom = canvas.getZoom();
      const gridObjects = gridObjectsRef.current;
      
      // Batch zoom adjustment operations
      batchCanvasOperations(canvas, [
        canvas => {
          gridObjects.forEach(obj => {
            const isLargeGrid = (obj as any).isLargeGrid;
            const baseWidth = isLargeGrid ? 1 : 0.5;
            
            // Adjust width inversely with zoom to maintain visual consistency
            obj.set('strokeWidth', baseWidth / Math.max(0.5, zoom));
          });
        }
      ]);
    };
    
    canvas.on('zoom:changed', handleZoom);
    
    return () => {
      canvas.off('zoom:changed', handleZoom);
    };
  }, [canvas]);
  
  // Nothing to render - this is a controller component
  return null;
}, (prevProps, nextProps) => {
  // Only re-render if these specific props change
  return (
    prevProps.canvas === nextProps.canvas &&
    prevProps.gridSize === nextProps.gridSize &&
    prevProps.showGrid === nextProps.showGrid
  );
});

MemoizedGrid.displayName = 'MemoizedGrid';

export default MemoizedGrid;
