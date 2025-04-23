
import { useEffect } from 'react';
import { Canvas, Line } from 'fabric';
import { useGrid } from '@/hooks/useGrid';

export interface SimpleGridLayerProps {
  canvas: Canvas;  
  gridSize?: number;
  visible?: boolean;
}

export const SimpleGridLayer = ({ canvas, gridSize = 50, visible = true }: SimpleGridLayerProps) => {
  const { createGrid } = useGrid();

  useEffect(() => {
    if (!canvas || !visible) return;

    // Create grid lines
    const lines = createGrid(canvas, gridSize);
    
    // Add lines to canvas
    lines.forEach(line => {
      canvas.add(line);
      (canvas as any).bringToBack(line);
    });

    // Cleanup
    return () => {
      lines.forEach(line => canvas.remove(line));
    };
  }, [canvas, gridSize, visible, createGrid]);

  return null;
};
