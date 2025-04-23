
import { useEffect, useState } from 'react';
import { Canvas, Line } from 'fabric';

interface SimpleGridLayerProps {
  canvas: Canvas | null;
  gridSize?: number;
  visible?: boolean;
  strokeWidth?: number;
  color?: string;
}

export function SimpleGridLayer({
  canvas,
  gridSize = 50,
  visible = true,
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
    const newLines: Line[] = [];

    // Create horizontal lines
    for (let i = 0; i <= canvasHeight; i += gridSize) {
      const line = new Line([0, i, canvasWidth, i], {
        stroke: color,
        strokeWidth: strokeWidth,
        selectable: false,
        evented: false,
        hoverCursor: 'default',
        objectCaching: false // Improve performance by disabling object caching
      });
      canvas.add(line);
      newLines.push(line);
    }

    // Create vertical lines
    for (let i = 0; i <= canvasWidth; i += gridSize) {
      const line = new Line([i, 0, i, canvasHeight], {
        stroke: color,
        strokeWidth: strokeWidth,
        selectable: false,
        evented: false,
        hoverCursor: 'default',
        objectCaching: false // Improve performance by disabling object caching
      });
      canvas.add(line);
      newLines.push(line);
    }

    // Send grid lines to back
    newLines.forEach(line => {
      canvas.sendObjectToBack(line);
    });

    setLines(newLines);
    canvas.requestRenderAll();

    // Cleanup function to remove lines when unmounting
    return () => {
      if (canvas) {
        newLines.forEach(line => {
          canvas.remove(line);
        });
      }
    };
  }, [canvas, gridSize, visible, strokeWidth, color]);

  // This component doesn't render anything directly
  return null;
}
