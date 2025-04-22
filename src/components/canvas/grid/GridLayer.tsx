
import React, { useEffect, useState } from 'react';
import { Canvas as FabricCanvas, Line } from 'fabric';
import { toast } from '@/utils/toastUtils';
import * as gridConstants from '@/constants/gridConstants';

interface GridLayerProps {
  fabricCanvas: FabricCanvas;
  dimensions: { width: number; height: number };
  showDebug?: boolean;
}

export const GridLayer: React.FC<GridLayerProps> = ({
  fabricCanvas,
  dimensions,
  showDebug = false
}) => {
  const [gridObjects, setGridObjects] = useState<any[]>([]);
  
  // Create grid on component mount
  useEffect(() => {
    if (!fabricCanvas) return;
    
    try {
      console.log('Creating grid layer...');
      
      // Clear any existing grid
      gridObjects.forEach(obj => {
        fabricCanvas.remove(obj);
      });
      
      // Create new grid
      const newGridObjects = createGrid(fabricCanvas, dimensions);
      setGridObjects(newGridObjects);
      
      if (showDebug) {
        toast.success('Grid created successfully');
      }
      
      // Clean up when component unmounts
      return () => {
        newGridObjects.forEach(obj => {
          fabricCanvas.remove(obj);
        });
      };
    } catch (error) {
      console.error('Error creating grid:', error);
      if (showDebug && error instanceof Error) {
        toast.error(`Grid error: ${error.message}`);
      }
    }
  }, [fabricCanvas, dimensions.width, dimensions.height, showDebug]);
  
  // Update grid visibility when component props change
  useEffect(() => {
    if (!fabricCanvas || gridObjects.length === 0) return;
    
    gridObjects.forEach(obj => {
      obj.set('visible', true);
    });
    
    fabricCanvas.requestRenderAll();
  }, [fabricCanvas, gridObjects, showDebug]);
  
  // This component doesn't render any DOM elements
  return null;
};

// Helper function to create grid
function createGrid(canvas: FabricCanvas, dimensions: { width: number; height: number }): any[] {
  const gridObjects: any[] = [];
  
  // Create horizontal lines
  for (let y = 0; y <= dimensions.height; y += gridConstants.SMALL_GRID_SIZE) {
    const isLargeLine = y % gridConstants.LARGE_GRID_SIZE === 0;
    const lineWidth = isLargeLine ? gridConstants.LARGE_GRID_WIDTH : gridConstants.SMALL_GRID_WIDTH;
    const lineColor = isLargeLine ? gridConstants.LARGE_GRID_COLOR : gridConstants.SMALL_GRID_COLOR;
    
    const line = new Line([0, y, dimensions.width, y], {
      stroke: lineColor,
      strokeWidth: lineWidth,
      selectable: false,
      evented: false,
      strokeDashArray: isLargeLine ? [] : [5, 5],
      objectType: 'grid'
    });
    
    canvas.add(line);
    gridObjects.push(line);
  }
  
  // Create vertical lines
  for (let x = 0; x <= dimensions.width; x += gridConstants.SMALL_GRID_SIZE) {
    const isLargeLine = x % gridConstants.LARGE_GRID_SIZE === 0;
    const lineWidth = isLargeLine ? gridConstants.LARGE_GRID_WIDTH : gridConstants.SMALL_GRID_WIDTH;
    const lineColor = isLargeLine ? gridConstants.LARGE_GRID_COLOR : gridConstants.SMALL_GRID_COLOR;
    
    const line = new Line([x, 0, x, dimensions.height], {
      stroke: lineColor,
      strokeWidth: lineWidth,
      selectable: false,
      evented: false,
      strokeDashArray: isLargeLine ? [] : [5, 5],
      objectType: 'grid'
    });
    
    canvas.add(line);
    gridObjects.push(line);
  }
  
  // Set all grid objects to back
  gridObjects.forEach(obj => {
    canvas.sendToBack(obj);
  });
  
  canvas.requestRenderAll();
  
  return gridObjects;
}
