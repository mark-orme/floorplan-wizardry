
/**
 * Core drawing tool types
 * @module types/core/DrawingTool
 */
import type { DrawingMode } from '@/constants/drawingModes';

/**
 * Export DrawingTool type which is equivalent to DrawingMode
 * This maintains the existing API while centralizing the type definition
 */
export type DrawingTool = DrawingMode;

/**
 * Re-export the DrawingMode enum to make it accessible from this module
 */
export { DrawingMode } from '@/constants/drawingModes';

