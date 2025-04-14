
/**
 * Drawing Tool Validator
 * Validates drawing tool configuration and state
 */
import { Canvas as FabricCanvas, BaseBrush } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import { captureMessage } from '@/utils/sentry';
import logger from '@/utils/logger';

/**
 * Validate drawing tool configuration
 * @param canvas Canvas instance
 * @param tool Current drawing tool
 */
export function validateDrawingTool(canvas: FabricCanvas, tool: DrawingMode): void {
  if (!canvas) return;
  
  // Common validation issues to check
  const issues: string[] = [];
  
  // Validate drawing mode matches tool
  if (tool === DrawingMode.DRAW && !canvas.isDrawingMode) {
    issues.push('Drawing mode not enabled for DRAW tool');
  } else if (tool !== DrawingMode.DRAW && canvas.isDrawingMode) {
    issues.push(`Drawing mode enabled for non-drawing tool: ${tool}`);
  }
  
  // Validate brush exists when in drawing mode
  if (tool === DrawingMode.DRAW && !canvas.freeDrawingBrush) {
    issues.push('Free drawing brush not initialized');
  }
  
  // Safe way to check for event listeners without accessing private properties
  const validateEventListeners = () => {
    try {
      // Trigger a test event to see if listeners exist
      const testEvent = new Event('test');
      let hasListeners = false;
      
      // Temporarily override the fire method to detect if listeners exist
      const originalFire = canvas.fire;
      canvas.fire = function(eventName: string) {
        if (eventName === 'test:event') {
          hasListeners = true;
        }
        return this;
      };
      
      // Try to fire a test event
      canvas.fire('test:event', { test: true });
      
      // Restore original method
      canvas.fire = originalFire;
      
      if (!hasListeners && (tool === DrawingMode.DRAW || tool === DrawingMode.STRAIGHT_LINE)) {
        issues.push(`No event listeners detected for tool: ${tool}`);
      }
    } catch (error) {
      logger.warn('Error checking event listeners', { error });
    }
  };
  
  validateEventListeners();
  
  // Check brush settings if applicable
  if (canvas.freeDrawingBrush) {
    const brush = canvas.freeDrawingBrush;
    
    // Check if brush has valid width
    if (brush.width <= 0) {
      issues.push('Invalid brush width: must be greater than 0');
    }
    
    // Check if brush has valid color
    if (!brush.color) {
      issues.push('Invalid brush color: color not set');
    }
  }
  
  // Report any found issues
  if (issues.length > 0) {
    logger.warn('Drawing tool validation issues detected', { 
      tool, 
      issues,
      canvasState: {
        isDrawingMode: canvas.isDrawingMode,
        brushExists: !!canvas.freeDrawingBrush,
        brushWidth: canvas.freeDrawingBrush?.width,
        brushColor: canvas.freeDrawingBrush?.color
      }
    });
    
    captureMessage(
      'Drawing tool validation issues',
      'drawing-tool-validation',
      {
        level: 'warning',
        tags: {
          tool
        },
        extra: {
          issues,
          canvasState: {
            isDrawingMode: canvas.isDrawingMode,
            brushExists: !!canvas.freeDrawingBrush,
            brushWidth: canvas.freeDrawingBrush?.width,
            brushColor: canvas.freeDrawingBrush?.color
          }
        }
      }
    );
  }
}

/**
 * Validate straight line drawing functionality
 * @param canvas Canvas instance
 * @param tool Current drawing tool
 */
export function validateStraightLineDrawing(canvas: FabricCanvas, tool: DrawingMode): void {
  if (!canvas || tool !== DrawingMode.STRAIGHT_LINE) return;
  
  // Specific checks for straight line tool
  const issues: string[] = [];
  
  // Check that selection is disabled (it should be for drawing tools)
  if (canvas.selection) {
    issues.push('Selection enabled in straight line mode');
  }
  
  // Check cursor style
  if (canvas.defaultCursor !== 'crosshair') {
    issues.push(`Incorrect cursor in straight line mode: ${canvas.defaultCursor}`);
  }
  
  // Report any found issues
  if (issues.length > 0) {
    logger.warn('Straight line drawing validation issues', { 
      issues,
      canvasState: {
        selection: canvas.selection,
        defaultCursor: canvas.defaultCursor
      }
    });
    
    captureMessage(
      'Straight line drawing validation issues',
      'straight-line-validation',
      {
        level: 'warning',
        extra: {
          issues,
          canvasState: {
            selection: canvas.selection,
            defaultCursor: canvas.defaultCursor
          }
        }
      }
    );
  }
}
