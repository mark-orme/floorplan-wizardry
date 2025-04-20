
import { v4 as uuidv4 } from 'uuid';

export interface FloorPlan {
  id: string;
  name: string;
  label: string;
  index: number;
  strokes: Stroke[];
  walls: Wall[];
  rooms: Room[];
  gia: number;
  level: number;
  canvasData: CanvasData | null;
  canvasJson: string | null;
  createdAt: string;
  updatedAt: string;
  metadata: FloorPlanMetadata;
  data: any; // Required for interface compatibility
  userId: string; // Required for interface compatibility
}

export interface Room {
  id: string;
  name: string;
  floorPlanId: string;
  area: number;
  perimeter: number;
  center: Point;
  vertices: Point[];
  labelPosition: Point;
  createdAt: string;
  updatedAt: string;
  metadata: RoomMetadata;
}

export interface Wall {
  id: string;
  floorPlanId: string;
  start: Point;
  end: Point;
  thickness: number;
  length: number;
  angle: number;
  createdAt: string;
  updatedAt: string;
  metadata: WallMetadata;
}

export interface Stroke {
  id: string;
  floorPlanId: string;
  points: Point[];
  color: string;
  thickness: number;
  createdAt: string;
  updatedAt: string;
  metadata: StrokeMetadata;
}

export interface Point {
  x: number;
  y: number;
}

export interface CanvasData {
  zoom: number;
  offset: Point;
}

export interface FloorPlanMetadata {
  version: string;
  author: string;
  dateCreated: string;
  lastModified: string;
  notes: string;
}

export interface RoomMetadata {
  type: string;
  material: string;
  notes: string;
}

export interface WallMetadata {
  type: string;
  material: string;
  height: number;
  notes: string;
}

export interface StrokeMetadata {
  type: string;
  notes: string;
}

/**
 * Creates an empty floor plan metadata object
 * @returns Empty floor plan metadata
 */
export function createEmptyFloorPlanMetadata(): FloorPlanMetadata {
  return {
    version: '1.0',
    author: '',
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    notes: ''
  };
}

/**
 * Creates an empty floor plan object with default values
 * @param partialFloorPlan Partial floor plan data to override defaults
 * @returns Empty floor plan
 */
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
    metadata: partialFloorPlan.metadata || createEmptyFloorPlanMetadata(),
    // Add the missing required properties
    data: partialFloorPlan.data || {},
    userId: partialFloorPlan.userId || ''
  };
}
