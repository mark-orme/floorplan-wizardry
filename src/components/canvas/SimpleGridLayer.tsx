
import { useEffect, useState } from 'react';
import { Canvas, Line } from 'fabric';

interface SimpleGridLayerProps {
  canvas: Canvas | null;
  gridSize?: number;
  visible?: boolean;
  strokeWidth?: number;
  color?: string;
}

/**
 * A component that renders a grid layer on a Fabric.js canvas.
 * Implements robust error handling and checks for method availability.
 */
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
        try {
          canvas.remove(line);
        } catch (e) {
          console.error('Error removing grid line:', e);
        }
      });
      setLines([]);
    }

    if (!visible) return;

    const canvasWidth = canvas.width || 1000;
    const canvasHeight = canvas.height || 1000;
    const newLines: Line[] = [];

    try {
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

      // Send grid lines to back safely by checking method availability first
      newLines.forEach(line => {
        try {
          if (typeof canvas.sendObjectToBack === 'function') {
            canvas.sendObjectToBack(line);
          } else if (typeof canvas.sendToBack === 'function') {
            canvas.sendToBack(line);
          } else if (line && typeof line.moveTo === 'function') {
            // If canvas methods aren't available, try using line's moveTo
            line.moveTo(0); // Move to the bottom of the stack
          }
        } catch (e) {
          console.warn('Could not send grid line to back:', e);
        }
      });

      setLines(newLines);
      canvas.requestRenderAll();
    } catch (error) {
      console.error('Error creating grid:', error);
    }

    // Cleanup function to remove lines when unmounting
    return () => {
      if (canvas) {
        newLines.forEach(line => {
          try {
            canvas.remove(line);
          } catch (e) {
            console.error('Error removing grid line during cleanup:', e);
          }
        });
      }
    };
  }, [canvas, gridSize, visible, strokeWidth, color]);

  // This component doesn't render anything directly
  return null;
}
