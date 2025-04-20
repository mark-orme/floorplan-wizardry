
/**
 * Type diagnostics utilities
 * Provides detailed validation for complex types
 * @module utils/debug/typeDiagnostics
 */
import { FloorPlan, Stroke, Wall, Room, Point, StrokeTypeLiteral, RoomTypeLiteral } from '@/types/floor-plan/typesBarrel';

/**
 * Validates if an object is a valid FloorPlan
 * @param object Object to check
 * @returns Boolean indicating if object is a valid FloorPlan
 */
export function isValidFloorPlan(object: any): object is FloorPlan {
  if (!object || typeof object !== 'object') {
    console.error('FloorPlan validation failed: not an object', object);
    return false;
  }

  const requiredProps = [
    'id', 'name', 'label', 'walls', 'rooms', 'strokes',
    'createdAt', 'updatedAt', 'data', 'userId'
  ];

  for (const prop of requiredProps) {
    if (object[prop] === undefined) {
      console.error(`FloorPlan validation failed: missing ${prop}`, object);
      return false;
    }
  }

  // Validate arrays
  if (!Array.isArray(object.walls)) {
    console.error('FloorPlan validation failed: walls is not an array', object);
    return false;
  }

  if (!Array.isArray(object.rooms)) {
    console.error('FloorPlan validation failed: rooms is not an array', object);
    return false;
  }

  if (!Array.isArray(object.strokes)) {
    console.error('FloorPlan validation failed: strokes is not an array', object);
    return false;
  }

  // Validate data and userId
  if (typeof object.data !== 'object') {
    console.error('FloorPlan validation failed: data is not an object', object);
    return false;
  }

  if (typeof object.userId !== 'string') {
    console.error('FloorPlan validation failed: userId is not a string', object);
    return false;
  }

  return true;
}

/**
 * Validates if an object is a valid Stroke
 * @param object Object to check
 * @returns Boolean indicating if object is a valid Stroke
 */
export function isValidStroke(object: any): object is Stroke {
  if (!object || typeof object !== 'object') {
    console.error('Stroke validation failed: not an object', object);
    return false;
  }

  const requiredProps = ['id', 'points', 'type', 'color', 'thickness', 'width'];

  for (const prop of requiredProps) {
    if (object[prop] === undefined) {
      console.error(`Stroke validation failed: missing ${prop}`, object);
      return false;
    }
  }

  // Validate points array
  if (!Array.isArray(object.points)) {
    console.error('Stroke validation failed: points is not an array', object);
    return false;
  }

  // Validate type
  const validStrokeTypes = ['pen', 'marker', 'highlighter', 'eraser', 'straight'];
  if (!validStrokeTypes.includes(String(object.type))) {
    console.error(`Stroke validation failed: invalid type ${object.type}`, object);
    return false;
  }

  return true;
}

/**
 * Validates if an object is a valid Room
 * @param object Object to check
 * @returns Boolean indicating if object is a valid Room
 */
export function isValidRoom(object: any): object is Room {
  if (!object || typeof object !== 'object') {
    console.error('Room validation failed: not an object', object);
    return false;
  }

  const requiredProps = ['id', 'name', 'points', 'color', 'type', 'area', 'walls'];

  for (const prop of requiredProps) {
    if (object[prop] === undefined) {
      console.error(`Room validation failed: missing ${prop}`, object);
      return false;
    }
  }

  // Validate points array
  if (!Array.isArray(object.points)) {
    console.error('Room validation failed: points is not an array', object);
    return false;
  }

  // Validate walls array
  if (!Array.isArray(object.walls)) {
    console.error('Room validation failed: walls is not an array', object);
    return false;
  }

  // Validate type
  const validRoomTypes = ['bedroom', 'bathroom', 'kitchen', 'living', 'dining', 'office', 'other'];
  if (!validRoomTypes.includes(String(object.type))) {
    console.error(`Room validation failed: invalid type ${object.type}`, object);
    return false;
  }

  return true;
}

/**
 * Validates if an object is a valid Wall
 * @param object Object to check
 * @returns Boolean indicating if object is a valid Wall
 */
