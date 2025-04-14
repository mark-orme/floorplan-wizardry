
/**
 * Canvas Validation Utilities
 * Provides Zod schemas and validation functions for canvas data
 */
import { z } from 'zod';
import { captureError } from '@/utils/sentry';
import logger from '@/utils/logger';

// Define basic schemas for canvas elements
export const pointSchema = z.object({
  x: z.number(),
  y: z.number()
});

export const lineSchema = z.object({
  id: z.string().optional(),
  type: z.literal('line'),
  x1: z.number(),
  y1: z.number(),
  x2: z.number(),
  y2: z.number(),
  stroke: z.string().optional(),
  strokeWidth: z.number().optional(),
  metadata: z.record(z.any()).optional()
});

export const polygonSchema = z.object({
  id: z.string().optional(),
  type: z.literal('polygon'),
  points: z.array(pointSchema),
  fill: z.string().optional(),
  stroke: z.string().optional(),
  strokeWidth: z.number().optional(),
  metadata: z.record(z.any()).optional()
});

export const textSchema = z.object({
  id: z.string().optional(),
  type: z.literal('text'),
  text: z.string(),
  left: z.number(),
  top: z.number(),
  fontSize: z.number().optional(),
  fontFamily: z.string().optional(),
  fill: z.string().optional(),
  metadata: z.record(z.any()).optional()
});

export const objectSchema = z.discriminatedUnion('type', [
  lineSchema,
  polygonSchema,
  textSchema,
  // Add other object types as needed
]);

export const canvasSchema = z.object({
  objects: z.array(objectSchema),
  background: z.string().optional(),
  width: z.number(),
  height: z.number(),
  version: z.string().optional(),
  metadata: z.record(z.any()).optional()
});

/**
 * Validate canvas JSON data
 * @param jsonData Canvas data as JSON string or object
 * @returns Validation result
 */
export function validateCanvasData(jsonData: string | object): {
  valid: boolean;
  data: z.infer<typeof canvasSchema> | null;
  error?: string;
} {
  try {
    // Parse JSON if string
    const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
    
    // Validate with schema
    const result = canvasSchema.safeParse(data);
    
    if (!result.success) {
      logger.warn('Canvas data validation failed', {
        error: result.error.format(),
      });
      
      return {
        valid: false,
        data: null,
        error: result.error.message
      };
    }
    
    return {
      valid: true,
      data: result.data
    };
  } catch (error) {
    captureError(error, 'canvas-validation-error', {
      extra: {
        jsonData: typeof jsonData === 'string' ? jsonData.substring(0, 100) + '...' : 'object'
      }
    });
    
    return {
      valid: false,
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error validating canvas data'
    };
  }
}

/**
 * Validate a canvas object
 * @param object Canvas object to validate
 * @returns Validation result
 */
export function validateCanvasObject(object: any): {
  valid: boolean;
  data: z.infer<typeof objectSchema> | null;
  error?: string;
} {
  try {
    const result = objectSchema.safeParse(object);
    
    if (!result.success) {
      return {
        valid: false,
        data: null,
        error: result.error.message
      };
    }
    
    return {
      valid: true,
      data: result.data
    };
  } catch (error) {
    logger.error('Error validating canvas object', { error, object });
    
    return {
      valid: false,
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error validating canvas object'
    };
  }
}
