
import z from '@/utils/zod-mock';
import { DrawingMode } from '@/constants/drawingModes';

/**
 * Schema for validating drawing tool configurations
 */
export const drawingToolSchema = z.object({
  tool: z.nativeEnum(DrawingMode),
  lineThickness: z.number().positive(),
  lineColor: z.string().regex(/^#[0-9A-Fa-f]{3,6}$/),
  fillColor: z.string().regex(/^#[0-9A-Fa-f]{3,6}$/),
  opacity: z.number().min(0).max(1),
  fontSize: z.number().positive(),
  fontFamily: z.string(),
  objectType: z.string()
});

/**
 * Schema for validating canvas configuration
 */
export const canvasConfigSchema = z.object({
  width: z.number().positive(),
  height: z.number().positive(),
  zoom: z.number().positive(),
  gridSize: z.number().positive(),
  snapToGrid: z.boolean(),
  backgroundColor: z.string()
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
  id: z.string(),
  type: z.string(),
  left: z.number(),
  top: z.number(),
  width: z.number(),
  height: z.number(),
  points: z.array(pointSchema),
  path: z.array(z.any()),
  fill: z.string(),
  stroke: z.string(),
  strokeWidth: z.number(),
  opacity: z.number().min(0).max(1),
  angle: z.number(),
  scaleX: z.number(),
  scaleY: z.number(),
  metadata: z.record(z.any())
});

/**
 * Schema for validating user settings
 */
export const userSettingsSchema = z.object({
  id: z.string(),
  defaultTool: z.nativeEnum(DrawingMode),
  defaultLineColor: z.string().regex(/^#[0-9A-Fa-f]{3,6}$/),
  defaultLineThickness: z.number().positive(),
  gridVisible: z.boolean(),
  snapToGrid: z.boolean(),
  darkMode: z.boolean(),
  autosaveInterval: z.number().min(0),
  measurementUnit: z.enum(['mm', 'cm', 'm', 'in', 'ft']),
  notifications: z.boolean()
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
  preview: z.string(),
  metadata: z.record(z.any())
});

/**
 * Schema for validating API responses
 */
export const apiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any(),
  error: z.string()
});

/**
 * Schema for validating URL query parameters
 */
export const urlParamsSchema = z.object({
  drawingId: z.string(),
  tool: z.nativeEnum(DrawingMode),
  zoom: z.number().positive(),
  page: z.number().nonnegative(),
  grid: z.boolean()
});
