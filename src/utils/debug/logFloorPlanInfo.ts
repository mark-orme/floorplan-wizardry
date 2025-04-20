
/**
 * Floor plan info logging utilities
 * @module utils/debug/logFloorPlanInfo
 */
import { FloorPlan, Room, Wall } from '@/types/floor-plan/unifiedTypes';
import { 
  validateFloorPlanWithReporting 
} from './typeDiagnostics';

/**
 * Validate if a room is valid
 * @param room Room to validate
 * @returns Whether the room is valid
 */
export function isValidRoom(room: Room): boolean {
  return room && 
         typeof room.id === 'string' && 
         typeof room.name === 'string' && 
         Array.isArray(room.vertices) && 
         room.vertices.length >= 3;
}

/**
 * Validate if a wall is valid
 * @param wall Wall to validate
 * @returns Whether the wall is valid
 */
export function isValidWall(wall: Wall): boolean {
  return wall && 
         typeof wall.id === 'string' && 
         wall.start && 
         typeof wall.start.x === 'number' && 
         typeof wall.start.y === 'number' && 
         wall.end && 
         typeof wall.end.x === 'number' && 
         typeof wall.end.y === 'number';
}

/**
 * Validate if a floor plan is valid
 * @param floorPlan Floor plan to validate
 * @returns Whether the floor plan is valid
 */
export function isValidFloorPlan(floorPlan: FloorPlan): boolean {
  return floorPlan && 
         typeof floorPlan.id === 'string' && 
         typeof floorPlan.name === 'string';
}

/**
 * Log detailed floor plan information for debugging
 * @param floorPlan Floor plan to log
 */
export const logFloorPlanInfo = (floorPlan: FloorPlan) => {
  const validation = validateFloorPlanWithReporting(floorPlan);
  
  console.group('Floor Plan Info');
  console.log('ID:', floorPlan.id);
  console.log('Name:', floorPlan.name);
  console.log('Valid:', validation.valid);
  
  if (!validation.valid) {
    console.warn('Validation Issues:', validation.issues);
  }
  
  console.log('Walls:', floorPlan.walls.length);
  console.log('Rooms:', floorPlan.rooms.length);
  console.log('Strokes:', floorPlan.strokes.length);
  console.log('Created:', new Date(floorPlan.createdAt).toLocaleString());
  console.log('Updated:', new Date(floorPlan.updatedAt).toLocaleString());
  console.groupEnd();
};

/**
 * Log room information for debugging
 * @param room Room to log
 */
export const logRoomInfo = (room: Room) => {
  console.group('Room Info');
  console.log('ID:', room.id);
  console.log('Name:', room.name);
  console.log('Type:', room.type);
  console.log('Area:', room.area);
  console.log('Valid:', isValidRoom(room));
  console.log('Vertices:', room.vertices.length);
  console.groupEnd();
};

/**
 * Log wall information for debugging
 * @param wall Wall to log
 */
export const logWallInfo = (wall: Wall) => {
  console.group('Wall Info');
  console.log('ID:', wall.id);
  console.log('Start:', `(${wall.start.x}, ${wall.start.y})`);
  console.log('End:', `(${wall.end.x}, ${wall.end.y})`);
  console.log('Length:', wall.length);
  console.log('Thickness:', wall.thickness);
  console.log('Valid:', isValidWall(wall));
  console.groupEnd();
};
