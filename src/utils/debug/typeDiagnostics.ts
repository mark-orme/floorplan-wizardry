
/**
 * Type diagnostic utilities
 * Provides runtime type checking and validation
 * @module utils/debug/typeDiagnostics
 */
import { 
  FloorPlan, 
  Stroke, 
  Wall, 
  Room, 
  StrokeTypeLiteral, 
  RoomTypeLiteral 
} from '@/types/floor-plan/unifiedTypes';
import { captureMessage } from '@/utils/sentryUtils';

// Validation cache to avoid repeat warnings
const validationCache = new Map<string, boolean>();

/**
 * Log validation issues
 * @param message - Message to log
 * @param data - Additional data
 * @param force - Whether to log even if cached
 */
function logValidationIssue(message: string, data: any, force = false): void {
  const cacheKey = `${message}-${JSON.stringify(data)}`;
  
  if (force || !validationCache.has(cacheKey)) {
    console.error(`[Type Validation] ${message}`, data);
    validationCache.set(cacheKey, true);
    
    // Report to monitoring system
    captureMessage(`Type validation issue: ${message}`, 'type-validation', {
      level: 'warning',
      tags: {
        component: 'typeDiagnostics'
      },
      extra: data
    });
  }
}

/**
 * Check if a value is a valid stroke type
 * @param type - Value to check
 * @param source - Source of the value for logging
 * @returns Whether the value is valid
 */
export function isValidStrokeType(type: any, source = 'unknown'): boolean {
  console.log(`Validating stroke type: ${type} from ${source}`);
  
  const validTypes: StrokeTypeLiteral[] = [
    'line', 'polyline', 'wall', 'room', 'freehand', 
    'door', 'window', 'furniture', 'annotation', 'straight', 'other'
  ];
  
  const isValid = typeof type === 'string' && validTypes.includes(type as StrokeTypeLiteral);
  
  if (!isValid) {
    logValidationIssue('Invalid stroke type', { type, source, validTypes });
  }
  
  return isValid;
}

/**
 * Check if a value is a valid room type
 * @param type - Value to check
 * @param source - Source of the value for logging
 * @returns Whether the value is valid
 */
export function isValidRoomType(type: any, source = 'unknown'): boolean {
  console.log(`Validating room type: ${type} from ${source}`);
  
  const validTypes: RoomTypeLiteral[] = [
    'living', 'bedroom', 'kitchen', 'bathroom', 'office', 'other'
  ];
  
  const isValid = typeof type === 'string' && validTypes.includes(type as RoomTypeLiteral);
  
  if (!isValid) {
    logValidationIssue('Invalid room type', { type, source, validTypes });
  }
  
  return isValid;
}

/**
 * Validate a stroke object
 * @param stroke - Stroke to validate
 * @param source - Source of the object for logging
 * @returns Whether the stroke is valid
 */
export function isValidStroke(stroke: any, source = 'unknown'): stroke is Stroke {
  if (!stroke) {
    logValidationIssue('Stroke is null or undefined', { source });
    return false;
  }
  
  // Check for required properties
  const requiredProps = ['id', 'points', 'type', 'color', 'thickness', 'width'];
  const missingProps = requiredProps.filter(prop => stroke[prop] === undefined);
  
  if (missingProps.length > 0) {
    logValidationIssue('Stroke missing required properties', { 
      stroke, 
      missingProps,
      source 
    });
    return false;
  }
  
  // Validate type
  if (!isValidStrokeType(stroke.type, `${source}.type`)) {
    return false;
  }
  
  // Validate points array
  if (!Array.isArray(stroke.points)) {
    logValidationIssue('Stroke points is not an array', { 
      stroke, 
      pointsType: typeof stroke.points,
      source 
    });
    return false;
  }
  
  return true;
}

/**
 * Validate a wall object
 * @param wall - Wall to validate
 * @param source - Source of the object for logging
 * @returns Whether the wall is valid
 */
export function isValidWall(wall: any, source = 'unknown'): wall is Wall {
  if (!wall) {
    logValidationIssue('Wall is null or undefined', { source });
    return false;
  }
  
  // Check for required properties
  const requiredProps = ['id', 'start', 'end', 'thickness', 'color', 'roomIds', 'length'];
  const missingProps = requiredProps.filter(prop => wall[prop] === undefined);
  
  if (missingProps.length > 0) {
    logValidationIssue('Wall missing required properties', { 
      wall, 
      missingProps,
      source 
    });
    return false;
  }
  
  // Validate roomIds
  if (!Array.isArray(wall.roomIds)) {
    logValidationIssue('Wall roomIds is not an array', { 
      wall, 
      roomIdsType: typeof wall.roomIds,
      source 
    });
    return false;
  }
  
  // Validate points array
  if (!Array.isArray(wall.points)) {
    // Add missing points array based on start/end
    if (wall.start && wall.end) {
      console.log('Adding missing points array to wall based on start/end');
      wall.points = [wall.start, wall.end];
    } else {
      logValidationIssue('Wall points is not an array and start/end not available', { 
        wall,
        source 
      });
      return false;
    }
  }
  
  return true;
}

/**
 * Validate a room object
 * @param room - Room to validate
 * @param source - Source of the object for logging
 * @returns Whether the room is valid
 */
