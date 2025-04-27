
import React, { useEffect, useRef } from 'react';
import { Object as FabricObject } from 'fabric';
import { ExtendedCanvas } from '@/types/canvas/ExtendedCanvas';
import { gridLogger } from '@/utils/logger';

// Constants that were missing
const GRID_CONSTANTS = {
  SMALL_GRID_SIZE: 10,
  LARGE_GRID_SIZE: 50,
  GRID_SIZE: 20, // Added missing constant
  SMALL_GRID_WIDTH: 0.5,
  LARGE_GRID_WIDTH: 1,
  SMALL_GRID_COLOR: '#dddddd',
  LARGE_GRID_COLOR: '#cccccc', 
  SMALL_GRID_OPACITY: 0.5,
  LARGE_GRID_OPACITY: 0.8,
  GRID_SNAP_THRESHOLD: 5,
  GRID_SNAP_ANGLE: 15,
  GRID_AUTO_FIX: true
};

// Extended logger with debug method
const logger = {
  ...gridLogger,
  debug: (message: string, data?: any) => {
    console.debug(`[GRID] ${message}`, data || '');
  }
};

// Define a custom interface for grid line objects
interface CustomFabricObject extends FabricObject {
  objectType?: string;
  isGrid?: boolean;
  isLargeGrid?: boolean;
}

interface OptimizedGridLayerProps {
  canvas: ExtendedCanvas | null;
  visible?: boolean;
}

export const OptimizedGridLayer: React.FC<OptimizedGridLayerProps> = ({
  canvas,
  visible = true
}) => {
  const gridLinesRef = useRef<FabricObject[]>([]);

  useEffect(() => {
    if (!canvas) {
      logger.debug('Canvas not available yet');
      return;
    }

    if (visible) {
      logger.debug('Creating grid');
      createGrid();
    }

    return () => {
      if (gridLinesRef.current.length > 0) {
        logger.debug('Cleaning up grid lines');
        clearGrid();
      }
    };
  }, [canvas, visible]);

  const createGrid = () => {
    if (!canvas) return;

    try {
      // Create a set of horizontal and vertical grid lines
      const gridSize = GRID_CONSTANTS.GRID_SIZE;
      const width = canvas.width || 1000;
      const height = canvas.height || 800;

      clearGrid(); // Clear existing grid lines

      // Create horizontal lines
      for (let i = 0; i <= height / gridSize; i++) {
        // Fixed Line usage - using fabric constructor correctly
        const line = new window.fabric.Line(
          [0, i * gridSize, width, i * gridSize], 
          {
            stroke: GRID_CONSTANTS.SMALL_GRID_COLOR,
            strokeWidth: GRID_CONSTANTS.SMALL_GRID_WIDTH,
            selectable: false,
            evented: false
          }
        );
        
        // Properly cast the object to apply custom properties
        const customLine = line as unknown as CustomFabricObject;
        customLine.objectType = 'grid';
        customLine.isGrid = true;
        
        canvas.add(line);
        gridLinesRef.current.push(line);
      }

      // Create vertical lines
      for (let i = 0; i <= width / gridSize; i++) {
        // Fixed Line usage - using fabric constructor correctly
        const line = new window.fabric.Line(
          [i * gridSize, 0, i * gridSize, height], 
          {
            stroke: GRID_CONSTANTS.SMALL_GRID_COLOR,
            strokeWidth: GRID_CONSTANTS.SMALL_GRID_WIDTH,
            selectable: false,
            evented: false
          }
        );
        
        // Properly cast the object to apply custom properties
        const customLine = line as unknown as CustomFabricObject;
        customLine.objectType = 'grid';
        customLine.isGrid = true;
        
        canvas.add(line);
        gridLinesRef.current.push(line);
      }

      // Create larger grid lines for better visibility
      const largeGridSize = GRID_CONSTANTS.LARGE_GRID_SIZE;
      
      // Large horizontal lines
      for (let i = 0; i <= height / largeGridSize; i++) {
        const line = new window.fabric.Line(
          [0, i * largeGridSize, width, i * largeGridSize], 
          {
            stroke: GRID_CONSTANTS.LARGE_GRID_COLOR,
            strokeWidth: GRID_CONSTANTS.LARGE_GRID_WIDTH,
            selectable: false,
            evented: false
          }
        );
        
        // Properly cast the object to apply custom properties
        const customLine = line as unknown as CustomFabricObject;
        customLine.objectType = 'grid';
        customLine.isGrid = true;
        customLine.isLargeGrid = true;
        
        canvas.add(line);
        gridLinesRef.current.push(line);
      }

      logger.debug(`Created grid with ${gridLinesRef.current.length} lines`);
      canvas.renderAll();
      return true;
    } catch (error) {
      logger.debug('Error creating grid:', error);
      return false;
    }
  };

  const clearGrid = () => {
    if (!canvas) return;
    
    try {
      gridLinesRef.current.forEach(line => {
        canvas.remove(line);
      });
      
      gridLinesRef.current = [];
      canvas.renderAll();
      return true;
    } catch (error) {
      console.error('Error clearing grid:', error);
      return false;
    }
  };

  return null;
};
