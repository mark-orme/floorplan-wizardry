
import { useEffect, useState } from 'react';
import { Canvas } from 'fabric';
import { SimpleGridLayer } from './SimpleGridLayer';

interface CanvasWithReliableGridProps {
  canvas: Canvas | null;
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
