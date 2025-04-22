
import { useCallback } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import { useDrawingContext } from '@/contexts/DrawingContext';
import logger from '@/utils/logger';

interface UseDrawingOperationsProps {
  canvas: FabricCanvas | null;
}

/**
 * Hook that provides drawing operations for the canvas
 */
export const useDrawingOperations = ({ canvas }: UseDrawingOperationsProps) => {
  const { 
    activeTool,
    lineColor, 
    lineThickness,
    addToHistory
  } = useDrawingContext();
  
  /**
   * Delete selected objects from the canvas
   */
  const deleteSelectedObjects = useCallback(() => {
    if (!canvas) return;
    
    const selectedObjects = canvas.getActiveObjects();
    
    if (selectedObjects.length === 0) {
      logger.info('No objects selected to delete');
      return;
    }
    
    logger.info(`Deleting ${selectedObjects.length} selected objects`);
    
    // Save state before deletion
    if (addToHistory) {
      addToHistory();
    }
    
    // Handle group selection
    if (canvas.getActiveObject()?.type === 'activeSelection') {
      canvas.getActiveObject().forEachObject((obj: FabricObject) => {
        canvas.remove(obj);
      });
      canvas.discardActiveObject();
    } else {
      canvas.remove(canvas.getActiveObject());
    }
    
    canvas.requestRenderAll();
  }, [canvas, addToHistory]);
  
  /**
   * Clear all objects from the canvas
   */
  const clearCanvas = useCallback(() => {
    if (!canvas) return;
    
    // Save state before clearing
    if (addToHistory) {
      addToHistory();
    }
    
    // Get all non-grid objects (assuming grid objects have a special flag)
    const allObjects = canvas.getObjects();
    const nonGridObjects = allObjects.filter(obj => 
      !(obj as any).isGrid
    );
    
    if (nonGridObjects.length === 0) {
      logger.info('No objects to clear on canvas');
      return;
    }
    
    logger.info(`Clearing ${nonGridObjects.length} objects from canvas`);
    
    // Remove all non-grid objects
    nonGridObjects.forEach(obj => {
      canvas.remove(obj);
    });
    
    canvas.discardActiveObject();
    canvas.requestRenderAll();
  }, [canvas, addToHistory]);
  
  /**
   * Configure the canvas for the current drawing mode
   */
  const configureDrawingMode = useCallback(() => {
    if (!canvas) return;
    
    // Set drawing mode based on current tool
    switch (activeTool) {
      case DrawingMode.DRAW:
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush.color = lineColor;
        canvas.freeDrawingBrush.width = lineThickness;
        break;
      case DrawingMode.SELECT:
        canvas.isDrawingMode = false;
        canvas.selection = true;
        break;
      case DrawingMode.HAND:
        canvas.isDrawingMode = false;
        canvas.selection = false;
        break;
      default:
        canvas.isDrawingMode = false;
        break;
    }
    
    logger.info(`Drawing mode updated: ${activeTool}`);
    
    canvas.requestRenderAll();
  }, [canvas, activeTool, lineColor, lineThickness]);
  
  return {
    deleteSelectedObjects,
    clearCanvas,
    configureDrawingMode
  };
};
