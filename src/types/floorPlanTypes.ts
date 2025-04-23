
import { Point } from '@/types/core/Point';

export interface FloorPlan {
  id: string;
  name: string;
  width: number;
  height: number;
  level: number;
  updatedAt: string;
  walls: Wall[];
  rooms: Room[];
  strokes: Stroke[];
  // Add required fields for compatibility with other modules
  label?: string;
  canvasData: string | null;
  canvasJson: string | null;
  createdAt: string;
  gia?: number;
  index?: number;
  metadata?: FloorPlanMetadata;
  data: any;
  userId: string;
  canvasState?: any;
  backgroundColor?: string;
}

export interface Wall {
  id: string;
  startPoint: Point;
  endPoint: Point;
  thickness: number;
  height?: number;
  color?: string;
  // Add required fields for compatibility with other modules
  start: Point;
  end: Point;
  points?: Point[];
  roomIds?: string[];
  length?: number;
}

export interface Room {
  id: string;
  name: string;
  points: Point[];
  color?: string;
  area?: number;
  type?: string;
  // Add fields for compatibility with other modules
  vertices?: Point[];
  roomType?: RoomTypeLiteral;
  perimeter?: number;
  center?: Point;
  labelPosition?: Point;
}

export interface Stroke {
  id: string;
  points: Point[];
  color: string;
  width: number;
  type: string;
  // Add fields for compatibility
  thickness?: number;
}

export type PaperSize = 'A0' | 'A1' | 'A2' | 'A3' | 'A4' | 'letter' | 'legal' | 'custom';
export type RoomTypeLiteral = 'bedroom' | 'bathroom' | 'kitchen' | 'living' | 'dining' | 'office' | 'other';
export type StrokeTypeLiteral = 'line' | 'wall' | 'door' | 'window' | 'furniture' | 'text';

export interface FloorPlanMetadata {
  version: string;
  scale?: number;
  unit?: 'mm' | 'cm' | 'm' | 'inch' | 'ft';
  paperSize?: PaperSize;
  created?: string;
  modified?: string;
  createdAt?: string;
  updatedAt?: string;
  level?: number;
  author?: string;
  dateCreated?: string;
  lastModified?: string;
  notes?: string;
}

export const createEmptyFloorPlan = (): FloorPlan => {
  return {
    id: crypto.randomUUID ? crypto.randomUUID() : `floor-${Date.now()}`,
    name: 'New Floor Plan',
    width: 1000,
    height: 800,
    level: 1,
    updatedAt: new Date().toISOString(),
    walls: [],
    rooms: [],
    strokes: [],
    data: {}, // Required field for compatibility
    userId: 'default-user', // Required field for compatibility
    createdAt: new Date().toISOString(),
    canvasData: null,
    canvasJson: null
  };
};

// Add helper functions to aid with type compatibility
export const asWall = (wall: any): Wall => wall;
export const asRoom = (room: any): Room => room;
export const asStroke = (stroke: any): Stroke => stroke;

// Add type converter function for interoperability between different floor plan types
export const convertFloorPlan = (plan: any): FloorPlan => {
  // Ensure all required properties exist
  return {
    ...plan,
    walls: Array.isArray(plan.walls) ? plan.walls.map(asWall) : [],
    rooms: Array.isArray(plan.rooms) ? plan.rooms.map(asRoom) : [],
    strokes: Array.isArray(plan.strokes) ? plan.strokes.map(asStroke) : [],
    data: plan.data || {},
    userId: plan.userId || 'default-user',
    createdAt: plan.createdAt || new Date().toISOString(),
    canvasData: plan.canvasData || null,
    canvasJson: plan.canvasJson || null
  };
};
