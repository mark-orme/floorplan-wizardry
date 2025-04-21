
/**
 * Floor plan info logging utilities
 * @module utils/debug/logFloorPlanInfo
 */
import { FloorPlan, Room, Wall } from '@/types/floor-plan/unifiedTypes';
import { 
  validateFloorPlan,
  validateRoom,
  validateWall
} from './typeDiagnostics';

/**
 * Log detailed floor plan information for debugging
 * @param floorPlan Floor plan to log
 */
export const logFloorPlanInfo = (floorPlan: FloorPlan) => {
  // Check validity using validator
  const isValid = validateFloorPlan(floorPlan);
  
  console.group('Floor Plan Info');
  console.log('ID:', floorPlan.id);
  console.log('Name:', floorPlan.name);
  console.log('Valid:', isValid);
  
  if (!isValid) {
    console.warn('Validation Issues: Floor plan is missing required properties');
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
  const isValid = validateRoom(room);
  
  console.group('Room Info');
  console.log('ID:', room.id);
  console.log('Name:', room.name);
  console.log('Type:', room.type);
  console.log('Area:', room.area);
  console.log('Valid:', isValid);
  console.log('Vertices:', room.vertices.length);
  console.groupEnd();
};

/**
 * Log wall information for debugging
 * @param wall Wall to log
 */
export const logWallInfo = (wall: Wall) => {
  const isValid = validateWall(wall);
  
  console.group('Wall Info');
  console.log('ID:', wall.id);
  console.log('Start:', `(${wall.start.x}, ${wall.start.y})`);
  console.log('End:', `(${wall.end.x}, ${wall.end.y})`);
  console.log('Length:', wall.length);
  console.log('Thickness:', wall.thickness);
  console.log('Valid:', isValid);
  console.groupEnd();
};
