
/**
 * Hook for managing canvas drawing tools
 * Re-exports functionality from the useCanvasControllerTools
 * @module canvas/controller/useCanvasControllerTools
 */

// Import a consistent FloorPlan type from the unified source
import { FloorPlan } from '@/types/floor-plan';

// Re-export the useCanvasControllerTools from the correct location
export { useCanvasControllerTools } from '@/components/canvas/controller/useCanvasControllerTools';

// Export the FloorPlan type to ensure consistent usage
export type { FloorPlan };
