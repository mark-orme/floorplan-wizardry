
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
    const lines: Line[] = [];
    
    // Create horizontal and vertical lines
    for (let i = 0; i < canvas.width!; i += gridSize) {
      const horizontalLine = new Line([i, 0, i, canvas.height!], {
        stroke: '#ddd',
        selectable: false,
        evented: false
      });
      
      const verticalLine = new Line([0, i, canvas.width!, i], {
        stroke: '#ddd',
        selectable: false,
        evented: false
      });

      (lines[0] as any).moveTo(0);
      (lines[0] as any).sendToBack();
      
      lines.push(horizontalLine, verticalLine);
    }

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
