
/**
 * Core type definitions
 * The single source of truth for all floor plan related types
 */
import { v4 as uuidv4 } from 'uuid';

// ----- Basic primitive types -----

export interface Point {
  x: number;
  y: number;
}

// ----- Enum type definitions -----

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
export type RoomTypeLiteral = 'living' | 'bedroom' | 'bathroom' | 'kitchen' | 'dining' | 'office' | 'other';

// ----- Core entity types -----

export interface Wall {
  id: string;
  start: Point;
  end: Point;
  thickness: number;
  length: number;
  color: string;
  roomIds: string[];
  height?: number;
  type?: string;
}

export interface Room {
  id: string;
  name: string;
  type: RoomTypeLiteral;
  points: Point[];
  vertices: Point[];
  area: number;
  color: string;
  level?: number;
  walls?: string[];
  center?: Point;
  perimeter?: number;
  labelPosition?: Point;
}

export interface Stroke {
  id: string;
  points: Point[];
  color: string;
  width: number;
  thickness?: number;
  type: StrokeTypeLiteral;
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
  data: Record<string, any>;
  userId: string;
  propertyId?: string;
}

// ----- Helper functions -----

export function asStrokeType(type: string): StrokeTypeLiteral {
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

export function calculateWallLength(wall: Pick<Wall, 'start' | 'end'>): number {
  const dx = wall.end.x - wall.start.x;
  const dy = wall.end.y - wall.start.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function createWall(wallData: Omit<Wall, 'length'>): Wall {
  return {
    ...wallData,
    length: calculateWallLength(wallData)
  };
}

export function createPoint(x: number, y: number): Point {
  return { x, y };
}

export const GRID_CONSTANTS = {
  // Grid sizes
  SMALL_GRID_SIZE: 10,
  LARGE_GRID_SIZE: 50,
  GRID_SIZE: 50,
  
  // Grid colors
  SMALL_GRID_COLOR: '#f0f0f0',
  LARGE_GRID_COLOR: '#e0e0e0',
  
  // Grid line widths
  SMALL_GRID_WIDTH: 0.5,
  LARGE_GRID_WIDTH: 1,
  
  // Grid appearance
  DEFAULT_VISIBLE: true,
  DEFAULT_GRID_SIZE: 50,
  DEFAULT_GRID_COLOR: '#e0e0e0',
  DEFAULT_GRID_OPACITY: 0.5,
  
  // Grid interactions
  ENABLE_SNAPPING: true,
  SNAP_THRESHOLD: 10,
  SNAP_DISTANCE: 5,
  
  // Grid performance
  CANVAS_MARGIN: 100,
  RENDER_VISIBLE_ONLY: true,
  MAX_GRID_LINES: 1000,
  GRID_BATCH_SIZE: 100,
  GRID_RENDER_DELAY: 50,
  
  // Grid debugging
  SHOW_GRID_DEBUG: false,
  SHOW_GRID_BOUNDARIES: false,
  SHOW_GRID_STATS: false,
  SHOW_GRID_SNAPLINES: false,
  
  // Grid reliability
  CHECK_INTERVAL: 5000,
  MAX_CHECK_COUNT: 10,
  GRID_RECREATION_DELAY: 500,
  
  // Additional constants
  GRID_AUTO_FIX: true,
  PIXELS_PER_METER: 100
};
