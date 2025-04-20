
/**
 * Floor Plan Types Barrel
 * Centralizes all floor plan type definitions
 * @module types/floor-plan/typesBarrel
 */

export interface Point {
  x: number;
  y: number;
}

export type StrokeTypeLiteral = 'line' | 'polyline' | 'wall' | 'room' | 'freehand' | 'door' | 'window' | 'furniture' | 'annotation' | 'other';
export type RoomTypeLiteral = 'living' | 'bedroom' | 'kitchen' | 'bathroom' | 'office' | 'other';

export interface Stroke {
  id: string;
  points: Point[];
  type: StrokeTypeLiteral;
  color: string;
  thickness: number;
  width: number;
}

export interface Wall {
  id: string;
  start: Point;
  end: Point;
  thickness: number;
  points: Point[];
  color: string;
  length: number;
  roomIds: string[];
}

export interface Room {
  id: string;
  name: string;
  type: RoomTypeLiteral;
  points: Point[];
  walls: string[];
  color: string;
  area: number;
  level: number;
}

export interface FloorPlan {
  id: string;
  name: string;
  label: string;
  data: any; // Required property
  userId: string; // Required property
  strokes: Stroke[];
  walls: Wall[];
  rooms: Room[];
  createdAt: string;
  updatedAt: string;
  level?: number;
  index?: number;
  gia?: number;
  canvasData?: any;
  canvasJson?: string | null;
  metadata?: FloorPlanMetadata;
  order?: number;
}

export interface FloorPlanMetadata {
  version?: string;
  author?: string;
  dateCreated?: string;
  lastModified?: string;
  notes?: string;
  paperSize?: string;
  level?: number;
}

export enum PaperSize {
  A4 = 'A4',
  A3 = 'A3',
  A5 = 'A5',
  LETTER = 'LETTER',
  LEGAL = 'LEGAL',
  TABLOID = 'TABLOID',
  CUSTOM = 'CUSTOM'
}

// Type guard functions for safer type casting
export function asStrokeType(type: string): StrokeTypeLiteral {
  const validTypes: StrokeTypeLiteral[] = ['line', 'polyline', 'wall', 'room', 'freehand', 'door', 'window', 'furniture', 'annotation', 'other'];
  return validTypes.includes(type as StrokeTypeLiteral) 
    ? (type as StrokeTypeLiteral) 
    : 'line'; // Default to line if invalid
}

export function asRoomType(type: string): RoomTypeLiteral {
  const validTypes: RoomTypeLiteral[] = ['living', 'bedroom', 'kitchen', 'bathroom', 'office', 'other'];
  return validTypes.includes(type as RoomTypeLiteral) 
    ? (type as RoomTypeLiteral) 
    : 'other'; // Default to other if invalid
}

// Validation helpers - useful for debugging type issues
export function validateStroke(obj: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!obj) {
    return { valid: false, errors: ['Stroke object is null or undefined'] };
  }
  
  if (!obj.id) errors.push('Missing id');
  if (!obj.points || !Array.isArray(obj.points)) errors.push('Missing or invalid points array');
  if (!obj.type) errors.push('Missing type');
  else if (!['line', 'polyline', 'wall', 'room', 'freehand', 'door', 'window', 'furniture', 'annotation', 'other'].includes(obj.type)) 
    errors.push(`Invalid type: ${obj.type}`);
  if (obj.thickness === undefined) errors.push('Missing thickness');
  if (obj.width === undefined) errors.push('Missing width');
  if (!obj.color) errors.push('Missing color');
  
  return { valid: errors.length === 0, errors };
}

export function validateWall(obj: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!obj) {
    return { valid: false, errors: ['Wall object is null or undefined'] };
  }
  
  if (!obj.id) errors.push('Missing id');
  if (!obj.start) errors.push('Missing start point');
  if (!obj.end) errors.push('Missing end point');
  if (!obj.points || !Array.isArray(obj.points)) errors.push('Missing or invalid points array');
  if (obj.thickness === undefined) errors.push('Missing thickness');
  if (obj.length === undefined) errors.push('Missing length');
  if (!obj.color) errors.push('Missing color');
  if (!obj.roomIds || !Array.isArray(obj.roomIds)) errors.push('Missing or invalid roomIds array');
  
  return { valid: errors.length === 0, errors };
}

