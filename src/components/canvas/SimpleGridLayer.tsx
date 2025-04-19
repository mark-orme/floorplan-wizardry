
import React, { useEffect, useState, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { createSimpleGrid, ensureGridVisible, createEmergencyGrid } from '@/utils/simpleGridCreator';
import { captureMessage } from '@/utils/sentry';
import logger from '@/utils/logger';

interface SimpleGridLayerProps {
  canvas: FabricCanvas | null;
}

export const SimpleGridLayer: React.FC<SimpleGridLayerProps> = ({ canvas }) => {
  const [gridCreated, setGridCreated] = useState(false);
  const attemptsRef = useRef(0);
  const gridObjectsRef = useRef<any[]>([]);
  
  // Function to create grid with retry logic
  const createGridWithRetry = (retryCount = 0) => {
    if (!canvas) return;
    
    try {
      logger.info("SimpleGridLayer: Attempting grid creation");
      
      // Check if grid already exists
      const existingGrid = canvas.getObjects().filter(obj => 
        (obj as any).objectType === 'grid' || (obj as any).isGrid === true
      );
      
      if (existingGrid.length > 0) {
        logger.info(`Grid already exists with ${existingGrid.length} objects, ensuring visibility`);
        ensureGridVisible(canvas);
        gridObjectsRef.current = existingGrid;
        setGridCreated(true);
        return;
      }
      
      // Create new grid
      logger.info("No grid found, creating new grid");
      const gridObjects = createSimpleGrid(canvas);
      
      if (gridObjects.length === 0 && retryCount < 3) {
        // Try emergency grid as fallback
        logger.warn("Primary grid creation failed, trying emergency grid");
        const emergencyGrid = createEmergencyGrid(canvas);
        gridObjectsRef.current = emergencyGrid;
        setGridCreated(emergencyGrid.length > 0);
        
        // Report to monitoring
        if (emergencyGrid.length === 0) {
          captureMessage('Emergency grid creation failed', 'grid-creation-error', {
            level: 'error',
            tags: { component: 'SimpleGridLayer', attempt: String(retryCount) }
          });
          
          // Schedule another retry with timeout
          setTimeout(() => createGridWithRetry(retryCount + 1), 500);
        }
      } else {
        gridObjectsRef.current = gridObjects;
        setGridCreated(gridObjects.length > 0);
        
        // Report success or failure
        if (gridObjects.length > 0) {
          logger.info(`Grid created successfully with ${gridObjects.length} objects`);
        } else {
          captureMessage('All grid creation attempts failed', 'grid-creation-error', {
            level: 'error',
            tags: { component: 'SimpleGridLayer', finalAttempt: 'true' }
          });
        }
      }
    } catch (error) {
      logger.error("Error in SimpleGridLayer:", error);
      
      // Report error to monitoring
      captureMessage(`Grid creation error: ${error instanceof Error ? error.message : 'Unknown error'}`, 
        'grid-creation-error', {
          level: 'error',
          tags: { component: 'SimpleGridLayer' },
          extra: { error: String(error) }
        }
      );
      
      // Try emergency grid on error if not too many attempts
      if (retryCount < 3) {
        logger.info("Attempting emergency grid after error");
        try {
          if (canvas) {
            const emergencyGrid = createEmergencyGrid(canvas);
            gridObjectsRef.current = emergencyGrid;
            setGridCreated(emergencyGrid.length > 0);
          }
        } catch (emergencyError) {
          logger.error("Emergency grid creation also failed:", emergencyError);
        }
      }
    }
  };
  
  // Set up mutation observer to detect canvas changes
  useEffect(() => {
    if (!canvas || !canvas.wrapperEl) return;
    
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(() => {
        if (gridObjectsRef.current.length === 0 || 
            !gridObjectsRef.current.some(obj => obj.canvas === canvas)) {
          attemptsRef.current += 1;
          if (attemptsRef.current <= 5) {
            logger.info(`Canvas mutation detected, recreating grid (attempt ${attemptsRef.current})`);
            createGridWithRetry();
          }
        }
      });
    });
    
    observer.observe(canvas.wrapperEl, { 
      attributes: true, 
      childList: true, 
      subtree: true 
    });
    
    return () => observer.disconnect();
  }, [canvas]);
  
  // Initial grid creation
  useEffect(() => {
    if (!canvas) return;
    
    logger.info("SimpleGridLayer: Initializing grid");
    
    // Create grid with a short delay to ensure canvas is ready
    const timer = setTimeout(() => {
      createGridWithRetry();
    }, 500);
    
    return () => {
      clearTimeout(timer);
    };
  }, [canvas]);
  
  // Health check for grid at intervals
  useEffect(() => {
    if (!canvas) return;
    
    const healthCheck = setInterval(() => {
      if (!gridCreated || gridObjectsRef.current.length === 0) {
        logger.warn("Grid health check failed, attempting recreation");
        createGridWithRetry();
      } else {
        // Ensure grid is visible
        ensureGridVisible(canvas);
      }
    }, 5000);
    
    return () => clearInterval(healthCheck);
  }, [canvas, gridCreated]);
  
  return null; // This is a non-visual component
};

export default SimpleGridLayer;
