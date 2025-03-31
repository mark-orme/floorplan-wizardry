
/**
 * Utility to validate and repair the straight line tool setup
 * @module utils/diagnostics/straightLineValidator
 */
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import logger from '@/utils/logger';
import { captureMessage, captureError } from '@/utils/sentry';

/**
 * Verify that mouse event handlers are properly set for the straight line tool
 * @param {FabricCanvas} canvas - The fabric canvas to verify
 * @returns {boolean} Whether the event handlers are properly set
 */
export const verifyLineToolEventHandlers = (canvas: FabricCanvas | null): boolean => {
  if (!canvas) {
    logger.error('Cannot verify straight line tool: canvas is null');
    captureError(new Error('Cannot verify line tool: canvas is null'), 'line-tool-null-canvas');
    return false;
  }
  
  try {
    // In Fabric.js v6, we need to use __eventListeners as a last resort
    // This is not ideal and might break in future versions
    // @ts-ignore - This is a private property but necessary for diagnostics
    const eventListeners = canvas.__eventListeners || {};
    
    const hasMouseDown = !!eventListeners['mouse:down']?.length;
    const hasMouseMove = !!eventListeners['mouse:move']?.length;
    const hasMouseUp = !!eventListeners['mouse:up']?.length;
    
    const result = hasMouseDown && hasMouseMove && hasMouseUp;
    
    logger.info('Straight line tool event handler check', { 
      hasMouseDown, 
      hasMouseMove,
      hasMouseUp,
      result
    });
    
    return result;
  } catch (error) {
    logger.error('Error verifying straight line tool event handlers', error);
    captureError(error as Error, 'line-tool-verify-error');
    return false;
  }
};

/**
 * Validate and attempt to repair straight line drawing capabilities
 * @param {FabricCanvas} canvas - The fabric canvas
 * @param {DrawingMode} currentTool - The currently active drawing tool
 * @returns {boolean} Whether the tool is functioning properly
 */
export const validateStraightLineTool = (
  canvas: FabricCanvas | null,
  currentTool: DrawingMode
): boolean => {
  if (!canvas) {
    return false;
  }
  
  if (currentTool !== DrawingMode.STRAIGHT_LINE) {
    // Not relevant for other tools
    return true;
  }
  
  try {
    const diagnostics = {
      isDrawingMode: canvas.isDrawingMode,
      selection: canvas.selection, 
      defaultCursor: canvas.defaultCursor,
      selectableObjectsCount: canvas.getObjects().filter(obj => obj.selectable).length,
      hasValidEventHandlers: verifyLineToolEventHandlers(canvas)
    };
    
    logger.info('Straight line tool validation', diagnostics);
    
    let isValid = true;
    const issues = [];
    
    // Check for proper configuration
    if (canvas.isDrawingMode) {
      issues.push('isDrawingMode should be false');
      isValid = false;
    }
    
    if (canvas.selection) {
      issues.push('selection should be false');
      isValid = false;
    }
    
    if (canvas.defaultCursor !== 'crosshair') {
      issues.push(`cursor should be crosshair, got ${canvas.defaultCursor}`);
      isValid = false;
    }
    
    if (!diagnostics.hasValidEventHandlers) {
      issues.push('missing required event handlers');
      isValid = false;
    }
    
    if (diagnostics.selectableObjectsCount > 0) {
      // Non-critical warning
      logger.warn(`${diagnostics.selectableObjectsCount} objects are still selectable during straight line mode`);
    }
    
    // Report validation result
    if (isValid) {
      captureMessage('Straight line tool validation passed', 'line-tool-valid', {
        extra: diagnostics
      });
    } else {
      captureError(
        new Error(`Straight line tool validation failed: ${issues.join(', ')}`),
        'line-tool-invalid',
        { extra: diagnostics }
      );
      
      // Attempt repairs if needed
      attemptLineToolRepair(canvas);
    }
    
    return isValid;
  } catch (error) {
    logger.error('Error validating straight line tool', error);
    captureError(error as Error, 'line-tool-validation-error');
    return false;
  }
};

/**
 * Attempt to repair straight line tool configuration
 * @param {FabricCanvas} canvas - The fabric canvas
 */
const attemptLineToolRepair = (canvas: FabricCanvas): void => {
  logger.info('Attempting to repair straight line tool configuration');
  
  try {
    // Fix canvas settings
    canvas.isDrawingMode = false;
    canvas.selection = false;
    canvas.defaultCursor = 'crosshair';
    canvas.hoverCursor = 'crosshair';
    
    // Make objects non-selectable
    canvas.getObjects().forEach(obj => {
      if ((obj as any).objectType !== 'grid') {
        obj.selectable = false;
      }
    });
    
    // Discard any active object
    canvas.discardActiveObject();
    canvas.requestRenderAll();
    
    captureMessage('Attempted straight line tool repair', 'line-tool-repair');
    
    // Note: We can't really recreate event handlers here
    // That should be handled by the component/hook lifecycle
  } catch (error) {
    logger.error('Error repairing straight line tool', error);
    captureError(error as Error, 'line-tool-repair-error');
  }
};

/**
 * Schedule periodic validation of straight line tool
 * @param {FabricCanvas} canvas - The fabric canvas
 * @param {DrawingMode} currentTool - The currently active drawing tool
 */
export const scheduleStraightLineValidation = (
  canvas: FabricCanvas | null,
  currentTool: DrawingMode
): (() => void) => {
  if (currentTool !== DrawingMode.STRAIGHT_LINE) {
    return () => {}; // No-op cleanup function
  }
  
  // Initial validation
  validateStraightLineTool(canvas, currentTool);
  
  // Schedule periodic validation (every 5 seconds)
  const intervalId = setInterval(() => {
    validateStraightLineTool(canvas, currentTool);
  }, 5000);
  
  // Return cleanup function
  return () => {
    clearInterval(intervalId);
  };
};
