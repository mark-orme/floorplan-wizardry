
/**
 * Canvas operations hook
 * Re-exports the modular implementation from canvas-operations directory
 */
import { useCanvasOperations as useModularCanvasOperations } from './canvas-operations/useCanvasOperations';

// Re-export the hook with the same interface for backward compatibility
export const useCanvasOperations = useModularCanvasOperations;
