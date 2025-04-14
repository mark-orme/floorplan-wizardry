
/**
 * Canvas feature exports
 * @module features/canvas
 */

// Import from the existing component locations
export { CanvasApp } from '@/components/canvas/CanvasApp';
export { Toolbar } from '@/components/canvas/Toolbar';
export { CanvasContainer } from '@/components/canvas/CanvasContainer';
export { CanvasControllerProvider } from '@/components/canvas/controller/CanvasController';

// Re-export hooks
export { useCanvasContext, CanvasProvider } from '@/contexts/CanvasContext';
export { useDrawingContext, DrawingProvider } from '@/contexts/DrawingContext';

// Re-export types
export { DrawingMode } from '@/constants/drawingModes';
