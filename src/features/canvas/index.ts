
/**
 * Canvas feature exports
 * @module features/canvas
 */

// Re-export components
export { CanvasApp } from './components/CanvasApp';
export { Toolbar } from './components/Toolbar';
export { CanvasContainer } from './components/CanvasContainer';
export { CanvasControllerProvider } from './components/controller/CanvasController';

// Re-export hooks
export { useCanvasOperations } from './hooks/useCanvasOperations';
export { useDrawingTool } from './hooks/useDrawingTool';
export { useStraightLineTool } from './hooks/useStraightLineTool';
export { useLineSettings } from './hooks/useLineSettings';

// Re-export context
export { CanvasProvider } from './context/CanvasContext';
export { DrawingProvider } from './context/DrawingContext';

// Re-export types
export { DrawingMode } from './types';
