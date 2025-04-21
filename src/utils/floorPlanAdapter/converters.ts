/**
 * Floor plan adapters and converters
 * @module utils/floorPlanAdapter/converters
 */
 
// Import from unifiedTypes instead of core/floor-plan/FloorPlan
import { FloorPlan, Room, Wall, Stroke } from '@/types/floor-plan/unifiedTypes';
import { Point } from '@/types/core/Point';
import { adaptFloorPlan, adaptRoom, adaptWall, adaptStroke, adaptMetadata } from '@/utils/typeAdapters';
