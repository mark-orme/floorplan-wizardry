
/**
 * Floor Plan Types
 */

export interface FloorPlan {
  id: string;
  name: string;
  data: any; // Canvas JSON data
  userId: string;
  createdAt: string;
  updatedAt: string;
  // Additional properties used in various components
  label: string; // Making label required consistently
  strokes?: Stroke[];
  walls?: Wall[];
  rooms?: Room[];
  level?: number;
  gia?: number;
  canvasData?: string | null;
  canvasJson?: string | null;
  canvasState?: any;
  metadata?: FloorPlanMetadata;
  index?: number;
  order?: number; // Used in some components
}

export interface FloorPlanMetadata {
  id?: string;
  name?: string;
  thumbnail?: string;
  createdAt?: string;
  updatedAt?: string;
  paperSize?: PaperSize | string;
  level?: number;
  // For backward compatibility
  version?: string;
  author?: string;
  dateCreated?: string;
  lastModified?: string;
  notes?: string;
}

export interface FloorPlanDimensions {
  width: number;
  height: number;
  scale: number; // scale in pixels per meter
}

export interface AreaCalculation {
  areaM2: number; // Area in square meters
  areaSqFt: number; // Area in square feet
  rooms?: {
    id: string;
    name: string;
    areaM2: number;
  }[];
}

export enum FloorPlanStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

// Types that are referenced in the codebase
export interface Stroke {
  id: string;
  points: Point[];
  type: StrokeTypeLiteral;
  color: string;
  thickness: number;
  width: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface Wall {
  id: string;
  points: Point[];
  startPoint?: Point;
  endPoint?: Point;
  start: Point;
  end: Point;
  thickness: number;
  height?: number;
  color: string;
  roomIds: string[];
  length: number;
}

export interface Room {
  id: string;
  name: string;
  type: RoomTypeLiteral;
  points: Point[];
  color: string; // Make color required for consistency
  area: number;
  level: number;
  walls: string[];
}

export type StrokeTypeLiteral = 'line' | 'polyline' | 'wall' | 'room' | 'freehand' | 'door' | 'window' | 'furniture' | 'annotation' | 'other';
export type StrokeType = StrokeTypeLiteral;
export type RoomTypeLiteral = 'living' | 'bedroom' | 'kitchen' | 'bathroom' | 'office' | 'other';

export enum PaperSize {
  A4 = 'A4',
  A3 = 'A3',
  A5 = 'A5',
  LETTER = 'LETTER',
  LEGAL = 'LEGAL',
  TABLOID = 'TABLOID',
  CUSTOM = 'CUSTOM'
}

// Export DrawingMode from constants
import { DrawingMode } from '@/constants/drawingModes';
export { DrawingMode };
