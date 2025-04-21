
/**
 * Floor plan info logging utilities
 * @module utils/debug/logFloorPlanInfo
 */

// Update imports to match available exports
import { isFloorPlan, isWall, isRoom } from './globalTypeCheck';

/**
 * Log detailed floor plan information for debugging
 * @param floorPlan Floor plan to log
 */
export const logFloorPlanInfo = (floorPlan: any) => {
  // No validation, just output properties
  console.group('Floor Plan Info');
  console.log('ID:', floorPlan.id);
  console.log('Name:', floorPlan.name);
  
  console.log('Walls:', floorPlan.walls?.length ?? 0);
  console.log('Rooms:', floorPlan.rooms?.length ?? 0);
  console.log('Strokes:', floorPlan.strokes?.length ?? 0);
  console.log('Created:', new Date(floorPlan.createdAt).toLocaleString());
  console.log('Updated:', new Date(floorPlan.updatedAt).toLocaleString());
  console.groupEnd();
};

/**
 * Log room information for debugging
 * @param room Room to log
 */
export const logRoomInfo = (room: any) => {
  console.group('Room Info');
  console.log('ID:', room.id);
  console.log('Name:', room.name);
  console.log('Type:', room.type);
  console.log('Area:', room.area);
  console.log('Vertices:', room.vertices?.length ?? 0);
  console.groupEnd();
};

/**
 * Log wall information for debugging
 * @param wall Wall to log
 */
export const logWallInfo = (wall: any) => {
  console.group('Wall Info');
  console.log('ID:', wall.id);
  console.log('Start:', `(${wall.start?.x}, ${wall.start?.y})`);
  console.log('End:', `(${wall.end?.x}, ${wall.end?.y})`);
  console.log('Length:', wall.length);
  console.log('Thickness:', wall.thickness);
  console.groupEnd();
};
