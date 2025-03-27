
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
  eventTime: z.number().optional(),
  errorCount: z.number().optional(),
  retryCount: z.number().optional()
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
 * Use proper type assertion to ensure TypeScript knows the result matches the interface
 * 
 * @param {unknown} debugInfo - The debug info state to validate
 * @returns {DebugInfoState} The validated debug info state or throws an error
 */
export function validateDebugInfoState(debugInfo: unknown): DebugInfoState {
  const validatedData = debugInfoStateSchema.parse(debugInfo);
  // Use type assertion with required fields to ensure TypeScript recognizes this as DebugInfoState
  return validatedData as DebugInfoState;
}

/**
 * Validate a point object
 * Use proper type assertion to ensure TypeScript knows the result matches the interface
 * 
 * @param {unknown} point - The point to validate
 * @returns {Point} The validated point or throws an error
 */
export function validatePoint(point: unknown): Point {
  const validatedData = pointSchema.parse(point);
  // Use type assertion with required fields to ensure TypeScript recognizes this as Point
  return validatedData as Point;
}

/**
 * Validate a drawing state object
 * Use proper type assertion to ensure TypeScript knows the result matches the interface
 * 
 * @param {unknown} drawingState - The drawing state to validate
 * @returns {DrawingState} The validated drawing state or throws an error
 */
export function validateDrawingState(drawingState: unknown): DrawingState {
  const validatedData = drawingStateSchema.parse(drawingState);
  // Use type assertion with required fields to ensure TypeScript recognizes this as DrawingState
  return validatedData as DrawingState;
}

/**
 * Validate canvas dimensions object
 * Use proper type assertion to ensure TypeScript knows the result matches the interface
 * 
 * @param {unknown} dimensions - The dimensions to validate
 * @returns {CanvasDimensions} The validated dimensions or throws an error
 */
export function validateCanvasDimensions(dimensions: unknown): CanvasDimensions {
  const validatedData = canvasDimensionsSchema.parse(dimensions);
  // Use type assertion with required fields to ensure TypeScript recognizes this as CanvasDimensions
  return validatedData as CanvasDimensions;
}

/**
 * Create a partial validator for debug info state
 * Useful for validating partial updates
 * 
 * @returns A validator for partial debug info state
 */
export function createPartialDebugInfoValidator() {
  const partialSchema = debugInfoStateSchema.partial();
  return (data: unknown): Partial<DebugInfoState> => partialSchema.parse(data) as Partial<DebugInfoState>;
}

/**
 * Create a partial validator for drawing state
 * Useful for validating partial updates
 * 
 * @returns A validator for partial drawing state
 */
export function createPartialDrawingStateValidator() {
  const partialSchema = drawingStateSchema.partial();
  return (data: unknown): Partial<DrawingState> => partialSchema.parse(data) as Partial<DrawingState>;
}
