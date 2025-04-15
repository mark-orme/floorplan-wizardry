
import React, { useEffect, useRef } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { SimpleGrid } from './grid/SimpleGrid';

interface GridLayerManagerProps {
  canvas: FabricCanvas | null;
  showGrid: boolean;
  onGridCreated: (objects: FabricObject[]) => void;
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
