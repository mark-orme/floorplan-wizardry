
import { useEffect, useState } from 'react';
import { SimpleGridLayer } from './SimpleGridLayer';
import type { Canvas as FabricCanvas } from 'fabric';
import type { ExtendedFabricCanvas } from '@/types/ExtendedFabricCanvas';

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
