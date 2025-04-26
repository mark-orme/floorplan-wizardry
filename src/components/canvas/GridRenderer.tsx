
import React, { useEffect, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { captureMessage } from '@/utils/sentryUtils';

interface GridRendererProps {
  canvas: FabricCanvas | null;
  gridSize?: number;
  color?: string;
  opacity?: number;
  visible?: boolean;
}

export const GridRenderer: React.FC<GridRendererProps> = ({
  canvas,
  gridSize = 50,
  color = '#e0e0e0',
  opacity = 0.5,
  visible = true
}) => {
  const [gridObjects, setGridObjects] = useState<any[]>([]);
  
  // Create grid
  useEffect(() => {
    if (!canvas) return;
    
    // Clear existing grid
    gridObjects.forEach(obj => {
      canvas.remove(obj);
    });
    
    const newGridObjects: any[] = [];
    const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight();
    
    try {
      // Create vertical lines
      for (let x = 0; x <= canvasWidth; x += gridSize) {
        const line = new window.fabric.Line([x, 0, x, canvasHeight], {
          stroke: color,
          opacity: opacity,
          selectable: false,
          evented: false,
          visible
        });
        canvas.add(line);
        newGridObjects.push(line);
      }
      
      // Create horizontal lines
      for (let y = 0; y <= canvasHeight; y += gridSize) {
        const line = new window.fabric.Line([0, y, canvasWidth, y], {
          stroke: color,
          opacity: opacity,
          selectable: false,
          evented: false,
          visible
        });
        canvas.add(line);
        newGridObjects.push(line);
      }
      
      // Log success
      captureMessage("Grid rendered successfully", {
        level: 'info',
        tags: { component: 'GridRenderer' },
        extra: { 
          gridSize,
          lineCount: newGridObjects.length
        }
      });
      
      setGridObjects(newGridObjects);
      canvas.renderAll();
    } catch (error) {
      captureMessage("Failed to render grid", {
        level: 'error',
        tags: { component: 'GridRenderer' },
        extra: { error: String(error) }
      });
    }
    
    return () => {
      if (canvas) {
        newGridObjects.forEach(obj => {
          canvas.remove(obj);
        });
        canvas.renderAll();
      }
    };
  }, [canvas, gridSize, color, opacity]);
  
  // Update visibility
  useEffect(() => {
    if (!canvas) return;
    
    gridObjects.forEach(obj => {
      obj.set('visible', visible);
    });
    
    canvas.renderAll();
  }, [canvas, visible, gridObjects]);
  
  return null;
};

export default GridRenderer;
