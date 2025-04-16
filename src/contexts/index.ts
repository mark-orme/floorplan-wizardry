
/**
 * Contexts module
 * Re-exports all context providers and hooks
 * @module contexts
 */

export { useCanvas, useCanvasContext, CanvasProvider } from './CanvasContext';
export { useDrawing, useDrawingContext, DrawingProvider } from './DrawingContext';
export { useAuth, AuthProvider } from './AuthContext';

// ThemeContext is referenced but doesn't exist in the codebase
// Removing this export to fix the build error
