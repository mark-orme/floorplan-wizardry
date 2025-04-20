
/**
 * Floor plan conversion utilities
 * Handles converting between different floor plan formats
 * @module utils/floorPlanAdapter/converters
 */
import { v4 as uuidv4 } from 'uuid';
import { 
  FloorPlan, 
  Wall, 
  Room, 
  Stroke, 
  StrokeTypeLiteral,
  RoomTypeLiteral,
  Point
} from '@/types/floor-plan/unifiedTypes';

/**
 * Calculate the length of a wall from start and end points
 * @param start Start point
 * @param end End point
 * @returns Length of the wall
 */
export function calculateWallLength(start: Point, end: Point): number {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Convert wall data to a valid Wall object
 * @param wallData Wall data to convert
 * @returns Converted Wall object
 */
export function convertToWall(wallData: any): Wall {
  // Calculate length if it's not provided
  const length = wallData.length !== undefined 
    ? wallData.length 
    : calculateWallLength(wallData.start, wallData.end);
  
  // Ensure roomIds is an array
  const roomIds = Array.isArray(wallData.roomIds) ? wallData.roomIds : [];
  
  // Set default color if not provided
  const color = wallData.color || '#000000';
  
  return {
    id: wallData.id || uuidv4(),
    start: wallData.start,
    end: wallData.end,
    thickness: wallData.thickness || 2,
    length,
    color,
    roomIds,
    height: wallData.height,
    points: wallData.points
  };
}

/**
 * Convert room data to a valid Room object
 * @param roomData Room data to convert
 * @returns Converted Room object
 */
export function convertToRoom(roomData: any): Room {
  // Ensure type is valid
  const type = (roomData.type && typeof roomData.type === 'string')
    ? roomData.type as RoomTypeLiteral
    : 'other';
  
  return {
    id: roomData.id || uuidv4(),
    name: roomData.name || 'Unnamed Room',
    type,
    points: roomData.points || [],
    color: roomData.color || '#ffffff',
    area: roomData.area,
    perimeter: roomData.perimeter,
    center: roomData.center,
    labelPosition: roomData.labelPosition
  };
}

/**
 * Convert stroke data to a valid Stroke object
 * @param strokeData Stroke data to convert
 * @returns Converted Stroke object
 */
export function convertToStroke(strokeData: any): Stroke {
  // Ensure type is valid
  const type = (strokeData.type && typeof strokeData.type === 'string')
    ? strokeData.type as StrokeTypeLiteral
    : 'line';
  
  return {
    id: strokeData.id || uuidv4(),
    points: strokeData.points || [],
    type,
    color: strokeData.color || '#000000',
    thickness: strokeData.thickness || 2,
    width: strokeData.width || strokeData.thickness || 2
  };
}

/**
 * Convert floor plan data to a valid FloorPlan object
 * @param floorPlanData Floor plan data to convert
 * @returns Converted FloorPlan object
 */
export function convertToFloorPlan(floorPlanData: any): FloorPlan {
  const now = new Date().toISOString();
  
  // Ensure required properties exist
  const metadata = floorPlanData.metadata || {};
  const defaultMetadata = {
    createdAt: now,
    updatedAt: now,
    paperSize: 'A4',
    level: 0,
    version: '1.0',
    author: '',
    dateCreated: now,
    lastModified: now,
    notes: ''
  };
  
  // Combine with defaults
  const fullMetadata = {
    ...defaultMetadata,
    ...metadata
  };
  
  return {
    id: floorPlanData.id || uuidv4(),
    name: floorPlanData.name || 'Untitled Floor Plan',
    label: floorPlanData.label || floorPlanData.name || 'Untitled Floor Plan',
    walls: (floorPlanData.walls || []).map(convertToWall),
    rooms: (floorPlanData.rooms || []).map(convertToRoom),
    strokes: (floorPlanData.strokes || []).map(convertToStroke),
    canvasData: floorPlanData.canvasData || null,
    canvasJson: floorPlanData.canvasJson || null,
    createdAt: floorPlanData.createdAt || now,
    updatedAt: floorPlanData.updatedAt || now,
    gia: floorPlanData.gia || 0,
    level: floorPlanData.level || 0,
    index: floorPlanData.index !== undefined ? floorPlanData.index : floorPlanData.level || 0,
    metadata: fullMetadata,
    // Required properties
    data: floorPlanData.data || {},
    userId: floorPlanData.userId || 'default-user'
  };
}
