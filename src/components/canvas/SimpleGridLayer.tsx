
import { useEffect } from 'react';
import { fabric } from 'fabric';
import { useGrid } from '@/hooks/useGrid';

export interface SimpleGridLayerProps {
  canvas: fabric.Canvas;  
  gridSize?: number;
  visible?: boolean;
}

export const SimpleGridLayer = ({ canvas, gridSize = 50, visible = true }: SimpleGridLayerProps) => {
  const { createGrid } = useGrid();

  useEffect(() => {
    if (!canvas || !visible) return;

    const lines = createGrid(canvas, gridSize);
    
    lines.forEach(line => {
      canvas.add(line);
      canvas.sendToBack(line);
    });

    return () => {
      lines.forEach(line => canvas.remove(line));
    };
  }, [canvas, gridSize, visible, createGrid]);

  return null;
};
