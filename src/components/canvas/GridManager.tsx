
import React from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { SimpleGrid } from './grid/SimpleGrid';

interface GridManagerProps {
  canvas: FabricCanvas | null;
  showGrid: boolean;
  onGridCreated: (objects: FabricObject[]) => void;
}

/**
 * Grid manager component
 * Manages canvas grid creation and visibility
 */
export const GridManager: React.FC<GridManagerProps> = ({
  canvas,
  showGrid,
  onGridCreated
}) => {
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
