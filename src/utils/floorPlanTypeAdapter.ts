
/**
 * Floor Plan Type Adapter
 * Utilities for converting between different floor plan type definitions
 * @module utils/floorPlanTypeAdapter
 */
import { FloorPlan as UnifiedFloorPlan, Stroke as UnifiedStroke, Room as UnifiedRoom } from '@/types/floor-plan/unifiedTypes';
import { FloorPlan as LegacyFloorPlan, Stroke as LegacyStroke, Room as LegacyRoom } from '@/types/floorPlanTypes';
import { asStrokeType, asRoomType } from '@/utils/typeAdapters';

/**
 * Convert a unified floor plan to a legacy floor plan
 * @param floorPlan Unified floor plan
 * @returns Legacy floor plan
 */
export function toCompatFloorPlan(floorPlan: UnifiedFloorPlan): LegacyFloorPlan {
  // Ensure all required properties are present
  const result: LegacyFloorPlan = {
    id: floorPlan.id,
    propertyId: floorPlan.userId || 'default-property-id', // Ensure propertyId is present
    name: floorPlan.name,
    label: floorPlan.label,
    data: floorPlan.data || {}, // Ensure data is present
    userId: floorPlan.userId || 'test-user', // Ensure userId is present
    createdAt: floorPlan.createdAt,
    updatedAt: floorPlan.updatedAt,
    walls: floorPlan.walls,
    rooms: floorPlan.rooms.map(toCompatRoom),
    strokes: floorPlan.strokes.map(toCompatStroke),
    level: floorPlan.level,
    gia: floorPlan.gia,
    index: floorPlan.index,
    canvasData: floorPlan.canvasData,
    canvasJson: floorPlan.canvasJson,
    metadata: floorPlan.metadata
  };
  
  return result;
}

/**
 * Convert a unified stroke to a legacy stroke
 * @param stroke Unified stroke
 * @returns Legacy stroke
 */
export function toCompatStroke(stroke: UnifiedStroke): LegacyStroke {
  // Convert type to ensure compatibility
  const typeValue = typeof stroke.type === 'string' ? asStrokeType(stroke.type) : stroke.type;
  
  return {
    ...stroke,
    type: typeValue,
    floorPlanId: stroke.floorPlanId || stroke.id?.split('-')[0] || `floor-${Date.now()}` // Add required floorPlanId
  };
}

/**
 * Convert a unified room to a legacy room
 * @param room Unified room
 * @returns Legacy room
 */
export function toCompatRoom(room: UnifiedRoom): LegacyRoom {
  // Convert type to ensure compatibility
  const typeValue = typeof room.type === 'string' ? asRoomType(room.type) : room.type;
  
  return {
    ...room,
    type: typeValue,
    floorPlanId: room.floorPlanId || room.id?.split('-')[0] || `floor-${Date.now()}` // Add required floorPlanId
  };
}

/**
 * Convert multiple unified floor plans to legacy floor plans
 * @param floorPlans Array of unified floor plans
 * @returns Array of legacy floor plans
 */
export function toCompatFloorPlans(floorPlans: UnifiedFloorPlan[]): LegacyFloorPlan[] {
  return floorPlans.map(toCompatFloorPlan);
}

/**
 * Convert a legacy floor plan to a unified floor plan
 * @param floorPlan Legacy floor plan
 * @returns Unified floor plan
 */
export function toUnifiedFloorPlan(floorPlan: LegacyFloorPlan): UnifiedFloorPlan {
  // Ensure all required properties are present
  if (!floorPlan.data) floorPlan.data = {};
  if (!floorPlan.userId) floorPlan.userId = floorPlan.propertyId || 'test-user';
  
  return floorPlan as unknown as UnifiedFloorPlan;
}
