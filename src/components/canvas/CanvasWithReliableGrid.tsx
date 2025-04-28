
import { useEffect, useState } from 'react';
import { SimpleGridLayer } from './SimpleGridLayer';
import { fabric } from 'fabric';
import { ExtendedFabricCanvas, asExtendedCanvas } from '@/types/canvas-types';

interface CanvasWithReliableGridProps {
  canvas: ExtendedFabricCanvas | null;
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
