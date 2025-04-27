
import { useEffect, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { SimpleGridLayer } from './SimpleGridLayer';

interface CanvasWithReliableGridProps {
  canvas: FabricCanvas | null;
  gridSize?: number;
  showGrid?: boolean;
}

export function CanvasWithReliableGrid({
  canvas, 
  gridSize = 20,
  showGrid = true
}: CanvasWithReliableGridProps) {
  return (
    <>
      {canvas && (
        <SimpleGridLayer 
          canvas={canvas}
          gridSize={gridSize}
          visible={showGrid}
        />
      )}
    </>
  );
}
