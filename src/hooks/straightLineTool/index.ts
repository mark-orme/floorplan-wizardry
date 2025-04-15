
/**
 * Straight line tool module
 * Provides hooks for straight line drawing functionality
 * @module hooks/straightLineTool
 */

// Export the main hook
export { useStraightLineTool } from './useStraightLineTool';

// Export refactored hooks
export { useStraightLineToolRefactored } from './useStraightLineToolRefactored';
export { useLineState } from './useLineState';
export { useStraightLineEvents } from './useStraightLineEvents';
export { useLineKeyboardShortcuts } from './useLineKeyboardShortcuts';
export { useLineToolHandlers } from './useLineToolHandlers';
export { useToolCancellation } from './useToolCancellation';
export { useLineToolSetup } from './useLineToolSetup';
export { useApplePencilSupport } from './useApplePencilSupport';
export { useEnhancedGridSnapping } from './useEnhancedGridSnapping';

// Export types
export type { InputMethod } from './useLineState';
