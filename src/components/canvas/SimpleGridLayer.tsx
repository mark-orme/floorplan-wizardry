
import { useEffect, useState } from 'react';
import { Canvas, Line } from 'fabric';

interface SimpleGridLayerProps {
  canvas: Canvas | null;
  gridSize: number;
  visible: boolean;
  strokeWidth?: number;
  color?: string;
}

export function SimpleGridLayer({
  canvas,
  gridSize,
  visible,
  strokeWidth = 0.5,
  color = 'rgba(200, 200, 200, 0.5)'
}: SimpleGridLayerProps) {
  const [lines, setLines] = useState<Line[]>([]);
  
  useEffect(() => {
    if (!canvas) return;

    // Clear any existing grid lines
    if (lines.length > 0) {
      lines.forEach(line => {
        canvas.remove(line);
      });
      setLines([]);
    }

    if (!visible) return;

    const canvasWidth = canvas.width || 1000;
    const canvasHeight = canvas.height || 1000;

    const horizontalLines: Line[] = [];
    for (let i = 0; i <= canvasHeight; i += gridSize) {
      const line = new Line([0, i, canvasWidth, i], {
        stroke: color,
        strokeWidth: strokeWidth,
        selectable: false,
        evented: false,
        hoverCursor: 'default'
      });
      horizontalLines.push(line);
      canvas.add(line);
    }

    const verticalLines: Line[] = [];
    for (let i = 0; i <= canvasWidth; i += gridSize) {
      const line = new Line([i, 0, i, canvasHeight], {
        stroke: color,
        strokeWidth: strokeWidth,
        selectable: false,
        evented: false,
        hoverCursor: 'default'
      });
      verticalLines.push(line);
      canvas.add(line);
    }

    // Ensure grid lines are in the background
    const allLines = [...horizontalLines, ...verticalLines];
    allLines.forEach(line => {
      if (line.canvas) {
        // Use canvas.sendToBack for the line
        canvas.sendToBack(line);
      }
    });

    setLines(allLines);
    canvas.requestRenderAll();

    // Cleanup function to remove lines when unmounting
    return () => {
      if (canvas) {
        allLines.forEach(line => {
          canvas.remove(line);
        });
      }
    };
  }, [canvas, gridSize, visible, strokeWidth, color]);

  return null;
}
