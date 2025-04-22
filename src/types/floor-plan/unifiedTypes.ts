
import { v4 as uuidv4 } from 'uuid';

export interface Point {
  x: number;
  y: number;
}

export interface Wall {
  id: string;
  start: Point;
  end: Point;
  thickness: number;
  length: number;
  type?: string;
}

export interface Room {
  id: string;
  points: Point[];
  name: string;
  type?: string;
  area?: number;
}

export interface Stroke {
  id: string;
  points: Point[];
  color: string;
  width: number;
  type: StrokeType;
}

export interface FloorPlanMetadata {
  createdAt: string;
  updatedAt: string;
  paperSize: PaperSize;
  level: number;
  version: string;
  author: string;
  notes?: string;
  dateCreated?: string;
  lastModified?: string;
}

export enum PaperSize {
  A0 = 'A0',
  A1 = 'A1',
  A2 = 'A2',
  A3 = 'A3',
  A4 = 'A4',
  A5 = 'A5',
  Letter = 'Letter',
  Legal = 'Legal',
  Tabloid = 'Tabloid',
  Custom = 'Custom'
}

export type StrokeTypeLiteral = 'freehand' | 'straight' | 'wall' | 'door' | 'window' | 'furniture' | 'annotation' | 'line';
export type StrokeType = StrokeTypeLiteral;
export type RoomTypeLiteral = 'living' | 'bedroom' | 'bathroom' | 'kitchen' | 'dining' | 'office' | 'other';

export function asStrokeType(type: string): StrokeType {
  const validTypes: StrokeTypeLiteral[] = ['freehand', 'straight', 'wall', 'door', 'window', 'furniture', 'annotation', 'line'];
  return validTypes.includes(type as StrokeTypeLiteral) 
    ? type as StrokeTypeLiteral 
    : 'freehand';
}

export function asRoomType(type: string): RoomTypeLiteral {
  const validTypes: RoomTypeLiteral[] = ['living', 'bedroom', 'bathroom', 'kitchen', 'dining', 'office', 'other'];
  return validTypes.includes(type as RoomTypeLiteral)
    ? type as RoomTypeLiteral
    : 'other';
}

export interface FloorPlan {
  id: string;
  name: string;
  label: string;
  walls: Wall[];
  rooms: Room[];
  strokes: Stroke[];
  createdAt: string;
  updatedAt: string;
  gia: number;
  level: number;
  index: number;
  metadata: FloorPlanMetadata;
  canvasData?: any;
  canvasJson?: string;
  data?: Record<string, any>;
  userId: string;
  propertyId?: string;
}

export function createEmptyFloorPlan(): FloorPlan {
  const now = new Date().toISOString();
  return {
    id: uuidv4(),
    name: 'Untitled Floor Plan',
    label: 'Untitled Floor Plan',
    walls: [],
    rooms: [],
    strokes: [],
    createdAt: now,
    updatedAt: now,
    gia: 0,
    level: 0,
    index: 0,
    metadata: {
      createdAt: now,
      updatedAt: now,
      paperSize: PaperSize.A4,
      level: 0,
      version: '1.0',
      author: 'System',
      notes: '',
      dateCreated: now,
      lastModified: now
    },
    data: {},
    userId: ''
  };
}

// Alias for createTestFloorPlan to maintain compatibility with tests
export const createTestFloorPlan = createEmptyFloorPlan;

// Add a utility type to allow partial wall creation
export type WallInput = Omit<Wall, 'length'>;

// Function to create a Wall with length automatically calculated
export function createWall(input: WallInput): Wall {
  const dx = input.end.x - input.start.x;
  const dy = input.end.y - input.start.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  
  return {
    ...input,
    length
  };
}

// Utility function to calculate wall length
export function calculateWallLength(wall: WallInput): number {
  const dx = wall.end.x - wall.start.x;
  const dy = wall.end.y - wall.start.y;
  return Math.sqrt(dx * dx + dy * dy);
}
