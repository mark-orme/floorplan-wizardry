
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
  // Add for compatibility with older interfaces
  startPoint?: Point;
  endPoint?: Point;
}

export interface Room {
  id: string;
  name: string;
  type: RoomTypeLiteral;
  points: Point[];
  vertices: Point[];
  area: number;
  color: string;
  // Add missing properties required by floorPlanTypes.Room
  perimeter: number;
  center: Point;
  labelPosition: Point;
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
  // Make data optional to work with different types
  data?: any;
  userId?: string;
  propertyId?: string;
  // Add for compatibility with floorPlanTypes
  width?: number;
  height?: number;
  backgroundColor?: string;
}

export interface CanvasData {
  zoom: number;
  offset: Point;
}

// Update RoomTypeLiteral to include all possible room types
export type RoomTypeLiteral = 'bedroom' | 'bathroom' | 'kitchen' | 'living' | 'dining' | 'office' | 'other';
export type StrokeTypeLiteral = 'line' | 'curve' | 'freehand' | 'rect' | 'circle' | 'wall' | 'door' | 'window' | 'furniture' | 'annotation' | 'polyline' | 'room';

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
    propertyId: partialFloorPlan.propertyId || '',
    width: partialFloorPlan.width || 1000,
    height: partialFloorPlan.height || 800,
    backgroundColor: partialFloorPlan.backgroundColor || '#ffffff'
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
    startPoint: start, // Add for compatibility
    endPoint: end,     // Add for compatibility
    thickness,
    length,
    color,
    roomIds: []
  };
}

export function createRoom(name: string, vertices: Point[], type: RoomTypeLiteral = 'other', color = '#ffffff'): Room {
  const area = calculatePolygonArea(vertices);
  
  // Calculate center point
  const center = {
    x: vertices.reduce((sum, p) => sum + p.x, 0) / vertices.length,
    y: vertices.reduce((sum, p) => sum + p.y, 0) / vertices.length
  };
  
  return {
    id: uuidv4(),
    name,
    type,
    points: [...vertices],
    vertices,
    area,
    color,
    // Add new required properties
    perimeter: calculatePolygonPerimeter(vertices),
    center,
    labelPosition: { ...center } // Default label position to center
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

// Helper function to calculate polygon perimeter
function calculatePolygonPerimeter(vertices: Point[]): number {
  if (vertices.length < 2) return 0;
  
  let perimeter = 0;
  for (let i = 0; i < vertices.length; i++) {
    const j = (i + 1) % vertices.length;
    const dx = vertices[j].x - vertices[i].x;
    const dy = vertices[j].y - vertices[i].y;
    perimeter += Math.sqrt(dx * dx + dy * dy);
  }
  
  return perimeter;
}
