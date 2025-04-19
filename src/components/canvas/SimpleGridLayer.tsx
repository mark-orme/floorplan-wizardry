
import React, { useEffect, useRef } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { createSimpleGrid, ensureGridVisible } from '@/utils/simpleGridCreator';
import logger from '@/utils/logger';

interface SimpleGridLayerProps {
  canvas: FabricCanvas;
  gridSize?: number;
  majorGridSize?: number;
  gridColor?: string;
  majorGridColor?: string;
}

const SimpleGridLayer: React.FC<SimpleGridLayerProps> = ({
  canvas,
  gridSize = 20,
  majorGridSize = 100,
  gridColor = 'rgba(200, 200, 200, 0.4)',
  majorGridColor = 'rgba(150, 150, 150, 0.6)'
}) => {
  const gridObjectsRef = useRef<FabricObject[]>([]);
  const initialized = useRef(false);
  
  useEffect(() => {
    if (!canvas || initialized.current) return;
    
    logger.info('Creating grid layer');
    
    try {
      // Create grid
      const gridObjects = createSimpleGrid(canvas);
      gridObjectsRef.current = gridObjects;
      
      // Ensure grid is visible
      ensureGridVisible(canvas, gridObjectsRef.current);
      
      initialized.current = true;
      logger.info(`Grid layer created with ${gridObjects.length} objects`);
    } catch (error) {
      logger.error('Error creating grid layer:', error);
    }
    
    // Cleanup function
    return () => {
      if (gridObjectsRef.current.length > 0) {
        logger.info('Removing grid layer');
        gridObjectsRef.current.forEach(obj => {
          canvas.remove(obj);
        });
        canvas.requestRenderAll();
      }
    };
  }, [canvas, gridSize, majorGridSize, gridColor, majorGridColor]);
  
  // Periodically check grid visibility
  useEffect(() => {
    if (!canvas || gridObjectsRef.current.length === 0) return;
    
    const checkGridInterval = setInterval(() => {
      ensureGridVisible(canvas, gridObjectsRef.current);
    }, 5000);
    
    return () => clearInterval(checkGridInterval);
  }, [canvas]);
  
  return null; // Non-visual component
};

export default SimpleGridLayer;
