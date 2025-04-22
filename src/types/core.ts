
/**
 * Centralized type definitions
 * This file serves as the single source of truth for core types
 */

import { v4 as uuidv4 } from 'uuid';

export interface Point {
  x: number;
  y: number;
}

export function createPoint(x = 0, y = 0): Point {
  return { x, y };
}

export interface Wall {
  id: string;
  start: Point;
  end: Point;
  thickness: number;
  length: number;
  color: string;
  roomIds: string[];
}

export interface Room {
  id: string;
  name: string;
  type: RoomTypeLiteral;
  points: Point[];
  vertices: Point[];
  area: number;
  color: string;
}

export interface Stroke {
  id: string;
  points: Point[];
  color: string;
  width: number;
  thickness: number;
  type: StrokeTypeLiteral;
}

export interface FloorPlan {
  id: string;
  name: string;
  label?: string;
  index?: number;
  strokes: Stroke[];
  walls: Wall[];
  rooms: Room[];
  gia?: number;
  level?: number;
  canvasData?: CanvasData | null;
  canvasJson?: string | null;
  createdAt?: string;
  updatedAt?: string;
  metadata?: any;
  data?: any;
  userId?: string;
  propertyId?: string;
}

export interface CanvasData {
  zoom: number;
  offset: Point;
}

export type RoomTypeLiteral = 'bedroom' | 'bathroom' | 'kitchen' | 'living' | 'dining' | 'other';
export type StrokeTypeLiteral = 'line' | 'curve' | 'freehand' | 'rect' | 'circle';

// Helper functions
export function createEmptyFloorPlan(partialFloorPlan: Partial<FloorPlan> = {}): FloorPlan {
  return {
    id: partialFloorPlan.id || uuidv4(),
    name: partialFloorPlan.name || 'Untitled Floor Plan',
    label: partialFloorPlan.label || '',
    walls: partialFloorPlan.walls || [],
    rooms: partialFloorPlan.rooms || [],
    strokes: partialFloorPlan.strokes || [],
    canvasData: partialFloorPlan.canvasData || null,
    canvasJson: partialFloorPlan.canvasJson || null,
    createdAt: partialFloorPlan.createdAt || new Date().toISOString(),
    updatedAt: partialFloorPlan.updatedAt || new Date().toISOString(),
    gia: partialFloorPlan.gia || 0,
    level: partialFloorPlan.level || 0,
    index: partialFloorPlan.index || 0,
    metadata: partialFloorPlan.metadata || {},
    data: partialFloorPlan.data || {},
    userId: partialFloorPlan.userId || '',
    propertyId: partialFloorPlan.propertyId || ''
  };
}

export function createWall(start: Point, end: Point, thickness = 10, color = '#000000'): Wall {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  
  return {
    id: uuidv4(),
    start,
    end,
    thickness,
    length,
    color,
    roomIds: []
  };
}

export function createRoom(name: string, vertices: Point[], type: RoomTypeLiteral = 'other', color = '#ffffff'): Room {
  return {
    id: uuidv4(),
    name,
    type,
    points: [...vertices],
    vertices,
    area: calculatePolygonArea(vertices),
    color
  };
}

export function createStroke(points: Point[], color = '#000000', width = 2, type: StrokeTypeLiteral = 'line'): Stroke {
  return {
    id: uuidv4(),
    points,
    color,
    width,
    thickness: width, // For compatibility
    type
  };
}

// Helper function to calculate polygon area
function calculatePolygonArea(vertices: Point[]): number {
  if (vertices.length < 3) return 0;
  
  let area = 0;
  for (let i = 0; i < vertices.length; i++) {
    const j = (i + 1) % vertices.length;
    area += vertices[i].x * vertices[j].y;
    area -= vertices[j].x * vertices[i].y;
  }
  
  return Math.abs(area / 2);
}
