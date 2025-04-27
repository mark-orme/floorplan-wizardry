
import React, { useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { SimpleGrid } from './grid/SimpleGrid';

interface GridLayerManagerProps {
  canvas: fabric.Canvas | null;
  showGrid: boolean;
  onGridCreated: (objects: fabric.Object[]) => void;
}

/**
 * Manages the grid layer for the canvas
 */
export const GridLayerManager: React.FC<GridLayerManagerProps> = ({
  canvas,
  showGrid,
  onGridCreated
}) => {
  // Skip rendering if no canvas
  if (!canvas) return null;

  return (
    <SimpleGrid
      canvas={canvas}
      showControls={false}
      defaultVisible={showGrid}
      onGridCreated={onGridCreated}
    />
  );
};
