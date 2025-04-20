
/**
 * Floor Plan Logging Utilities
 * Helper functions for debugging floor plan issues
 * @module utils/debug/logFloorPlanInfo
 */

import { FloorPlan, Stroke, Wall, Room } from '@/types/floor-plan/typesBarrel';
import { validateFloorPlanWithReporting } from './typeDiagnostics';

/**
 * Log detailed information about a floor plan for debugging
 * @param floorPlan Floor plan to log
 * @param context Context for logging
 */
export function logFloorPlanInfo(floorPlan: any, context: string = ''): void {
  if (process.env.NODE_ENV === 'production') {
    return;
  }
  
  // Check if it's a valid floor plan
  const isValid = validateFloorPlanWithReporting(floorPlan, context);
  
  console.log(`[FloorPlanInfo] ${context || 'Floor Plan'} (Valid: ${isValid}):`, {
    id: floorPlan?.id,
    name: floorPlan?.name,
    label: floorPlan?.label,
    walls: floorPlan?.walls?.length || 0,
    rooms: floorPlan?.rooms?.length || 0,
    strokes: floorPlan?.strokes?.length || 0,
    level: floorPlan?.level,
    index: floorPlan?.index,
    data: floorPlan?.data ? 'Present' : 'Missing',
    userId: floorPlan?.userId || 'Missing',
    createdAt: floorPlan?.createdAt,
    updatedAt: floorPlan?.updatedAt
  });
  
  // Log validation status for all rooms
  if (floorPlan?.rooms?.length > 0) {
    logRoomValidationInfo(floorPlan.rooms, `${context} rooms`);
  }
  
  // Log validation status for all strokes
  if (floorPlan?.strokes?.length > 0) {
    logStrokeValidationInfo(floorPlan.strokes, `${context} strokes`);
  }
}

/**
 * Log validation info for strokes
 * @param strokes Strokes to validate
 * @param context Context for logging
 */
function logStrokeValidationInfo(strokes: any[], context: string = ''): void {
  if (!Array.isArray(strokes) || strokes.length === 0) {
    console.log(`[StrokeInfo] ${context}: No strokes`);
    return;
  }
  
  const strokeTypes = new Set<string>();
  const invalidStrokes: any[] = [];
  
  strokes.forEach(stroke => {
    if (stroke?.type) {
      strokeTypes.add(stroke.type);
    }
    
    // Check for missing required properties
    if (
      !stroke?.id ||
      !stroke?.points ||
      !stroke?.type ||
      !stroke?.color ||
      stroke?.thickness === undefined ||
      stroke?.width === undefined
    ) {
      invalidStrokes.push(stroke);
    }
  });
  
  console.log(`[StrokeInfo] ${context}:`, {
    count: strokes.length,
    types: Array.from(strokeTypes),
    invalidCount: invalidStrokes.length
  });
  
  if (invalidStrokes.length > 0) {
    console.warn(`Found ${invalidStrokes.length} invalid strokes:`, invalidStrokes);
  }
}

/**
 * Log validation info for rooms
 * @param rooms Rooms to validate
 * @param context Context for logging
 */
function logRoomValidationInfo(rooms: any[], context: string = ''): void {
  if (!Array.isArray(rooms) || rooms.length === 0) {
    console.log(`[RoomInfo] ${context}: No rooms`);
    return;
  }
  
  const roomTypes = new Set<string>();
  const invalidRooms: any[] = [];
  
  rooms.forEach(room => {
    if (room?.type) {
      roomTypes.add(room.type);
    }
    
    // Check for missing required properties
    if (
      !room?.id ||
      !room?.name ||
      !room?.type ||
      !room?.points ||
      !room?.color ||
      room?.area === undefined ||
      room?.level === undefined ||
      !Array.isArray(room?.walls)
    ) {
      invalidRooms.push(room);
    }
  });
  
  console.log(`[RoomInfo] ${context}:`, {
    count: rooms.length,
    types: Array.from(roomTypes),
    invalidCount: invalidRooms.length
  });
  
  if (invalidRooms.length > 0) {
    console.warn(`Found ${invalidRooms.length} invalid rooms:`, invalidRooms);
  }
}
