
/**
 * Optimized Grid Layer Component
 * Memoized component for rendering grid lines efficiently
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Canvas as FabricCanvas, Line, Object as FabricObject } from 'fabric';
import { gridLogger } from '@/utils/logger';
import { GRID_CONSTANTS } from '@/constants/gridConstants';

interface OptimizedGridLayerProps {
  canvas: FabricCanvas;
  gridSize?: number;
  largeGridSize?: number;
  smallGridColor?: string;
  largeGridColor?: string;
  showGrid?: boolean;
  onGridCreated?: (gridObjects: FabricObject[]) => void;
}

export const OptimizedGridLayer = React.memo(({
  canvas,
  gridSize = GRID_CONSTANTS.GRID_SIZE,
  largeGridSize = GRID_CONSTANTS.LARGE_GRID_SIZE,
  smallGridColor = GRID_CONSTANTS.SMALL_GRID_COLOR,
  largeGridColor = GRID_CONSTANTS.LARGE_GRID_COLOR,
  showGrid = true,
  onGridCreated
}: OptimizedGridLayerProps) => {
  const [gridObjects, setGridObjects] = useState<FabricObject[]>([]);
  
  // Create grid objects
  const createGrid = useCallback(() => {
    if (!canvas) return [];
    
    gridLogger.debug('Creating optimized grid');
    
    // Remove any existing grid objects
    const existingGridObjects = canvas.getObjects().filter(
      obj => obj.data?.type === 'grid'
    );
    
    if (existingGridObjects.length > 0) {
      gridLogger.debug(`Removing ${existingGridObjects.length} existing grid objects`);
      canvas.remove(...existingGridObjects);
    }
    
    const newGridObjects: FabricObject[] = [];
    const width = canvas.width || 1000;
    const height = canvas.height || 1000;
    
    // Draw grid lines
    const drawGridLines = () => {
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
          data: { type: 'grid' },
          visible: showGrid
        });
        
        canvas.add(line);
        newGridObjects.push(line);
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
          data: { type: 'grid' },
          visible: showGrid
        });
        
        canvas.add(line);
        newGridObjects.push(line);
      }
      
      return newGridObjects;
    };
    
    // Use requestAnimationFrame for better performance
    requestAnimationFrame(() => {
      const objects = drawGridLines();
      setGridObjects(objects);
      
      // Send objects to parent via callback
      if (onGridCreated) {
        onGridCreated(objects);
      }
      
      // Ensure grid lines are at the bottom
      objects.forEach(obj => {
        canvas.sendToBack(obj);
      });
      
      canvas.requestRenderAll();
      gridLogger.info(`Created grid with ${objects.length} lines`);
    });
    
    return [];
  }, [
    canvas, 
    gridSize, 
    largeGridSize, 
    smallGridColor, 
    largeGridColor, 
    showGrid, 
    onGridCreated
  ]);
  
  // Toggle grid visibility
  const updateGridVisibility = useCallback(() => {
    if (gridObjects.length === 0) return;
    
    gridObjects.forEach(obj => {
      obj.set('visible', showGrid);
    });
    
    if (canvas) {
      canvas.requestRenderAll();
    }
    
    gridLogger.debug(`Grid visibility set to ${showGrid}`);
  }, [canvas, gridObjects, showGrid]);
  
  // Create grid on mount
  useEffect(() => {
    if (canvas) {
      createGrid();
    }
    
    return () => {
      // Clean up grid on unmount
      if (canvas && gridObjects.length > 0) {
        // Remove grid objects from canvas
        canvas.remove(...gridObjects);
        gridLogger.debug('Grid objects removed during cleanup');
      }
    };
  }, [canvas, createGrid, gridObjects]);
  
  // Update grid visibility when showGrid changes
  useEffect(() => {
    updateGridVisibility();
  }, [showGrid, updateGridVisibility]);
  
  // Nothing to render - this is a controller component
  return null;
}, (prevProps, nextProps) => {
  // Custom comparison function for memoization
  // Only re-render if essential props change
  return (
    prevProps.canvas === nextProps.canvas &&
    prevProps.gridSize === nextProps.gridSize &&
    prevProps.showGrid === nextProps.showGrid
  );
});

OptimizedGridLayer.displayName = 'OptimizedGridLayer';

export default OptimizedGridLayer;
