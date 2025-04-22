
/**
 * Consolidated FloorPlan type definitions
 * This is the single source of truth for all FloorPlan related types
 */
import { v4 as uuidv4 } from 'uuid';

export interface Point {
  x: number;
  y: number;
}

export function createPoint(x = 0, y = 0): Point {
  return { x, y };
}

export type StrokeTypeLiteral = 
  | 'line' 
  | 'curve' 
  | 'wall' 
  | 'door' 
  | 'window' 
  | 'furniture' 
  | 'annotation' 
  | 'polyline' 
  | 'room' 
  | 'freehand' 
  | 'rect' 
  | 'circle'
  | 'straight';

export type RoomTypeLiteral = 
  | 'bedroom' 
  | 'bathroom' 
  | 'kitchen' 
  | 'living' 
  | 'dining' 
  | 'office' 
  | 'other';

export interface Wall {
  id: string;
  start: Point;
  end: Point;
  thickness: number;
  length: number;
  color: string;
  roomIds: string[];
  height?: number;
  points?: Point[];
}

export interface Room {
  id: string;
  name: string;
  type: RoomTypeLiteral;
  points: Point[];
  vertices: Point[];
  area: number;
  color: string;
  perimeter: number;
  center: Point;
  labelPosition: Point;
  level?: number;
  walls?: string[];
}

export interface Stroke {
  id: string;
  points: Point[];
  type: StrokeTypeLiteral;
  color: string;
  thickness: number;
  width: number;
  floorPlanId?: string;
  createdAt?: string;
  updatedAt?: string;
  metadata?: any;
}

export interface CanvasData {
  zoom: number;
  offset: Point;
}

export interface FloorPlanMetadata {
  version?: string;
  author?: string;
  dateCreated?: string;
  lastModified?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  paperSize?: string;
  level?: number;
}

export interface FloorPlan {
  id: string;
  name: string;
  label?: string;
  walls: Wall[];
  rooms: Room[];
  strokes: Stroke[];
  canvasData?: CanvasData | null;
  canvasJson?: string | null;
  createdAt?: string;
  updatedAt?: string;
  gia?: number;
  level?: number;
  index?: number;
  metadata?: FloorPlanMetadata;
  data: any;
  userId?: string;
  propertyId?: string;
}

/**
 * Creates an empty floor plan with default values
 */
export function createEmptyFloorPlan(partialFloorPlan: Partial<FloorPlan> = {}): FloorPlan {
  const now = new Date().toISOString();
  
  return {
    id: partialFloorPlan.id || uuidv4(),
    name: partialFloorPlan.name || 'Untitled Floor Plan',
    label: partialFloorPlan.label || '',
    walls: partialFloorPlan.walls || [],
    rooms: partialFloorPlan.rooms || [],
    strokes: partialFloorPlan.strokes || [],
    canvasData: partialFloorPlan.canvasData || null,
    canvasJson: partialFloorPlan.canvasJson || null,
    createdAt: partialFloorPlan.createdAt || now,
    updatedAt: partialFloorPlan.updatedAt || now,
    gia: partialFloorPlan.gia || 0,
    level: partialFloorPlan.level || 0,
    index: partialFloorPlan.index || 0,
    metadata: partialFloorPlan.metadata || {
      version: '1.0',
      author: '',
      dateCreated: now,
      lastModified: now,
      notes: ''
    },
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
    perimeter: calculatePolygonPerimeter(vertices),
    center,
    labelPosition: { ...center }
  };
}

export function createStroke(points: Point[], color = '#000000', width = 2, type: StrokeTypeLiteral = 'line'): Stroke {
  return {
    id: uuidv4(),
    points,
    color,
    width,
    thickness: width,
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
