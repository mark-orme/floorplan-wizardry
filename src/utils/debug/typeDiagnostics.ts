
/**
 * Type diagnostics utilities
 * Provides utilities for validating and diagnosing types
 * @module utils/debug/typeDiagnostics
 */
import { 
  FloorPlan, 
  Wall, 
  Room, 
  Stroke, 
  FloorPlanMetadata 
} from '@/types/floor-plan/unifiedTypes';
import { Point } from '@/types/core/Point';

/**
 * Calculate wall length between start and end points
 * @param start Start point
 * @param end End point
 * @returns Wall length
 */
export function calculateWallLength(start: Point, end: Point): number {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculate perimeter of a polygon defined by points
 * @param points Array of points forming a polygon
 * @returns Perimeter length
 */
export function calculatePerimeter(points: Point[]): number {
  if (points.length < 3) return 0;
  
  let perimeter = 0;
  for (let i = 0; i < points.length; i++) {
    const nextIndex = (i + 1) % points.length;
    perimeter += calculateWallLength(points[i], points[nextIndex]);
  }
  
  return perimeter;
}

/**
 * Calculate centroid (center point) of a polygon
 * @param points Array of points forming a polygon
 * @returns Centroid point
 */
export function calculateCentroid(points: Point[]): Point {
  if (points.length === 0) return { x: 0, y: 0 };
  
  let sumX = 0;
  let sumY = 0;
  
  points.forEach(point => {
    sumX += point.x;
    sumY += point.y;
  });
  
  return {
    x: sumX / points.length,
    y: sumY / points.length
  };
}

/**
 * Create a complete metadata object with all required fields
 * @param metadata Partial metadata object
 * @returns Complete metadata object
 */
export function createCompleteMetadata(metadata: Partial<FloorPlanMetadata> = {}): FloorPlanMetadata {
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
 * Validate a floor plan and report any issues
 * @param floorPlan Floor plan to validate
 * @returns Array of validation issues found
 */
export function validateFloorPlanWithReporting(floorPlan: Partial<FloorPlan>): string[] {
  const issues: string[] = [];
  
  // Check required fields
  if (!floorPlan.id) issues.push('Missing ID');
  if (!floorPlan.name) issues.push('Missing name');
  if (!floorPlan.walls) issues.push('Missing walls array');
  if (!floorPlan.rooms) issues.push('Missing rooms array');
  if (!floorPlan.strokes) issues.push('Missing strokes array');
  if (!floorPlan.data) issues.push('Missing data object');
  if (!floorPlan.userId) issues.push('Missing userId');
  
  // Check metadata
  if (!floorPlan.metadata) {
    issues.push('Missing metadata');
  } else {
    const metadata = floorPlan.metadata;
    if (!metadata.version) issues.push('Missing metadata.version');
    if (!metadata.author) issues.push('Missing metadata.author');
    if (!metadata.dateCreated) issues.push('Missing metadata.dateCreated');
    if (!metadata.lastModified) issues.push('Missing metadata.lastModified');
    if (!metadata.notes) issues.push('Missing metadata.notes');
  }
  
  return issues;
}

/**
 * Validate a wall and report any issues
 * @param wall Wall to validate
 * @returns Array of validation issues found
 */
export function validateWallWithReporting(wall: Partial<Wall>): string[] {
  const issues: string[] = [];
  
  if (!wall.id) issues.push('Missing ID');
  if (!wall.start) issues.push('Missing start point');
  if (!wall.end) issues.push('Missing end point');
  if (wall.thickness === undefined) issues.push('Missing thickness');
  if (!wall.color) issues.push('Missing color');
  if (!wall.roomIds) issues.push('Missing roomIds array');
  if (wall.length === undefined) issues.push('Missing length');
  
  return issues;
}

/**
 * Fix a partial wall by adding any missing required properties
 * @param wall Partial wall object
 * @returns Complete wall with all properties
 */
export function fixWall(wall: Partial<Wall> & { start: Point; end: Point }): Wall {
  const id = wall.id ?? `wall-${Date.now()}`;
  const thickness = wall.thickness ?? 2;
  const color = wall.color ?? '#000000';
  const roomIds = wall.roomIds ?? [];
  const length = wall.length ?? calculateWallLength(wall.start, wall.end);
  
  return {
    id,
    start: wall.start,
    end: wall.end,
    thickness,
    color,
    roomIds,
    length,
    ...(wall.height ? { height: wall.height } : {}),
    ...(wall.points ? { points: wall.points } : { points: [wall.start, wall.end] })
  } as Wall;
}

/**
 * Fix a partial room by adding any missing required properties
 * @param room Partial room object
 * @returns Complete room with all properties
 */
export function fixRoom(room: Partial<Room> & { id: string; name: string; points: Point[] }): Room {
  const type = room.type ?? 'other';
  const color = room.color ?? '#ffffff';
  const level = room.level ?? 0;
  const walls = room.walls ?? [];
  const area = room.area ?? 0;
  const perimeter = room.perimeter ?? calculatePerimeter(room.points);
  const center = room.center ?? calculateCentroid(room.points);
  const labelPosition = room.labelPosition ?? center;
  const vertices = room.vertices ?? [...room.points];
  
  return {
    id: room.id,
    name: room.name,
    type,
    points: room.points,
    color,
    level,
    walls,
    area,
    perimeter,
    center,
    labelPosition,
    vertices
  } as Room;
}
