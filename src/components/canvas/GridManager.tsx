
import React from 'react';
import { fabric } from 'fabric';
import { SimpleGrid } from './grid/SimpleGrid';

interface GridManagerProps {
  canvas: fabric.Canvas | null;
  showGrid: boolean;
  onGridCreated: (objects: fabric.Object[]) => void;
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
