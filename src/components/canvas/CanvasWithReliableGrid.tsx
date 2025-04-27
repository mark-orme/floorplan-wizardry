
import { useEffect, useState } from 'react';
import { SimpleGridLayer } from './SimpleGridLayer';
import { fabric } from 'fabric';

interface CanvasWithReliableGridProps {
  canvas: fabric.Canvas | null;
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
