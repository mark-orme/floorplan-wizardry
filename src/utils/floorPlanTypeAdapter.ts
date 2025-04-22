
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
export function convertToAppFloorPlan(floorPlan: UnifiedFloorPlan): LegacyFloorPlan {
  // Ensure all required properties are present
  const result: LegacyFloorPlan = {
    id: floorPlan.id || '',
    propertyId: floorPlan.userId || 'default-property-id', // Ensure propertyId is present
    name: floorPlan.name || '',
    label: floorPlan.label || floorPlan.name || '',
    data: floorPlan.data || {}, // Ensure data is present
    userId: floorPlan.userId || 'test-user', // Ensure userId is present
    createdAt: floorPlan.createdAt || new Date().toISOString(),
    updatedAt: floorPlan.updatedAt || new Date().toISOString(),
    walls: floorPlan.walls || [],
    rooms: (floorPlan.rooms || []).map(convertToAppRoom),
    strokes: (floorPlan.strokes || []).map(convertToAppStroke),
    level: floorPlan.level || 0,
    gia: floorPlan.gia || 0,
    index: floorPlan.index || 0,
    canvasData: floorPlan.canvasData || null,
    canvasJson: floorPlan.canvasJson || null,
    metadata: floorPlan.metadata || {
      createdAt: floorPlan.createdAt || new Date().toISOString(),
      updatedAt: floorPlan.updatedAt || new Date().toISOString(),
      paperSize: 'A4',
      level: floorPlan.level || 0,
      version: '1.0'
    }
  };
  
  return result;
}

/**
 * Convert a unified stroke to a legacy stroke
 * @param stroke Unified stroke
 * @returns Legacy stroke
 */
export function convertToAppStroke(stroke: UnifiedStroke): LegacyStroke {
  // Convert type to ensure compatibility
  const typeValue = typeof stroke.type === 'string' ? asStrokeType(stroke.type) : stroke.type;
  
  return {
    ...stroke,
    type: typeValue,
    floorPlanId: 'floor-' + (stroke.id?.split('-')[0] || Date.now()) // Add required floorPlanId
  } as LegacyStroke;
}

/**
 * Convert a unified room to a legacy room
 * @param room Unified room
 * @returns Legacy room
 */
export function convertToAppRoom(room: UnifiedRoom): LegacyRoom {
  // Convert type to ensure compatibility
  const typeValue = typeof room.type === 'string' ? asRoomType(room.type) : room.type;
  
  return {
    ...room,
    type: typeValue,
    floorPlanId: 'floor-' + (room.id?.split('-')[0] || Date.now()) // Add required floorPlanId
  } as LegacyRoom;
}

/**
 * Convert a legacy floor plan to a unified floor plan
 * @param floorPlan Legacy floor plan
 * @returns Unified floor plan
 */
export function convertToUnifiedFloorPlan(floorPlan: LegacyFloorPlan): UnifiedFloorPlan {
  // Basic conversion, treating the LegacyFloorPlan as a base
  const unifiedPlan: UnifiedFloorPlan = {
    id: floorPlan.id || '',
    name: floorPlan.name,
    label: floorPlan.label || floorPlan.name,
    walls: floorPlan.walls || [],
    rooms: floorPlan.rooms || [],
    strokes: floorPlan.strokes || [],
    gia: floorPlan.gia || 0,
    level: floorPlan.level || 0,
    index: floorPlan.index || 0,
    canvasData: floorPlan.canvasData,
    canvasJson: floorPlan.canvasJson,
    createdAt: floorPlan.createdAt,
    updatedAt: floorPlan.updatedAt,
    metadata: floorPlan.metadata || {},
    data: floorPlan.data || {},
    userId: floorPlan.userId || floorPlan.propertyId || 'default-user'
  };
  
  return unifiedPlan;
}
