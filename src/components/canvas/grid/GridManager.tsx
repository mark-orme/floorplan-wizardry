import React from 'react';
import { Canvas } from 'fabric';
import { SimpleGrid } from './SimpleGrid';
import { GRID_CONSTANTS } from '@/constants/gridConstants';

interface GridManagerProps {
  canvas: Canvas | null;
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
