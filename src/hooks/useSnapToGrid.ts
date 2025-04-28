
import { useState, useCallback } from 'react';

interface SnapToGridOptions {
  initialSnapEnabled?: boolean;
  gridSize?: number;
  snapThreshold?: number;
}

export const useSnapToGrid = (options: SnapToGridOptions = {}) => {
  const {
    initialSnapEnabled = true,
    gridSize: initialGridSize = 20,
    snapThreshold: initialSnapThreshold = 10
  } = options;

  const [snapEnabled, setSnapEnabled] = useState(initialSnapEnabled);
  const [gridSize, setGridSize] = useState(initialGridSize);
  const [snapThreshold, setSnapThreshold] = useState(initialSnapThreshold);

  const toggleSnap = useCallback(() => {
    setSnapEnabled(prev => !prev);
  }, []);

  const snapPointToGrid = useCallback((point: { x: number; y: number }) => {
    if (!snapEnabled) return point;

    const { x, y } = point;
    
    // Calculate nearest grid points
    const nearestX = Math.round(x / gridSize) * gridSize;
    const nearestY = Math.round(y / gridSize) * gridSize;
    
    // Calculate distances to nearest grid points
    const distX = Math.abs(x - nearestX);
    const distY = Math.abs(y - nearestY);
    
    // Only snap if within threshold
    return {
      x: distX <= snapThreshold ? nearestX : x,
      y: distY <= snapThreshold ? nearestY : y
    };
  }, [snapEnabled, gridSize, snapThreshold]);

  return {
    snapEnabled,
    setSnapEnabled,
    gridSize,
    setGridSize,
    snapThreshold,
    setSnapThreshold,
    toggleSnap,
    snapPointToGrid
  };
};
