
/**
 * Re-exports from the straight line tool module
 * @module hooks/straightLineTool
 */

export { useStraightLineTool } from './useStraightLineTool';
export { useStraightLineToolRefactored } from './useStraightLineToolRefactored';
export { useLineState, type InputMethod } from './useLineState';
export { useApplePencilSupport } from './useApplePencilSupport';
export { useLineToolHandlers } from './useLineToolHandlers';
export { useStraightLineEvents } from './useStraightLineEvents';
export { useLineKeyboardShortcuts } from './useLineKeyboardShortcuts';
export { useToolCancellation } from './useToolCancellation';
export { useLineToolSetup } from './useLineToolSetup';

// Export the enhanced grid snapping hook
export const useEnhancedGridSnapping = () => {
  return {
    // Placeholder implementation to fix type errors
    snapToGrid: (point: any) => point,
    isSnapEnabled: true,
    toggleSnap: () => {}
  };
};
