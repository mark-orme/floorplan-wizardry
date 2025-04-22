
/**
 * Type adapter utilities
 * Provides conversion functions between different type formats
 */
import { type FloorPlan as CoreFloorPlan } from '@/types/floor-plan/unifiedTypes';
import { type FloorPlan as AppFloorPlan } from '@/types/floorPlanTypes';

/**
 * Adapt any FloorPlan object to a consistent format
 * Works with both legacy and unified formats
 */
export function adaptFloorPlan(input: any): CoreFloorPlan {
  // Ensure required fields are present for unified FloorPlan
  const now = new Date().toISOString();
  
  return {
    id: input.id ?? `floor-${Date.now()}`,
    name: input.name ?? 'Untitled Floor Plan',
    label: input.label ?? input.name ?? 'Untitled',
    walls: input.walls ?? [],
    rooms: input.rooms ?? [],
    strokes: input.strokes ?? [],
    canvasData: input.canvasData ?? null,
    canvasJson: input.canvasJson ?? null,
    createdAt: input.createdAt ?? input.created_at ?? now,
    updatedAt: input.updatedAt ?? input.updated_at ?? now,
    gia: input.gia ?? 0,
    level: input.level ?? 0,
    index: input.index ?? input.level ?? 0,
    metadata: adaptMetadata(input.metadata),
    data: input.data ?? {},
    userId: input.userId ?? input.user_id ?? ''
  };
}

/**
 * Adapt any metadata object to a consistent format
 */
export function adaptMetadata(metadata: any = {}): any {
  const now = new Date().toISOString();
  
  return {
    version: metadata?.version ?? '1.0',
    author: metadata?.author ?? 'User',
    dateCreated: metadata?.dateCreated ?? metadata?.created_at ?? now,
    lastModified: metadata?.lastModified ?? metadata?.updated_at ?? now,
    notes: metadata?.notes ?? '',
    paperSize: metadata?.paperSize ?? 'A4',
    level: metadata?.level ?? 0,
    createdAt: metadata?.createdAt ?? metadata?.created_at ?? now,
    updatedAt: metadata?.updatedAt ?? metadata?.updated_at ?? now,
    ...metadata
  };
}

/**
 * Adapt any Room object to a consistent format
 */
export function adaptRoom(room: any): any {
  return room;
}

/**
 * Adapt any Wall object to a consistent format
 */
export function adaptWall(wall: any): any {
  return wall;
}

/**
 * Adapt any Stroke object to a consistent format
 */
export function adaptStroke(stroke: any): any {
  return stroke;
}

/**
 * Convert a core FloorPlan to an app FloorPlan
 */
export function coreToAppFloorPlan(floorPlan: CoreFloorPlan): AppFloorPlan {
  return {
    id: floorPlan.id,
    propertyId: floorPlan.userId, // Map userId to propertyId
    name: floorPlan.name,
    level: floorPlan.level,
    walls: floorPlan.walls,
    rooms: floorPlan.rooms,
    strokes: floorPlan.strokes,
    data: floorPlan.data ?? {},
    version: floorPlan.metadata?.version,
    createdAt: floorPlan.createdAt,
    updatedAt: floorPlan.updatedAt,
    index: floorPlan.index,
    gia: floorPlan.gia,
    canvasData: floorPlan.canvasData,
    canvasJson: floorPlan.canvasJson,
    metadata: floorPlan.metadata,
    userId: floorPlan.userId
  };
}

/**
 * Convert app FloorPlans to core FloorPlans
 */
export function appToCoreFloorPlans(appFloorPlans: AppFloorPlan[]): CoreFloorPlan[] {
  return appFloorPlans.map(plan => adaptFloorPlan(plan));
}
