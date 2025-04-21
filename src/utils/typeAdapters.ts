
/**
 * Type Adapters
 * Utilities for converting between different type systems
 * @module utils/typeAdapters
 */
import { FloorPlan, Room, Wall, FloorPlanMetadata } from '@/types/floor-plan/unifiedTypes';
import { Point } from '@/types/core/Point';
import { calculateWallLength } from '@/utils/debug/typeDiagnostics';

/**
 * Calculate wall length between two points
 * @param start Start point
 * @param end End point 
 * @returns Wall length
 */
function calculateLength(start: Point, end: Point): number {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Adapts a Wall-like object to ensure it has all required properties
 * @param wall Wall-like object that may be missing properties
 * @returns Complete Wall object with all required properties
 */
export function adaptWall(wall: Partial<Wall> & { start: Point; end: Point }): Wall {
  // Calculate length if it's missing
  const length = wall.length ?? calculateLength(wall.start, wall.end);
  
  // Add roomIds if missing
  const roomIds = wall.roomIds ?? [];
  
  // Add color if missing
  const color = wall.color ?? '#000000';
  
  return {
    id: wall.id ?? `wall-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    start: wall.start,
    end: wall.end,
    thickness: wall.thickness ?? 2,
    length,
    color,
    roomIds,
    ...(wall.points ? { points: wall.points } : { points: [wall.start, wall.end] }),
    ...(wall.height ? { height: wall.height } : {}),
    // Include any other properties from the original wall
    ...wall
  } as Wall;
}

/**
 * Adapts a Room-like object to ensure it has all required properties
 * @param room Room-like object that may be missing properties
 * @returns Complete Room object with all required properties
 */
export function adaptRoom(room: Partial<Room> & { id: string; name: string }): Room {
  // Ensure vertices exists (using points if available)
  const vertices = room.vertices ?? (room.points ? [...room.points] : []);
  const center = room.center ?? { x: 0, y: 0 };
  const labelPosition = room.labelPosition ?? { x: 0, y: 0 };
  const perimeter = room.perimeter ?? 0;
  
  // Ensure other required properties exist
  return {
    id: room.id,
    name: room.name,
    type: room.type ?? 'other',
    area: room.area ?? 0,
    perimeter,
    color: room.color ?? '#ffffff',
    level: room.level ?? 0,
    vertices,
    labelPosition,
    center,
    ...(room.points ? { points: room.points } : { points: vertices }),
    ...(room.walls ? { walls: room.walls } : { walls: [] }),
    // Include any other properties from the original room
    ...room
  } as Room;
}

/**
 * Adapts a FloorPlanMetadata-like object to ensure it has all required properties
 * @param metadata Metadata-like object that may be missing properties
 * @returns Complete FloorPlanMetadata object with all required properties
 */
export function adaptMetadata(metadata: Partial<FloorPlanMetadata> = {}): FloorPlanMetadata {
  const now = new Date().toISOString();
  return {
    createdAt: metadata.createdAt ?? now,
    updatedAt: metadata.updatedAt ?? now,
    paperSize: metadata.paperSize ?? 'A4',
    level: metadata.level ?? 0,
    version: metadata.version ?? '1.0',
    author: metadata.author ?? '',
    dateCreated: metadata.dateCreated ?? now,
    lastModified: metadata.lastModified ?? now,
    notes: metadata.notes ?? '',
    ...metadata
  };
}

/**
 * Adapts a FloorPlan-like object to ensure it has all required properties
 * @param floorPlan FloorPlan-like object that may be missing properties
 * @returns Complete FloorPlan object with all required properties
 */
export function adaptFloorPlan(floorPlan: Partial<FloorPlan> & { id: string; name: string }): FloorPlan {
  const now = new Date().toISOString();
  
  // Adapt walls and rooms to ensure they have all required properties
  const walls = (floorPlan.walls ?? []).map(wall => 
    'start' in wall && 'end' in wall ? adaptWall(wall as any) : wall
  );
  
  const rooms = (floorPlan.rooms ?? []).map(room => 
    'id' in room && 'name' in room ? adaptRoom(room as any) : room
  );
  
  // Adapt metadata to ensure it has all required properties
  const metadata = adaptMetadata(floorPlan.metadata ?? {});
  
  return {
    id: floorPlan.id,
    name: floorPlan.name,
    label: floorPlan.label ?? floorPlan.name,
    walls,
    rooms,
    strokes: floorPlan.strokes ?? [],
    canvasData: floorPlan.canvasData ?? null,
    canvasJson: floorPlan.canvasJson ?? null,
    createdAt: floorPlan.createdAt ?? now,
    updatedAt: floorPlan.updatedAt ?? now,
    gia: floorPlan.gia ?? 0,
    level: floorPlan.level ?? 0,
    index: floorPlan.index ?? floorPlan.level ?? 0,
    metadata,
    data: floorPlan.data ?? {},
    userId: floorPlan.userId ?? 'default-user',
    ...floorPlan
  } as FloorPlan;
}

/**
 * Adapts an array of FloorPlan-like objects to ensure they all have required properties
 * @param floorPlans Array of partial floor plan objects
 * @returns Array of complete FloorPlan objects
 */
export function adaptFloorPlans(floorPlans: (Partial<FloorPlan> & { id: string; name: string })[]): FloorPlan[] {
  return floorPlans.map(fp => adaptFloorPlan(fp));
}
