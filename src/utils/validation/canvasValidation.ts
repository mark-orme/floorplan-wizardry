
/**
 * Canvas Validation Utilities
 * Provides schema validation for canvas data to prevent data corruption
 * and potential security issues from invalid input
 */
import { z } from 'zod';
import logger from '@/utils/logger';

// Define schema for point coordinates
const PointSchema = z.object({
  x: z.number(),
  y: z.number()
});

// Define schema for fabric object common properties
const FabricObjectBaseSchema = z.object({
  type: z.string(),
  version: z.string().optional(),
  originX: z.string().optional(),
  originY: z.string().optional(),
  left: z.number(),
  top: z.number(),
  width: z.number(),
  height: z.number(),
  fill: z.string().optional(),
  stroke: z.string().optional(),
  strokeWidth: z.number().optional(),
  scaleX: z.number().optional(),
  scaleY: z.number().optional(),
  angle: z.number().optional(),
  flipX: z.boolean().optional(),
  flipY: z.boolean().optional(),
  opacity: z.number().optional(),
  visible: z.boolean().optional(),
  objectType: z.string().optional(),
  backgroundColor: z.string().optional(),
  selectable: z.boolean().optional()
});

// Schema for path objects
const PathObjectSchema = FabricObjectBaseSchema.extend({
  type: z.literal('path'),
  path: z.array(z.array(z.union([z.string(), z.number()]))).or(z.string())
});

// Schema for rectangle objects
const RectObjectSchema = FabricObjectBaseSchema.extend({
  type: z.literal('rect'),
  rx: z.number().optional(),
  ry: z.number().optional()
});

// Schema for circle objects
const CircleObjectSchema = FabricObjectBaseSchema.extend({
  type: z.literal('circle'),
  radius: z.number()
});

// Schema for text objects
const TextObjectSchema = FabricObjectBaseSchema.extend({
  type: z.literal('text'),
  text: z.string(),
  fontSize: z.number().optional(),
  fontFamily: z.string().optional(),
  fontWeight: z.union([z.string(), z.number()]).optional(),
  textAlign: z.string().optional(),
  lineHeight: z.number().optional()
});

// Union schema for different fabric object types
const FabricObjectSchema = z.union([
  PathObjectSchema,
  RectObjectSchema,
  CircleObjectSchema,
  TextObjectSchema,
  FabricObjectBaseSchema // Generic fallback for other object types
]);

// Schema for the entire canvas data
export const CanvasDataSchema = z.object({
  version: z.string().optional(),
  objects: z.array(FabricObjectSchema),
  background: z.string().optional(),
  backgroundImage: z.any().optional()
});

/**
 * Validate canvas data before saving to prevent data corruption
 * @param canvasData The canvas data to validate
 * @returns Whether the data is valid
 */
export const validateCanvasData = (canvasData: unknown): boolean => {
  try {
    CanvasDataSchema.parse(canvasData);
    return true;
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Log validation error details but don't expose them to the user interface
      logger.error('Canvas validation failed', { 
        // Sanitize error to prevent sensitive data leakage
        issues: error.issues.map(issue => ({
          path: issue.path,
          message: issue.message
        }))
      });
    } else {
      logger.error('Unknown validation error', { error });
    }
    return false;
  }
};

/**
 * Safely sanitize and prepare canvas data for storage
 * @param canvasData Raw canvas data
 * @returns Validated and sanitized canvas data or null if invalid
 */
export const sanitizeCanvasData = (canvasData: unknown): object | null => {
  try {
    // Valid objects will pass through, invalid ones will throw an error
    const validData = CanvasDataSchema.parse(canvasData);
    
    // Additional sanitization could be done here if needed
    
    return validData;
  } catch (error) {
    logger.error('Canvas data sanitization failed', { error });
    return null;
  }
};
