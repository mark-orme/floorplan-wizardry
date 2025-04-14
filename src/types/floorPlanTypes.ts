
/**
 * Floor plan type definitions
 */

export interface FloorPlan {
  id?: string;
  name?: string;
  rooms?: Room[];
  walls?: Wall[];
  metadata?: FloorPlanMetadata;
  [key: string]: any;
}

export interface Room {
  id: string;
  name?: string;
  walls: Wall[];
  area?: number;
  [key: string]: any;
}

export interface Wall {
  id: string;
  points: Point[];
  length?: number;
  thickness?: number;
  [key: string]: any;
}

export interface Point {
  x: number;
  y: number;
}

export interface FloorPlanMetadata {
  createdAt?: string;
  updatedAt?: string;
  scale?: number;
  units?: 'meters' | 'feet';
  [key: string]: any;
}
