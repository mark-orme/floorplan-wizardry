
/**
 * Drawing Tool Validator
 * Validates drawing tool inputs and configurations
 */
import { z } from 'zod';
import { DrawingMode } from '@/constants/drawingModes';

/**
 * Schema for validating drawing tool configuration
 */
export const drawingToolSchema = z.object({
  tool: z.nativeEnum(DrawingMode),
  lineThickness: z.number().positive().min(0.5).max(20).optional(),
  lineColor: z.string().regex(/^#[0-9A-Fa-f]{3,6}$/).optional(),
  fillColor: z.string().regex(/^#[0-9A-Fa-f]{3,6}$/).optional(),
  opacity: z.number().min(0).max(1).optional()
});

/**
 * Schema for validating line drawing parameters
 */
export const lineDrawingSchema = z.object({
  startX: z.number(),
  startY: z.number(),
  endX: z.number(),
  endY: z.number(),
  color: z.string().regex(/^#[0-9A-Fa-f]{3,6}$/),
  thickness: z.number().positive().min(0.5).max(20),
  snapToGrid: z.boolean().optional()
});

/**
 * Schema for validating drawing canvas configuration
 */
export const canvasConfigSchema = z.object({
  width: z.number().positive(),
  height: z.number().positive(),
  zoom: z.number().positive().min(0.1).max(10),
  gridSize: z.number().positive().optional(),
  snapToGrid: z.boolean().optional(),
  backgroundColor: z.string().optional()
});

/**
 * Function overload declarations for validateStraightLineDrawing
 */

/**
 * Validate straight line drawing parameters
 * 
 * @param startX - Starting X coordinate
 * @param startY - Starting Y coordinate
 * @param endX - Ending X coordinate
 * @param endY - Ending Y coordinate
 * @param options - Optional configuration
 * @returns Validation result object with success status and error messages
 */
export function validateStraightLineDrawing(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  options?: {
    color?: string;
    thickness?: number;
    snapToGrid?: boolean;
  }
): { 
  valid: boolean; 
  errors: string[]; 
  sanitized?: {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    color: string;
    thickness: number;
    snapToGrid: boolean;
  }
};

/**
 * Overloaded version for canvas-specific validation
 * 
 * @param canvas - Fabric.js Canvas instance
 * @param currentTool - Current drawing tool
 * @returns Validation result object
 */
export function validateStraightLineDrawing(
  canvas: any,
  currentTool: DrawingMode
): { valid: boolean; errors: string[] };

/**
 * Implementation of validateStraightLineDrawing
 */
export function validateStraightLineDrawing(
  startXOrCanvas: number | any,
  startYOrTool: number | DrawingMode,
  endX?: number,
  endY?: number,
  options: {
    color?: string;
    thickness?: number;
    snapToGrid?: boolean;
  } = {}
): { 
  valid: boolean; 
  errors: string[]; 
  sanitized?: {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    color: string;
    thickness: number;
    snapToGrid: boolean;
  }
} | { valid: boolean; errors: string[] } {
  // Check if we're calling the canvas-specific overload
  if (typeof startXOrCanvas === 'object' && typeof startYOrTool === 'string') {
    const canvas = startXOrCanvas;
    const currentTool = startYOrTool;
    
    // Canvas-specific validation logic
    try {
      // Basic validation - ensure we have a canvas and the correct tool
      if (!canvas) {
        return { valid: false, errors: ['Canvas is not available'] };
      }
      
      if (currentTool !== DrawingMode.STRAIGHT_LINE) {
        return { valid: true, errors: [] }; // Not applicable for other tools
      }
      
      // Check if canvas has necessary properties for line drawing
      const hasProperDrawingMode = canvas.isDrawingMode === false;
      const hasProperCursor = canvas.defaultCursor === 'crosshair';
      
      const errors = [];
      if (!hasProperDrawingMode) {
        errors.push('Canvas drawing mode should be disabled for straight line tool');
      }
      
      if (!hasProperCursor) {
        errors.push('Canvas cursor should be set to crosshair for line drawing');
      }
      
      return {
        valid: errors.length === 0,
        errors
      };
    } catch (error) {
      return {
        valid: false,
        errors: ['Unexpected error during straight line tool validation']
      };
    }
  } else {
    // We're calling the coordinate-based overload
    const startX = startXOrCanvas as number;
    const startY = startYOrTool as number;
    
    // Default values
    const color = options.color || '#000000';
    const thickness = options.thickness || 1;
    const snapToGrid = options.snapToGrid || false;
    
    try {
      // Run validation with Zod schema
      const result = lineDrawingSchema.safeParse({
        startX,
        startY,
        endX,
        endY,
        color,
        thickness,
        snapToGrid
      });
      
      if (result.success) {
        // The problem was here - we need to ensure all properties are defined
        // in the sanitized output to match the return type
        return {
          valid: true,
          errors: [],
          sanitized: {
            startX: result.data.startX,
            startY: result.data.startY,
            endX: result.data.endX,
            endY: result.data.endY,
            color: result.data.color,
            thickness: result.data.thickness,
            snapToGrid: result.data.snapToGrid === undefined ? false : result.data.snapToGrid
          }
        };
      } else {
        return {
          valid: false,
          errors: result.error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
        };
      }
    } catch (error) {
      return {
        valid: false,
        errors: ['Unexpected validation error']
      };
    }
  }
}

/**
 * Validate drawing tool configuration
 * 
 * @param config - Drawing tool configuration
 * @returns Validation result
 */
export function validateDrawingTool(config: unknown): {
  valid: boolean;
  errors: string[];
  sanitized?: z.infer<typeof drawingToolSchema>;
} {
  try {
    const result = drawingToolSchema.safeParse(config);
    
    if (result.success) {
      return {
        valid: true,
        errors: [],
        sanitized: result.data
      };
    } else {
      return {
        valid: false,
        errors: result.error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      };
    }
  } catch (error) {
    return {
      valid: false,
      errors: ['Unexpected validation error']
    };
  }
}

/**
 * Validate canvas configuration
 * 
 * @param config - Canvas configuration
 * @returns Validation result
 */
export function validateCanvasConfig(config: unknown): {
  valid: boolean;
  errors: string[];
  sanitized?: z.infer<typeof canvasConfigSchema>;
} {
  try {
    const result = canvasConfigSchema.safeParse(config);
    
    if (result.success) {
      return {
        valid: true,
        errors: [],
        sanitized: result.data
      };
    } else {
      return {
        valid: false,
        errors: result.error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      };
    }
  } catch (error) {
    return {
      valid: false,
      errors: ['Unexpected validation error']
    };
  }
}