export function isValidWall(object: any): object is Wall {
  if (!object || typeof object !== 'object') {
    console.error('Wall validation failed: not an object', object);
    return false;
  }

  const requiredProps = ['id', 'start', 'end', 'thickness', 'color', 'length', 'roomIds'];

  for (const prop of requiredProps) {
    if (object[prop] === undefined) {
      console.error(`Wall validation failed: missing ${prop}`, object);
      return false;
    }
  }

  // Validate point objects
  if (!isValidPoint(object.start)) {
    console.error('Wall validation failed: invalid start point', object);
    return false;
  }

  if (!isValidPoint(object.end)) {
    console.error('Wall validation failed: invalid end point', object);
    return false;
  }

  // Validate roomIds array
  if (!Array.isArray(object.roomIds)) {
    console.error('Wall validation failed: roomIds is not an array', object);
    return false;
  }

  return true;
}

/**
 * Validates if an object is a valid Point
 * @param object Object to check
 * @returns Boolean indicating if object is a valid Point
 */
export function isValidPoint(object: any): object is Point {
  if (!object || typeof object !== 'object') {
    return false;
  }

  if (typeof object.x !== 'number' || typeof object.y !== 'number') {
    return false;
  }

  return true;
}

/**
 * Validates a FloorPlan and reports detailed validation info
 * @param floorPlan Floor plan to validate
 * @param context Optional context for logging
 * @returns Boolean indicating if floor plan is valid
 */
export function validateFloorPlanWithReporting(floorPlan: any, context: string = ''): boolean {
  const isValid = isValidFloorPlan(floorPlan);
  if (!isValid) {
    console.error(`FloorPlan validation failed ${context ? `(${context})` : ''}`, floorPlan);
  }
  return isValid;
}

/**
 * Logs detailed type information about an object
 * @param obj Object to log information about
 * @param label Optional label for logging context
 */
export function logTypeInfo(obj: any, label?: string): void {
  if (process.env.NODE_ENV === 'production') {
    return;
  }

  const prefix = label ? `[${label}]` : '[TypeInfo]';
  console.log(`${prefix} Type analysis:`);

  // Get basic type info
  console.log(`${prefix} Type: ${typeof obj}`);
  console.log(`${prefix} Is null: ${obj === null}`);
  console.log(`${prefix} Is array: ${Array.isArray(obj)}`);
  
  if (obj === null || obj === undefined) {
    return;
  }

  // For objects, log property information
  if (typeof obj === 'object' && !Array.isArray(obj)) {
    const props = Object.keys(obj);
    console.log(`${prefix} Properties: ${props.join(', ')}`);
    
    // Log type of each property
    props.forEach(prop => {
      const value = obj[prop];
      const valueType = typeof value;
      const valueInfo = Array.isArray(value) 
        ? `array[${value.length}]` 
        : valueType === 'object' && value !== null
          ? `object with ${Object.keys(value).length} properties`
          : valueType;
      
      console.log(`${prefix} - ${prop}: ${valueInfo}`);
    });
  }

  // For arrays, log element types
  if (Array.isArray(obj)) {
    console.log(`${prefix} Array length: ${obj.length}`);
    if (obj.length > 0) {
      console.log(`${prefix} First element type: ${typeof obj[0]}`);
      if (typeof obj[0] === 'object' && obj[0] !== null) {
        console.log(`${prefix} First element properties: ${Object.keys(obj[0]).join(', ')}`);
      }
    }
  }

  // Special handling for common types
  if (isValidFloorPlan(obj)) {
    console.log(`${prefix} Valid FloorPlan: Yes`);
    console.log(`${prefix} FloorPlan details:`, {
      id: obj.id,
      name: obj.name,
      walls: obj.walls.length,
      rooms: obj.rooms.length,
      strokes: obj.strokes.length
    });
  }

  if (isValidStroke(obj)) {
    console.log(`${prefix} Valid Stroke: Yes`);
    console.log(`${prefix} Stroke details:`, {
      id: obj.id,
      type: obj.type,
      points: obj.points.length
    });
  }

  if (isValidRoom(obj)) {
    console.log(`${prefix} Valid Room: Yes`);
    console.log(`${prefix} Room details:`, {
      id: obj.id,
      name: obj.name,
      type: obj.type,
      points: obj.points.length
    });
  }

  if (isValidWall(obj)) {
    console.log(`${prefix} Valid Wall: Yes`);
    console.log(`${prefix} Wall details:`, {
      id: obj.id,
      length: obj.length,
      roomIds: obj.roomIds.length
    });
  }
}
