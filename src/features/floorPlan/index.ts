
/**
 * Floor Plan feature exports
 * @module features/floorPlan
 */

// Import from existing component locations
export { FloorPlanList } from '@/components/FloorPlanList'; 
export { FloorPlanCanvas } from '@/components/property/FloorPlanCanvas';
export { FloorPlanActions } from '@/components/property/FloorPlanActions';

// Re-export from hooks
export { useFloorPlanQuery } from '@/hooks/query/useFloorPlanQuery';

// Types (importing from the updated core types)
export type { 
  FloorPlan, 
  Room, 
  Wall, 
  Stroke, 
  RoomTypeLiteral,
  StrokeTypeLiteral
} from '@/types/core';

// Export PaperSize enum
export { PaperSize } from '@/types/floor-plan/PaperSize';

// Re-export helper functions
export { 
  createEmptyFloorPlan,
  createWall,
  createRoom,
  createStroke
} from '@/types/core';
