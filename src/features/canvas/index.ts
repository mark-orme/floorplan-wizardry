
/**
 * Canvas feature module
 * @module features/canvas
 */

// Re-export canvas components and hooks
export { default as CanvasApp } from '@/components/CanvasApp';
export { FloorPlanCanvasEnhanced } from '@/components/property/FloorPlanCanvasEnhanced';
export { StyleOptions } from '@/components/toolbar/StyleOptions';

// Export canvas constants
export * from '@/constants/drawingModes';

// Export canvas types
export * from '@/types/canvas';

// Export canvas hooks
export * from '@/hooks/canvas';
