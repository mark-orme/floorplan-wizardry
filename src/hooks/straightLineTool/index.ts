
/**
 * Straight line tool hook exports
 * Provides functionality for drawing straight lines on the canvas
 * @module hooks/straightLineTool
 */

// Export specific components to avoid naming collisions
export { useLineState } from './useLineState';
export { useStraightLineEvents } from './useStraightLineEvents';
export { useStraightLineTool } from './useStraightLineTool';
export { useApplePencilSupport } from './useApplePencilSupport';
export { useEnhancedGridSnapping } from './useEnhancedGridSnapping';
export { useLineKeyboardShortcuts } from './useLineKeyboardShortcuts';

// Re-export the InputMethod type from useLineState
export type { InputMethod } from './useLineState';
