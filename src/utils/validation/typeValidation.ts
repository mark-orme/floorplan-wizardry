
/**
 * Type validation utilities
 * Provides runtime validation for TypeScript types
 * @module validation/typeValidation
 */
import { z } from 'zod';
import { DebugInfoState, Point, DrawingState, CanvasDimensions, PerformanceStats } from '@/types';

/**
 * Point schema for validation
 */
export const pointSchema = z.object({
  x: z.number(),
  y: z.number()
});

/**
 * Canvas dimensions schema for validation
 */
export const canvasDimensionsSchema = z.object({
  width: z.number().min(0),
  height: z.number().min(0)
});

/**
 * Performance stats schema for validation
 */
export const performanceStatsSchema = z.object({
  fps: z.number().optional(),
  frameTime: z.number().optional(),
  maxFrameTime: z.number().optional(),
  longFrames: z.number().optional(),
  droppedFrames: z.number().optional(),
  memory: z.number().optional(),
  objectCount: z.number().optional(),
  drawCalls: z.number().optional(),
  renderTime: z.number().optional(),
  eventTime: z.number().optional()
}).catchall(z.number().optional());

/**
 * Debug info state schema for validation
 */
export const debugInfoStateSchema = z.object({
  // Required fields
  showDebugInfo: z.boolean(),
  canvasInitialized: z.boolean(),
  dimensionsSet: z.boolean(),
  gridCreated: z.boolean(),
  brushInitialized: z.boolean(),
  canvasReady: z.boolean(),
  canvasCreated: z.boolean(),
  canvasLoaded: z.boolean(),
  lastInitTime: z.number(),
  lastGridCreationTime: z.number(),
  gridObjectCount: z.number(),
  canvasDimensions: canvasDimensionsSchema,
  hasError: z.boolean(),
  errorMessage: z.string(),
  performanceStats: performanceStatsSchema,
  
  // Optional fields
  gridInitialized: z.boolean().optional(),
  messages: z.array(z.string()).optional(),
  objectCount: z.number().optional(),
  dimensions: z.object({
    width: z.number(),
    height: z.number()
  }).optional(),
  currentTool: z.string().optional(),
  initTime: z.number().optional(),
  gridObjects: z.number().optional(),
  canvasObjects: z.number().optional(),
  canvasWidth: z.number().optional(),
  canvasHeight: z.number().optional(),
  devicePixelRatio: z.number().optional(),
  lastError: z.any().optional(),
  lastErrorTime: z.number().optional()
});

/**
 * Drawing state schema for validation
 */
export const drawingStateSchema = z.object({
  // Required fields
  isDrawing: z.boolean(),
  startPoint: pointSchema.nullable(),
  currentPoint: pointSchema.nullable(),
  midPoint: pointSchema.nullable(),
  selectionActive: z.boolean(),
  currentZoom: z.number(),
  points: z.array(pointSchema),
  distance: z.number().nullable(),
  
  // Optional fields
  cursorPosition: pointSchema.nullable().optional()
});

/**
 * Validate a debug info state object
 * @param debugInfo - The debug info state to validate
 * @returns The validated debug info state or throws an error
 */
export function validateDebugInfoState(debugInfo: unknown): DebugInfoState {
  return debugInfoStateSchema.parse(debugInfo);
}

/**
 * Validate a point object
 * @param point - The point to validate
 * @returns The validated point or throws an error
 */
export function validatePoint(point: unknown): Point {
  return pointSchema.parse(point);
}

/**
 * Validate a drawing state object
 * @param drawingState - The drawing state to validate
 * @returns The validated drawing state or throws an error
 */
export function validateDrawingState(drawingState: unknown): DrawingState {
  return drawingStateSchema.parse(drawingState);
}

/**
 * Validate canvas dimensions object
 * @param dimensions - The dimensions to validate
 * @returns The validated dimensions or throws an error
 */
export function validateCanvasDimensions(dimensions: unknown): CanvasDimensions {
  return canvasDimensionsSchema.parse(dimensions);
}

/**
 * Create a partial validator for debug info state
 * Useful for validating partial updates
 * @returns A validator for partial debug info state
 */
export function createPartialDebugInfoValidator() {
  const partialSchema = debugInfoStateSchema.partial();
  return (data: unknown): Partial<DebugInfoState> => partialSchema.parse(data) as Partial<DebugInfoState>;
}

/**
 * Create a partial validator for drawing state
 * Useful for validating partial updates
 * @returns A validator for partial drawing state
 */
export function createPartialDrawingStateValidator() {
  const partialSchema = drawingStateSchema.partial();
  return (data: unknown): Partial<DrawingState> => partialSchema.parse(data) as Partial<DrawingState>;
}
