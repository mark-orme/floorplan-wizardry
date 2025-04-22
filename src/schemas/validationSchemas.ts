import * as z from 'zod';
import { ZodError } from 'zod';
import { DrawingMode } from '@/constants/drawingModes';

/**
 * Schema for validating drawing tool configurations
 */
export const drawingToolSchema = z.object({
  tool: z.nativeEnum(DrawingMode),
  lineThickness: z.number().positive().optional(),
  lineColor: z.string().regex(/^#[0-9A-Fa-f]{3,6}$/).optional(),
  fillColor: z.string().regex(/^#[0-9A-Fa-f]{3,6}$/).optional(),
  opacity: z.number().min(0).max(1).optional(),
  fontSize: z.number().positive().optional(),
  fontFamily: z.string().optional(),
  objectType: z.string().optional()
});

/**
 * Schema for validating canvas configuration
 */
export const canvasConfigSchema = z.object({
  width: z.number().positive(),
  height: z.number().positive(),
  zoom: z.number().positive(),
  gridSize: z.number().positive().optional(),
  snapToGrid: z.boolean().optional(),
  backgroundColor: z.string().optional()
});

/**
 * Schema for validating point coordinates
 */
export const pointSchema = z.object({
  x: z.number(),
  y: z.number()
});

/**
 * Schema for validating drawing objects
 */
export const drawingObjectSchema = z.object({
  id: z.string().optional(),
  type: z.string(),
  left: z.number().optional(),
  top: z.number().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  points: z.array(pointSchema).optional(),
  path: z.array(z.any()).optional(),
  fill: z.string().optional(),
  stroke: z.string().optional(),
  strokeWidth: z.number().optional(),
  opacity: z.number().min(0).max(1).optional(),
  angle: z.number().optional(),
  scaleX: z.number().optional(),
  scaleY: z.number().optional(),
  metadata: z.record(z.any()).optional()
});

/**
 * Schema for validating user settings
 */
export const userSettingsSchema = z.object({
  id: z.string().optional(),
  defaultTool: z.nativeEnum(DrawingMode).optional(),
  defaultLineColor: z.string().regex(/^#[0-9A-Fa-f]{3,6}$/).optional(),
  defaultLineThickness: z.number().positive().optional(),
  gridVisible: z.boolean().optional(),
  snapToGrid: z.boolean().optional(),
  darkMode: z.boolean().optional(),
  autosaveInterval: z.number().min(0).optional(),
  measurementUnit: z.enum(['mm', 'cm', 'm', 'in', 'ft']).optional(),
  notifications: z.boolean().optional()
});

/**
 * Schema for validating saved drawings from localStorage
 */
export const savedDrawingSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  canvasJson: z.string(),
  preview: z.string().optional(),
  metadata: z.record(z.any()).optional()
});

/**
 * Schema for validating API responses
 */
export const apiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional()
});

/**
 * Schema for validating URL query parameters
 */
export const urlParamsSchema = z.object({
  drawingId: z.string().optional(),
  tool: z.nativeEnum(DrawingMode).optional(),
  zoom: z.number().positive().optional(),
  page: z.number().nonnegative().optional(),
  grid: z.boolean().optional()
});
