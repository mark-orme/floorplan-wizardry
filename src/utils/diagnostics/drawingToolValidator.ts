
/**
 * Drawing Tool Validator
 * Validates drawing tool configurations
 */
import { DrawingMode } from '@/constants/drawingModes';
import logger from '@/utils/logger';
import { captureError } from '@/utils/sentryUtils';

/**
 * Check if the provided drawing tool is valid
 */
export function validateDrawingTool(tool: unknown): boolean {
  try {
    // Check if tool is a valid enum value
    return Object.values(DrawingMode).includes(tool as DrawingMode);
  } catch (error) {
    logger.warn('Invalid drawing tool:', { tool, error });
    return false;
  }
}

/**
 * Validate drawing tool options
 */
export function validateDrawingOptions(options: Record<string, any>): boolean {
  try {
    // Validate required options
    if (!options.tool || !validateDrawingTool(options.tool)) {
      logger.warn('Invalid drawing options: missing or invalid tool', { options });
      return false;
    }
    
    // Validate color format if provided
    if (options.lineColor && !isValidColorFormat(options.lineColor)) {
      logger.warn('Invalid drawing options: invalid line color format', { lineColor: options.lineColor });
      return false;
    }
    
    if (options.fillColor && !isValidColorFormat(options.fillColor)) {
      logger.warn('Invalid drawing options: invalid fill color format', { fillColor: options.fillColor });
      return false;
    }
    
    // Validate numeric properties
    if (options.lineThickness !== undefined && (typeof options.lineThickness !== 'number' || options.lineThickness <= 0)) {
      logger.warn('Invalid drawing options: invalid line thickness', { lineThickness: options.lineThickness });
      return false;
    }
    
    return true;
  } catch (error) {
    captureError(error, 'drawing-tool-validation', {
      extra: { options }
    });
    return false;
  }
}

/**
 * Check if the provided string is a valid color format
 */
function isValidColorFormat(color: string): boolean {
  // Support hex format
  const hexPattern = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
  
  // Support rgb/rgba format
  const rgbPattern = /^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(?:,\s*(?:0|1|0?\.\d+)\s*)?\)$/;
  
  return hexPattern.test(color) || rgbPattern.test(color);
}

/**
 * Report a drawing tool error
 */
export function reportDrawingToolError(tool: string, error: Error, context?: Record<string, any>): void {
  logger.error(`Drawing tool error for ${tool}:`, { error, context });
  
  captureError(error, 'drawing-tool-error', {
    tags: { tool },
    extra: context
  });
  
  // Log a diagnostic event for the canvas event system
  if (typeof window !== 'undefined' && window.dispatchEvent) {
    try {
      const diagnosticEvent = new CustomEvent('canvas:diagnostic', {
        detail: {
          type: 'tool-error',
          tool,
          error: error.message,
          timestamp: Date.now()
        }
      });
      window.dispatchEvent(diagnosticEvent);
    } catch (eventError) {
      logger.error('Failed to dispatch diagnostic event', { eventError });
    }
  }
}
