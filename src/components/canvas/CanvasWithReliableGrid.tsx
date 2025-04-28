
import { useEffect, useState } from 'react';
import { SimpleGridLayer } from './SimpleGridLayer';
import { Canvas as FabricCanvas } from 'fabric';
import { ExtendedFabricCanvas } from '@/types/ExtendedFabricCanvas';

interface CanvasWithReliableGridProps {
  canvas: FabricCanvas | ExtendedFabricCanvas | null;
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
