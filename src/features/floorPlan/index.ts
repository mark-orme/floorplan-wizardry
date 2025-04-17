
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

// Types (importing from the updated floorPlanTypes)
export type { 
  FloorPlan, 
  Room, 
  Wall, 
  Stroke, 
  Point, 
  FloorPlanMetadata, 
  StrokeTypeLiteral, 
  StrokeType, 
  RoomTypeLiteral 
} from '@/types/floorPlanTypes';

export { PaperSize } from '@/types/floorPlanTypes';
