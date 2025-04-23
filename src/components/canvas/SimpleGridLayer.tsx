
import { useEffect, useState, useRef } from 'react';
import { Canvas, Line } from 'fabric';
import { captureError } from '@/utils/sentry';

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
 * Provides multiple fallback methods for compatibility.
 */
export function SimpleGridLayer({
  canvas,
  gridSize = 50,
  visible = true,
  strokeWidth = 0.5,
  color = 'rgba(200, 200, 200, 0.5)'
}: SimpleGridLayerProps) {
  const [lines, setLines] = useState<Line[]>([]);
  const errorCountRef = useRef<number>(0);
  
  useEffect(() => {
    if (!canvas) return;

    // Track if component is mounted to prevent state updates after unmount
    let isMounted = true;
    
    // Clear any existing grid lines
    if (lines.length > 0) {
      lines.forEach(line => {
        try {
          canvas.remove(line);
        } catch (e) {
          console.error('Error removing grid line:', e);
          captureError(e instanceof Error ? e : new Error(String(e)), 'grid-cleanup');
        }
      });
      setLines([]);
    }

    if (!visible) return;

    // Get canvas dimensions safely
    const canvasWidth = canvas.width || 1000;
    const canvasHeight = canvas.height || 1000;
    const newLines: Line[] = [];

    const createGridLines = () => {
      try {
        // Create horizontal lines
        for (let i = 0; i <= canvasHeight; i += gridSize) {
          try {
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
          } catch (error) {
            console.error('Error creating horizontal grid line:', error);
            errorCountRef.current++;
          }
        }

        // Create vertical lines
        for (let i = 0; i <= canvasWidth; i += gridSize) {
          try {
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
          } catch (error) {
            console.error('Error creating vertical grid line:', error);
            errorCountRef.current++;
          }
        }

        // Send grid lines to back safely by checking method availability first
        newLines.forEach(line => {
          try {
            // Try multiple approaches in order of preference
            if (typeof canvas.sendObjectToBack === 'function') {
              canvas.sendObjectToBack(line);
            } else if (typeof canvas.sendToBack === 'function') {
              canvas.sendToBack(line);
            } else if (typeof canvas.bringToBack === 'function') {
              canvas.bringToBack(line);
            } else if (line && typeof line.moveTo === 'function') {
              // If canvas methods aren't available, try using line's moveTo
              line.moveTo(0); // Move to the bottom of the stack
            } else if (line && typeof line.sendToBack === 'function') {
              line.sendToBack();
            } else {
              console.warn('No method available to send grid lines to back');
            }
          } catch (e) {
            console.warn('Could not send grid line to back:', e);
            captureError(e instanceof Error ? e : new Error(String(e)), 'grid-layer-ordering');
          }
        });

        if (isMounted) {
          setLines(newLines);
        }
        
        try {
          canvas.requestRenderAll();
        } catch (renderError) {
          console.error('Error rendering canvas after grid creation:', renderError);
        }
        
        // Report any errors that occurred during grid creation
        if (errorCountRef.current > 0) {
          console.warn(`${errorCountRef.current} errors occurred during grid creation`);
        }
      } catch (error) {
        console.error('Fatal error creating grid:', error);
        captureError(error instanceof Error ? error : new Error(String(error)), 'grid-layer-creation');
      }
    };

    // Create grid with a small delay to ensure canvas is fully initialized
    const timeoutId = setTimeout(createGridLines, 10);

    // Cleanup function to remove lines when unmounting
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      
      if (canvas) {
        newLines.forEach(line => {
          try {
            canvas.remove(line);
          } catch (e) {
            console.error('Error removing grid line during cleanup:', e);
          }
        });
        
        try {
          canvas.requestRenderAll();
        } catch (e) {
          console.error('Error rendering canvas during cleanup:', e);
        }
      }
    };
  }, [canvas, gridSize, visible, strokeWidth, color]);

  // This component doesn't render anything directly
  return null;
}
