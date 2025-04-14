
import { Canvas as FabricCanvas } from "fabric";
import { DrawingMode } from "@/constants/drawingModes";
import logger from "@/utils/logger";
import { captureMessage } from "@/utils/sentry";

/**
 * Validate the straight line drawing tool setup
 * This is a diagnostic tool to help troubleshoot drawing issues
 * 
 * @param canvas The canvas to validate
 * @param tool The current tool
 * @returns Whether the validation passed
 */
export function validateStraightLineDrawing(
  canvas: FabricCanvas,
  tool: DrawingMode
): boolean {
  if (tool !== DrawingMode.STRAIGHT_LINE) {
    logger.warn('Called validateStraightLineDrawing with incorrect tool', { 
      tool, 
      expected: DrawingMode.STRAIGHT_LINE 
    });
    return false;
  }

  try {
    // Check if canvas has required properties
    if (!canvas.freeDrawingBrush) {
      logger.error('Canvas missing freeDrawingBrush property', { tool });
      return false;
    }

    // Check if key event handlers are registered
    // This is a simple check and not exhaustive
    const hasEvents = (
      canvas.__eventListeners && 
      Object.keys(canvas.__eventListeners).length > 0
    );
    
    if (!hasEvents) {
      logger.warn('Canvas may be missing event listeners for straight line drawing', { tool });
    }

    // Check canvas drawing mode
    if (canvas.isDrawingMode) {
      logger.info('Canvas is in drawing mode for straight line tool', { 
        isDrawingMode: canvas.isDrawingMode,
        tool
      });
    } else {
      logger.warn('Canvas is not in drawing mode for straight line tool', { 
        isDrawingMode: canvas.isDrawingMode,
        tool
      });
    }

    // Log brush settings
    const brushSettings = {
      color: canvas.freeDrawingBrush.color,
      width: canvas.freeDrawingBrush.width,
      type: canvas.freeDrawingBrush.type
    };
    
    logger.info('Straight line tool brush settings', brushSettings);

    // Report the validation success
    captureMessage(
      'Straight line tool validation passed',
      'line-tool-validation',
      {
        tags: {
          tool: DrawingMode.STRAIGHT_LINE,
          result: 'success'
        },
        extra: {
          brushSettings,
          canvasSettings: {
            width: canvas.width,
            height: canvas.height,
            isDrawingMode: canvas.isDrawingMode,
            hasEvents
          }
        }
      }
    );

    return true;
  } catch (error) {
    logger.error('Error validating straight line tool', {
      error: error instanceof Error ? error.message : 'Unknown error',
      tool
    });
    
    captureMessage(
      'Straight line tool validation failed',
      'line-tool-validation-error',
      {
        level: 'error',
        tags: {
          tool: DrawingMode.STRAIGHT_LINE,
          result: 'error'
        },
        extra: {
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    );
    
    return false;
  }
}

/**
 * Register a canvas instance for debugging
 * @param canvas The canvas to register
 */
export function registerCanvasForDebugging(canvas: FabricCanvas): void {
  if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
    // For debugging only - will allow validation to access the canvas
    (window as any).fabricCanvas = canvas;
    
    logger.debug('Canvas registered for debugging');
  }
}

/**
 * Validate that the canvas grid is properly set up
 * @param canvas The canvas to validate
 * @returns Whether the validation passed
 */
export function validateGridSetup(canvas: FabricCanvas): boolean {
  try {
    // Check if grid objects exist
    const gridObjects = canvas.getObjects().filter(obj => 
      (obj as any).isGrid === true || (obj as any).objectType === 'grid'
    );
    
    const gridCount = gridObjects.length;
    const visibleGridCount = gridObjects.filter(obj => obj.visible === true).length;
    
    logger.info('Grid validation results', {
      gridObjectCount: gridCount,
      visibleGridCount,
      hasGrid: gridCount > 0,
      allVisible: visibleGridCount === gridCount
    });
    
    // Report to Sentry
    captureMessage(
      `Grid validation ${gridCount > 0 ? 'passed' : 'failed'}`,
      'grid-validation',
      {
        level: gridCount > 0 ? 'info' : 'warning',
        tags: {
          hasGrid: String(gridCount > 0),
          allVisible: String(visibleGridCount === gridCount)
        },
        extra: {
          gridCount,
          visibleGridCount,
          canvasObjectCount: canvas.getObjects().length
        }
      }
    );
    
    return gridCount > 0;
  } catch (error) {
    logger.error('Error validating grid setup', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    return false;
  }
}