export function isValidRoom(room: any, source = 'unknown'): room is Room {
  if (!room) {
    logValidationIssue('Room is null or undefined', { source });
    return false;
  }
  
  // Check for required properties
  const requiredProps = ['id', 'name', 'type', 'points', 'color', 'area', 'walls'];
  const missingProps = requiredProps.filter(prop => room[prop] === undefined);
  
  if (missingProps.length > 0) {
    logValidationIssue('Room missing required properties', { 
      room, 
      missingProps,
      source 
    });
    return false;
  }
  
  // Validate type
  if (!isValidRoomType(room.type, `${source}.type`)) {
    return false;
  }
  
  // Validate points array
  if (!Array.isArray(room.points)) {
    logValidationIssue('Room points is not an array', { 
      room, 
      pointsType: typeof room.points,
      source 
    });
    return false;
  }
  
  // Validate walls array
  if (!Array.isArray(room.walls)) {
    logValidationIssue('Room walls is not an array', { 
      room, 
      wallsType: typeof room.walls,
      source 
    });
    return false;
  }
  
  return true;
}

/**
 * Validate a floor plan object
 * @param floorPlan - Floor plan to validate
 * @param source - Source of the object for logging
 * @returns Whether the floor plan is valid
 */
export function isValidFloorPlan(floorPlan: any, source = 'unknown'): floorPlan is FloorPlan {
  if (!floorPlan) {
    logValidationIssue('FloorPlan is null or undefined', { source });
    return false;
  }
  
  // Check for required properties
  const requiredProps = [
    'id', 'name', 'label', 'walls', 'rooms', 'strokes', 
    'createdAt', 'updatedAt', 'data', 'userId'
  ];
  const missingProps = requiredProps.filter(prop => floorPlan[prop] === undefined);
  
  if (missingProps.length > 0) {
    logValidationIssue('FloorPlan missing required properties', { 
      floorPlan, 
      missingProps,
      source 
    });
    return false;
  }
  
  // Validate arrays
  if (!Array.isArray(floorPlan.walls)) {
    logValidationIssue('FloorPlan walls is not an array', { 
      floorPlan, 
      wallsType: typeof floorPlan.walls,
      source 
    });
    return false;
  }
  
  if (!Array.isArray(floorPlan.rooms)) {
    logValidationIssue('FloorPlan rooms is not an array', { 
      floorPlan, 
      roomsType: typeof floorPlan.rooms,
      source 
    });
    return false;
  }
  
  if (!Array.isArray(floorPlan.strokes)) {
    logValidationIssue('FloorPlan strokes is not an array', { 
      floorPlan, 
      strokesType: typeof floorPlan.strokes,
      source 
    });
    return false;
  }
  
  // Check data property (required)
  if (!floorPlan.data) {
    logValidationIssue('FloorPlan data property is missing or null', {
      floorPlan,
      source
    });
    return false;
  }
  
  // Check userId property (required)
  if (!floorPlan.userId) {
    logValidationIssue('FloorPlan userId property is missing or null', {
      floorPlan,
      source
    });
    return false;
  }
  
  return true;
}

/**
 * Validate a floor plan with detailed reporting
 * @param floorPlan - Floor plan to validate
 * @param source - Source of the object for logging
 * @returns Whether the floor plan is valid
 */
export function validateFloorPlanWithReporting(floorPlan: any, source = 'unknown'): boolean {
  console.log(`Deep validating floor plan from ${source}`);
  
  // First validate the floor plan itself
  if (!isValidFloorPlan(floorPlan, source)) {
    return false;
  }
  
  let isValid = true;
  
  // Validate all strokes
  for (let i = 0; i < floorPlan.strokes.length; i++) {
    const stroke = floorPlan.strokes[i];
    if (!isValidStroke(stroke, `${source}.strokes[${i}]`)) {
      isValid = false;
      // Fix the stroke if possible
      if (stroke) {
        if (typeof stroke.type === 'string') {
          console.log(`Fixing invalid stroke type: ${stroke.type}`);
          // This references the validateStroke function which will check if stroke.type is valid and potentially fix it
          const validTypes: StrokeTypeLiteral[] = [
            'line', 'polyline', 'wall', 'room', 'freehand', 
            'door', 'window', 'furniture', 'annotation', 'straight', 'other'
          ];
          
          if (!validTypes.includes(stroke.type as StrokeTypeLiteral)) {
            console.log(`Converting invalid stroke type ${stroke.type} to 'other'`);
            stroke.type = 'other';
          }
        }
      }
    }
  }
  
  // Validate all rooms
  for (let i = 0; i < floorPlan.rooms.length; i++) {
    const room = floorPlan.rooms[i];
    if (!isValidRoom(room, `${source}.rooms[${i}]`)) {
      isValid = false;
      // Fix the room if possible
      if (room) {
        if (typeof room.type === 'string') {
          console.log(`Fixing invalid room type: ${room.type}`);
          const validTypes: RoomTypeLiteral[] = [
            'living', 'bedroom', 'kitchen', 'bathroom', 'office', 'other'
          ];
          
          if (!validTypes.includes(room.type as RoomTypeLiteral)) {
            console.log(`Converting invalid room type ${room.type} to 'other'`);
            room.type = 'other';
          }
        }
      }
    }
  }
  
  // Validate all walls
  for (let i = 0; i < floorPlan.walls.length; i++) {
    const wall = floorPlan.walls[i];
    if (!isValidWall(wall, `${source}.walls[${i}]`)) {
      isValid = false;
      // Fix the wall if possible
      if (wall && !wall.roomIds) {
        console.log('Fixing missing roomIds on wall');
        wall.roomIds = [];
      }
    }
  }
  
  return isValid;
}
