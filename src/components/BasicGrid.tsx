
/**
 * Basic grid component for the canvas
 * Renders a grid on the canvas for visual reference and snapping
 * @module components/BasicGrid
 */
import { useEffect, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { createCompleteGrid, setGridVisibility } from '@/utils/gridUtils';
import { GridCreationState, DEFAULT_GRID_CREATION_STATE } from '@/types/core/GridTypes';
import { captureMessage } from '@/utils/sentryUtils';
import logger from '@/utils/logger';

/**
 * Properties for the BasicGrid component
 */
interface BasicGridProps {
  /** Fabric canvas instance to render the grid on */
  canvas: FabricCanvas;
  /** Callback function when the grid is created */
  onGridCreated?: (gridObjects: any[]) => void;
  /** Initial visibility setting for the grid */
  initialVisibility?: boolean;
}

/**
 * BasicGrid component
 * Renders and manages a grid on the canvas
 * 
 * @param {BasicGridProps} props - Component properties
 * @returns {null} - This component doesn't render any DOM elements
 */
export const BasicGrid = ({
  canvas,
  onGridCreated,
  initialVisibility = true
}: BasicGridProps) => {
  // Track the grid creation state
  const [gridState, setGridState] = useState<GridCreationState>(DEFAULT_GRID_CREATION_STATE);
  
  // Create the grid on component mount
  useEffect(() => {
    if (!canvas) {
      logger.warn('Cannot create grid: Canvas is null');
      return;
    }
    
    if (gridState.isCreated) {
      logger.info('Grid already created, skipping creation');
      return;
    }
    
    try {
      logger.info('Creating grid with canvas dimensions:', {
        width: canvas.width,
        height: canvas.height
      });
      
      // Create the grid with complete objects
      const gridResult = createCompleteGrid(canvas);
      
      // Set initial visibility based on prop
      setGridVisibility(canvas, gridResult.gridObjects, initialVisibility);
      
      // Update state to indicate grid is created
      setGridState({
        ...DEFAULT_GRID_CREATION_STATE,
        isCreated: true,
        objectCount: gridResult.gridObjects.length,
        exists: true,
        completed: true, // Mark as completed
        started: true // Mark as started
      });
      
      logger.info(`Grid created with ${gridResult.gridObjects.length} objects`);
      
      // Call the onGridCreated callback if provided
      if (onGridCreated) {
        onGridCreated(gridResult.gridObjects);
      }
      
      // Log to error monitoring system for tracking grid creation success
      captureMessage('Grid created successfully', {
        extra: { objectCount: gridResult.gridObjects.length }
      });
    } catch (error) {
      logger.error('Error creating grid:', error);
      
      // Set state to indicate grid creation failed
      setGridState({
        ...DEFAULT_GRID_CREATION_STATE,
        isCreated: false,
        hasError: true,
        errorMessage: error instanceof Error ? error.message : String(error),
        attempts: gridState.attempts + 1,
        lastAttemptTime: Date.now()
      });
      
      // Log to error monitoring system
      captureMessage('Grid creation failed', {
        extra: { error: String(error) }
      });
    }
  }, [canvas, onGridCreated, initialVisibility, gridState.isCreated]);
  
  // This component doesn't render any DOM elements
  return null;
};
