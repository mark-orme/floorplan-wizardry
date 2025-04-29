
import React, { useEffect, useState } from 'react';
import * as fabric from 'fabric';
import { captureMessage } from '@/utils/sentryUtils';
import { 
  SMALL_GRID_SIZE, 
  LARGE_GRID_SIZE,
  SMALL_GRID_COLOR, 
  LARGE_GRID_COLOR
} from '@/constants/gridConstants';
import { ExtendedFabricCanvas, asExtendedCanvas, asExtendedObject } from '@/types/canvas-types';

// Define constants for grid widths
const SMALL_GRID_WIDTH = 0.2;
const LARGE_GRID_WIDTH = 0.5;

interface GridRendererProps {
  canvas: fabric.Canvas | ExtendedFabricCanvas | null;
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
  const [gridObjects, setGridObjects] = useState<fabric.Object[]>([]);
  
  // Create grid
  useEffect(() => {
    if (!canvas) return;
    
    // Clear existing grid
    gridObjects.forEach(obj => {
      canvas.remove(obj);
    });
    
    const newGridObjects: fabric.Object[] = [];
    const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight();
    
    try {
      // Create vertical lines
      for (let x = 0; x <= canvasWidth; x += gridSize) {
        const isLargeLine = x % LARGE_GRID_SIZE === 0;
        const line = new fabric.Line([x, 0, x, canvasHeight], {
          stroke: isLargeLine ? LARGE_GRID_COLOR : color,
          strokeWidth: isLargeLine ? LARGE_GRID_WIDTH : SMALL_GRID_WIDTH,
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
        const isLargeLine = y % LARGE_GRID_SIZE === 0;
        const line = new fabric.Line([0, y, canvasWidth, y], {
          stroke: isLargeLine ? LARGE_GRID_COLOR : color,
          strokeWidth: isLargeLine ? LARGE_GRID_WIDTH : SMALL_GRID_WIDTH,
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
      if (obj) {
        // Direct property assignment instead of using set method
        (obj as any).visible = visible;
      }
    });
    
    canvas.renderAll();
  }, [canvas, visible, gridObjects]);
  
  return null;
}

export default GridRenderer;
