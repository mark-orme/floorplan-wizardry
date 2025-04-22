
import { Room, Wall, Stroke } from '@/types/floor-plan/unifiedTypes';
import { Point } from '@/types/core/Point';

/**
 * Adapts a wall object to ensure it meets the required interface
 * @param wall The wall to adapt
 * @returns A wall object that conforms to the Wall interface
 */
export const adaptWall = (wall: Partial<Wall>): Wall => {
  // Calculate length if not provided
  let length = wall.length;
  if (!length && wall.start && wall.end) {
    const dx = wall.end.x - wall.start.x;
    const dy = wall.end.y - wall.start.y;
    length = Math.sqrt(dx * dx + dy * dy);
  }

  // Calculate angle if not provided
  let angle = wall.angle;
  if (angle === undefined && wall.start && wall.end) {
    const dx = wall.end.x - wall.start.x;
    const dy = wall.end.y - wall.start.y;
    angle = Math.atan2(dy, dx) * (180 / Math.PI);
  }

  return {
    id: wall.id || `wall-${Date.now()}`,
    start: wall.start || { x: 0, y: 0 },
    end: wall.end || { x: 100, y: 0 },
    thickness: wall.thickness || 5,
    color: wall.color || '#000000',
    height: wall.height || 240,
    roomIds: wall.roomIds || [],
    length: length || 100,
    angle: angle || 0,
    floorPlanId: wall.floorPlanId || 'default-floor-plan'
  };
};

/**
 * Adapts a room object to ensure it meets the required interface
 * @param room The room to adapt
 * @returns A room object that conforms to the Room interface
 */
export const adaptRoom = (room: Partial<Room>): Room => {
  return {
    id: room.id || `room-${Date.now()}`,
    name: room.name || 'Unnamed Room',
    type: room.type || 'other',
    area: room.area || 0,
    perimeter: room.perimeter || 0,
    center: room.center || { x: 0, y: 0 },
    vertices: room.vertices || [],
    labelPosition: room.labelPosition || { x: 0, y: 0 },
    color: room.color || '#FFFFFF',
    floorPlanId: room.floorPlanId || 'default-floor-plan'
  };
};

/**
 * Adapts a stroke object to ensure it meets the required interface
 * @param stroke The stroke to adapt
 * @returns A stroke object that conforms to the Stroke interface
 */
export const adaptStroke = (stroke: Partial<Stroke>): Stroke => {
  return {
    id: stroke.id || `stroke-${Date.now()}`,
    type: stroke.type || 'line',
    points: stroke.points || [],
    color: stroke.color || '#000000',
    thickness: stroke.thickness || 1,
    floorPlanId: stroke.floorPlanId || 'default-floor-plan'
  };
};

/**
 * Convert a wall object to the unified type
 */
export const asWallType = adaptWall;

/**
 * Convert a room object to the unified type
 */
export const asRoomType = adaptRoom;

/**
 * Convert a stroke object to the unified type
 */
export const asStrokeType = adaptStroke;
