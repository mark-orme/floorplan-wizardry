
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
}

export interface Wall {
  id: string;
  startPoint: Point;
  endPoint: Point;
  thickness: number;
  height?: number;
  color?: string;
}

export interface Room {
  id: string;
  name: string;
  points: Point[];
  color?: string;
  area?: number;
  type?: string;
}

export interface Stroke {
  id: string;
  points: Point[];
  color: string;
  width: number;
  type: string;
}

export type PaperSize = 'A0' | 'A1' | 'A2' | 'A3' | 'A4' | 'letter' | 'legal' | 'custom';

export interface FloorPlanMetadata {
  version: string;
  scale: number;
  unit: 'mm' | 'cm' | 'm' | 'inch' | 'ft';
  paperSize: PaperSize;
  created: string;
  modified: string;
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
    strokes: []
  };
};
