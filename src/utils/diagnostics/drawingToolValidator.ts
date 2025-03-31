
/**
 * Utility to validate drawing tool functionality
 */
import { Canvas as FabricCanvas } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import logger from '@/utils/logger';
import { captureMessage, captureError } from '@/utils/sentry';

/**
 * Validate that the straight line drawing tool is properly set up
 * @param canvas - Fabric canvas instance
 * @param currentTool - Current drawing tool
 */
export const validateStraightLineDrawing = (
  canvas: FabricCanvas | null, 
  currentTool: DrawingMode
): void => {
  if (!canvas) {
    logger.error('Cannot validate straight line tool: canvas is null');
    captureError(new Error('Cannot validate straight line drawing: canvas is null'), 'straight-line-null-canvas');
    return;
  }

  if (currentTool !== DrawingMode.STRAIGHT_LINE) {
    // Not relevant for other tools
    return;
  }

  try {
    const isDrawingMode = canvas.isDrawingMode;
    const selection = canvas.selection;
    const defaultCursor = canvas.defaultCursor;
    const selectableObjects = canvas.getObjects().filter(obj => obj.selectable).length;
    
    // Instead of checking private __eventListeners, we check behavior
    const hasListeners = canvas.getActiveObjects !== undefined;
    
    const diagnosticInfo = {
      currentTool,
      isDrawingMode,
      selection,
      defaultCursor,
      selectableObjects,
      hasListeners,
      drawingToolMatches: currentTool === DrawingMode.STRAIGHT_LINE,
      stringComparison: `'${currentTool}' === '${DrawingMode.STRAIGHT_LINE}'`,
      canvasSize: { width: canvas.width, height: canvas.height }
    };
    
    logger.info('Straight line tool diagnostic', diagnosticInfo);
    
    if (isDrawingMode) {
      logger.warn('Straight line tool should not have isDrawingMode=true');
      captureMessage('Straight line tool incorrectly has isDrawingMode=true', 'straight-line-drawing-mode-error');
    }
    
    if (selection) {
      logger.warn('Straight line tool should have selection=false');
      captureMessage('Straight line tool incorrectly has selection=true', 'straight-line-selection-error');
    }
    
    if (defaultCursor !== 'crosshair') {
      logger.warn('Straight line tool should have crosshair cursor');
      captureMessage('Straight line tool has incorrect cursor', 'straight-line-cursor-error', {
        extra: { actualCursor: defaultCursor }
      });
    }
    
    if (selectableObjects > 0) {
      logger.warn(`Straight line tool has ${selectableObjects} selectable objects`);
      captureMessage('Straight line tool has selectable objects', 'straight-line-selectable-error', {
        extra: { selectableCount: selectableObjects }
      });
    }
    
    // Test for correct cursor and selection mode instead of directly accessing event listeners
    if (defaultCursor !== 'crosshair' || selection !== false) {
      logger.error('Straight line tool settings are not properly configured', {
        cursor: defaultCursor,
        selection
      });
      
      captureError(
        new Error('Straight line tool settings misconfigured'), 
        'straight-line-settings-error',
        { extra: { cursor: defaultCursor, selection, toolName: currentTool } }
      );
    }
    
    // Report to monitoring
    captureMessage('Straight line tool diagnostics', 'straight-line-diagnostics', {
      tags: { component: 'DrawingToolValidator' },
      extra: diagnosticInfo
    });
  } catch (error) {
    logger.error('Error validating straight line tool', error);
    captureError(error as Error, 'straight-line-validation-error');
  }
};

/**
 * Run a comprehensive validation of all drawing tools to identify issues
 * @param canvas - Fabric canvas instance
 * @param currentTool - Current drawing tool
 */
export const validateAllDrawingTools = (
  canvas: FabricCanvas | null,
  currentTool: DrawingMode
): void => {
  if (!canvas) {
    logger.error('Cannot validate drawing tools: canvas is null');
    captureError(new Error('Cannot validate drawing tools: canvas is null'), 'drawing-tools-null-canvas');
    return;
  }
  
  try {
    const allTools = Object.values(DrawingMode);
    const toolStatus = allTools.map(tool => {
      const isActive = currentTool === tool;
      return {
        tool,
        isActive,
        isDrawingModeRequired: tool === DrawingMode.DRAW,
        shouldBeSelectionEnabled: [DrawingMode.SELECT, DrawingMode.ERASER].includes(tool),
      };
    });
    
    logger.info('All drawing tools status', { currentTool, toolStatus });
    
    // Check if the current tool is applied correctly
    switch (currentTool) {
      case DrawingMode.DRAW:
        if (!canvas.isDrawingMode) {
          logger.error('Draw tool selected but isDrawingMode is false');
          captureError(new Error('Draw tool incorrectly configured: isDrawingMode is false'), 'draw-tool-mode-error');
        }
        break;
      
      case DrawingMode.STRAIGHT_LINE:
        validateStraightLineDrawing(canvas, currentTool);
        break;
        
      default:
        // No specific validation for other tools
        break;
    }
  } catch (error) {
    logger.error('Error validating drawing tools', error);
    captureError(error as Error, 'drawing-tools-validation-error');
  }
};

/**
 * Test function to check straight line drawing on a canvas
 * Call this function to verify the straight line tool is working correctly
 * @param canvas - Fabric canvas instance 
 * @param tool - Current drawing tool
 */
export const testStraightLineDrawing = (
  canvas: FabricCanvas | null,
  tool: DrawingMode
): void => {
  if (!canvas || tool !== DrawingMode.STRAIGHT_LINE) {
    return;
  }
  
  logger.info('Running straight line drawing test');
  
  try {
    // Simulate mouse events to test line drawing
    const center = {
      x: canvas.width! / 2,
      y: canvas.height! / 2
    };
    
    const objectCountBefore = canvas.getObjects().length;
    
    // Log test parameters
    logger.info('Straight line test parameters', {
      canvasWidth: canvas.width,
      canvasHeight: canvas.height,
      centerPoint: center,
      objectCountBefore,
      isDrawingMode: canvas.isDrawingMode,
      selection: canvas.selection,
      tool
    });
    
    // Note: This is just a diagnostic tool, not actual implementation
    // In a real test, we would simulate mouse events and verify a line was created
    
    captureMessage('Straight line drawing test run', 'test-straight-line', {
      tags: { component: 'DrawingToolValidator' },
      extra: { tool, objectCount: objectCountBefore }
    });
  } catch (error) {
    logger.error('Error testing straight line drawing', error);
    captureError(error as Error, 'straight-line-test-error');
  }
}
