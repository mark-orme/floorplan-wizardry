
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
  // Current timestamp for defaults
  const now = new Date().toISOString();
  
  // Ensure all required properties are present
  const result: LegacyFloorPlan = {
    id: floorPlan.id,
    propertyId: floorPlan.userId || 'default-property-id', // Ensure propertyId is present
    name: floorPlan.name || '',
    label: floorPlan.label || floorPlan.name || '',
    data: floorPlan.data || {}, // Ensure data is present
    userId: floorPlan.userId || 'test-user', // Ensure userId is present
    createdAt: floorPlan.createdAt || now,
    updatedAt: floorPlan.updatedAt || now,
    walls: floorPlan.walls || [],
    rooms: (floorPlan.rooms || []).map(convertToAppRoom),
    strokes: (floorPlan.strokes || []).map(convertToAppStroke),
    level: floorPlan.level || 0,
    gia: floorPlan.gia || 0,
    index: floorPlan.index || 0,
    canvasData: floorPlan.canvasData || null,
    canvasJson: floorPlan.canvasJson || null,
    metadata: {
      version: floorPlan.metadata?.version || '1.0',
      author: 'User',
      dateCreated: floorPlan.metadata?.createdAt || now,
      lastModified: floorPlan.metadata?.updatedAt || now,
      notes: '',
      paperSize: floorPlan.metadata?.paperSize || 'A4',
      level: floorPlan.metadata?.level || floorPlan.level || 0,
      createdAt: floorPlan.metadata?.createdAt,
      updatedAt: floorPlan.metadata?.updatedAt
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
  const typeValue = typeof stroke.type === 'string' 
    ? asStrokeType(stroke.type as string) 
    : 'line';
  
  return {
    ...stroke,
    type: typeValue as any,
    floorPlanId: stroke.id?.split('-')[0] || 'floor-' + Date.now() // Add required floorPlanId
  } as LegacyStroke;
}

/**
 * Convert a unified room to a legacy room
 * @param room Unified room
 * @returns Legacy room
 */
export function convertToAppRoom(room: UnifiedRoom): LegacyRoom {
  // Convert type to ensure compatibility
  const typeValue = typeof room.type === 'string' 
    ? asRoomType(room.type as string) 
    : 'other';
  
  return {
    ...room,
    type: typeValue as any,
    floorPlanId: room.id?.split('-')[0] || 'floor-' + Date.now(), // Add required floorPlanId
    // Ensure required Room properties exist
    area: room.area || 0,
    perimeter: room.perimeter || 0,
    center: room.center || { x: 0, y: 0 },
    vertices: room.vertices || [],
    labelPosition: room.labelPosition || { x: 0, y: 0 }
  } as LegacyRoom;
}

/**
 * Convert a legacy floor plan to a unified floor plan
 * @param floorPlan Legacy floor plan
 * @returns Unified floor plan
 */
export function convertToUnifiedFloorPlan(floorPlan: LegacyFloorPlan): UnifiedFloorPlan {
  const now = new Date().toISOString();
  
  // Basic conversion, treating the LegacyFloorPlan as a base
  const unifiedPlan: UnifiedFloorPlan = {
    id: floorPlan.id || `floor-${Date.now()}`,
    name: floorPlan.name || 'Untitled',
    label: floorPlan.label || floorPlan.name || 'Untitled',
    walls: floorPlan.walls || [],
    rooms: floorPlan.rooms || [],
    strokes: floorPlan.strokes || [],
    gia: floorPlan.gia || 0,
    level: floorPlan.level || 0,
    index: floorPlan.index || 0,
    canvasData: floorPlan.canvasData || null,
    canvasJson: floorPlan.canvasJson || null,
    createdAt: floorPlan.createdAt || now,
    updatedAt: floorPlan.updatedAt || now,
    metadata: {
      createdAt: floorPlan.metadata?.createdAt || now,
      updatedAt: floorPlan.metadata?.updatedAt || now,
      paperSize: floorPlan.metadata?.paperSize || 'A4',
      level: floorPlan.metadata?.level || 0,
      version: floorPlan.metadata?.version || '1.0',
      author: floorPlan.metadata?.author || 'User',
      dateCreated: floorPlan.metadata?.dateCreated || now,
      lastModified: floorPlan.metadata?.lastModified || now,
      notes: floorPlan.metadata?.notes || ''
    },
    data: floorPlan.data || {},
    userId: floorPlan.userId || floorPlan.propertyId || 'default-user'
  };
  
  return unifiedPlan;
}

/**
 * Convert multiple unified floor plans to app floor plans
 */
export function convertToAppFloorPlans(unifiedPlans: UnifiedFloorPlan[]): LegacyFloorPlan[] {
  return unifiedPlans.map(convertToAppFloorPlan);
}

/**
 * Convert multiple app floor plans to unified floor plans
 */
export function convertToUnifiedFloorPlans(appPlans: LegacyFloorPlan[]): UnifiedFloorPlan[] {
  return appPlans.map(convertToUnifiedFloorPlan);
}
