
import { Point } from '@/types/core/Point';

export type StrokeTypeLiteral = 'line' | 'straight_line' | 'wall' | 'door' | 'window' | 'furniture' | 'annotation' | 'polyline' | 'room' | 'freehand';

export interface Stroke {
  id: string;
  points: Point[];
  color: string;
  thickness: number;
  width: number;
  type: StrokeTypeLiteral;
}

export { Point };

// Helper function to ensure a string is a valid StrokeTypeLiteral
export function asStrokeType(type: string): StrokeTypeLiteral {
  const validTypes: StrokeTypeLiteral[] = ['line', 'straight_line', 'wall', 'door', 'window', 'furniture', 'annotation', 'polyline', 'room', 'freehand'];
  return validTypes.includes(type as StrokeTypeLiteral) ? type as StrokeTypeLiteral : 'line';
}

export interface FloorPlan {
  id: string;
  name: string;
  created?: string;
  modified?: string;
  updated?: string;
  description?: string;
  thumbnail?: string;
  size?: number;
  width?: number;
  height?: number;
  index?: number;
  level?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Helper function to create an empty floor plan
export function createEmptyFloorPlan(overrides: Partial<FloorPlan> = {}): FloorPlan {
  return {
    id: crypto.randomUUID(),
    name: 'Untitled Floor Plan',
    ...overrides
  };
}
