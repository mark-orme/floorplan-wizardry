
import { useState, useEffect, useCallback } from 'react';
import lodash from 'lodash';
import { Canvas as FabricCanvas } from 'fabric';
import { Point } from '@/types/core/Point';
import { DrawingMode } from '@/constants/drawingModes';

// Define virtualization grid properties
interface VirtualizationGrid {
  cols: number;
  rows: number;
  cellWidth: number;
  cellHeight: number;
  visibleCells: Set<string>;
}

export function useVirtualizationEngine(canvas: FabricCanvas | null) {
  const [grid, setGrid] = useState<VirtualizationGrid | null>(null);
  const [viewportBoundary, setViewportBoundary] = useState<{
    top: number;
    left: number;
    right: number;
    bottom: number;
  } | null>(null);
  
  // Initialize the virtualization grid
  const initializeGrid = useCallback(() => {
    if (!canvas) return;
    
    const width = canvas.getWidth();
    const height = canvas.getHeight();
    
    const cellSize = 100; // Size of each virtual cell
    const cols = Math.ceil(width / cellSize);
    const rows = Math.ceil(height / cellSize);
    
    setGrid({
      cols,
      rows,
      cellWidth: cellSize,
      cellHeight: cellSize,
      visibleCells: new Set()
    });
    
    updateVisibleCells();
  }, [canvas]);
  
  // Update which cells are currently visible
  const updateVisibleCells = useCallback(() => {
    if (!canvas || !grid) return;
    
    // Get current viewport from canvas transform
    const vpt = canvas.viewportTransform;
    if (!vpt) return;
    
    // Calculate viewport boundaries
    const zoom = canvas.getZoom();
    const width = canvas.getWidth();
    const height = canvas.getHeight();
    
    const viewLeft = -vpt[4] / zoom;
    const viewTop = -vpt[5] / zoom;
    const viewRight = viewLeft + width / zoom;
    const viewBottom = viewTop + height / zoom;
    
    // Store viewport boundary for debugging or other uses
    setViewportBoundary({
      left: viewLeft,
      top: viewTop,
      right: viewRight,
      bottom: viewBottom
    });
    
    // Determine which grid cells are visible
    const visibleCells = new Set<string>();
    
    // Calculate visible cell range
    const startCol = Math.floor(viewLeft / grid.cellWidth);
    const endCol = Math.ceil(viewRight / grid.cellWidth);
    const startRow = Math.floor(viewTop / grid.cellHeight);
    const endRow = Math.ceil(viewBottom / grid.cellHeight);
    
    // Add all visible cells to the set
    for (let col = startCol; col <= endCol; col++) {
      for (let row = startRow; row <= endRow; row++) {
        if (col >= 0 && col < grid.cols && row >= 0 && row < grid.rows) {
          visibleCells.add(`${col}:${row}`);
        }
      }
    }
    
    setGrid(prev => prev ? {
      ...prev,
      visibleCells
    } : null);
    
  }, [canvas, grid]);
  
  // Handle viewport changes (pan, zoom)
  const handleViewportChange = useCallback(() => {
    updateVisibleCells();
  }, [updateVisibleCells]);
  
  // Attach and detach event handlers
  useEffect(() => {
    if (!canvas) return;
    
    // Initialize the grid
    initializeGrid();
    
    // Setup event listeners for canvas viewport changes
    canvas.on('viewport:translate', handleViewportChange);
    canvas.on('zoom:change', handleViewportChange);
    canvas.on('canvas:resized', initializeGrid);
    
    return () => {
      canvas.off('viewport:translate', handleViewportChange);
      canvas.off('zoom:change', handleViewportChange);
      canvas.off('canvas:resized', initializeGrid);
    };
  }, [canvas, initializeGrid, handleViewportChange]);
  
  // Debounced version of updateVisibleCells for performance
  const debouncedUpdateVisibleCells = lodash.debounce(() => {
    updateVisibleCells();
  }, 100);
  
  // Throttled version of updateVisibleCells for continuous updates
  const throttledUpdateVisibleCells = lodash.throttle(() => {
    updateVisibleCells();
  }, 50);
  
  return {
    grid,
    viewportBoundary,
    updateVisibleCells,
    debouncedUpdateVisibleCells,
    throttledUpdateVisibleCells
  };
}

export default useVirtualizationEngine;