export function validateRoom(obj: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!obj) {
    return { valid: false, errors: ['Room object is null or undefined'] };
  }
  
  if (!obj.id) errors.push('Missing id');
  if (!obj.name) errors.push('Missing name');
  if (!obj.type) errors.push('Missing type');
  else if (!['living', 'bedroom', 'kitchen', 'bathroom', 'office', 'other'].includes(obj.type)) 
    errors.push(`Invalid type: ${obj.type}`);
  if (!obj.points || !Array.isArray(obj.points)) errors.push('Missing or invalid points array');
  if (!obj.walls || !Array.isArray(obj.walls)) errors.push('Missing or invalid walls array');
  if (!obj.color) errors.push('Missing color');
  if (obj.area === undefined) errors.push('Missing area');
  if (obj.level === undefined) errors.push('Missing level');
  
  return { valid: errors.length === 0, errors };
}

export function validateFloorPlan(obj: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!obj) {
    return { valid: false, errors: ['FloorPlan object is null or undefined'] };
  }
  
  if (!obj.id) errors.push('Missing id');
  if (!obj.name) errors.push('Missing name');
  if (!obj.label) errors.push('Missing label');
  if (!obj.data) errors.push('Missing data (required)');
  if (!obj.userId) errors.push('Missing userId (required)');
  if (!obj.strokes || !Array.isArray(obj.strokes)) errors.push('Missing or invalid strokes array');
  if (!obj.walls || !Array.isArray(obj.walls)) errors.push('Missing or invalid walls array');
  if (!obj.rooms || !Array.isArray(obj.rooms)) errors.push('Missing or invalid rooms array');
  if (!obj.createdAt) errors.push('Missing createdAt');
  if (!obj.updatedAt) errors.push('Missing updatedAt');
  
  return { valid: errors.length === 0, errors };
}

// Create empty objects for testing
export function createEmptyStroke(id: string = crypto.randomUUID()): Stroke {
  return {
    id,
    points: [],
    type: 'line',
    color: '#000000',
    thickness: 1,
    width: 1
  };
}

export function createEmptyWall(id: string = crypto.randomUUID()): Wall {
  return {
    id,
    start: { x: 0, y: 0 },
    end: { x: 100, y: 100 },
    thickness: 10,
    points: [{ x: 0, y: 0 }, { x: 100, y: 100 }],
    color: '#000000',
    length: 141.42, // Sqrt(100^2 + 100^2)
    roomIds: []
  };
}

export function createEmptyRoom(id: string = crypto.randomUUID()): Room {
  return {
    id,
    name: 'Untitled Room',
    type: 'other',
    points: [],
    walls: [],
    color: '#ffffff',
    area: 0,
    level: 0
  };
}

export function createEmptyFloorPlan(data: Partial<FloorPlan> = {}): FloorPlan {
  const now = new Date().toISOString();
  return {
    id: data.id ?? crypto.randomUUID(),
    name: data.name ?? 'Untitled Floor Plan',
    label: data.label ?? 'Untitled',
    data: data.data ?? {},
    userId: data.userId ?? 'user-1',
    strokes: data.strokes ?? [],
    walls: data.walls ?? [],
    rooms: data.rooms ?? [],
    createdAt: data.createdAt ?? now,
    updatedAt: data.updatedAt ?? now,
    gia: data.gia ?? 0,
    level: data.level ?? 0,
    index: data.index ?? 0,
    canvasData: data.canvasData ?? null,
    canvasJson: data.canvasJson ?? null,
    metadata: data.metadata ?? {
      version: '1.0',
      author: '',
      dateCreated: now,
      lastModified: now,
      notes: ''
    }
  };
}
