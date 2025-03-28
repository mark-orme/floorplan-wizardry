
/**
 * Core drawing tool types
 * @module types/core/DrawingTool
 */
import { DrawingMode } from '@/constants/drawingModes';

/**
 * Re-export DrawingMode as DrawingTool for backward compatibility
 * This maintains the existing API while centralizing the type definition
 */
export type DrawingTool = DrawingMode;

/**
 * Re-export the DrawingMode enum to make it accessible from this module
 */
export { DrawingMode };
