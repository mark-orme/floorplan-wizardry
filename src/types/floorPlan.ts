
import { FloorPlanMetadata } from './canvas-types';
import { FabricObject } from 'fabric';

export interface FloorPlan {
  id: string;
  name: string;
  created?: string;
  modified?: string;
  data?: any;
  thumbnail?: string;
  size?: number;
  width?: number;
  height?: number;
  index?: number;
  metadata: FloorPlanMetadata;
  objects?: FabricObject[];
  canvasData?: string;
  label?: string;
}

/**
 * Create an empty floor plan with default values
 */
export function createEmptyFloorPlan(id: string = ''): FloorPlan {
  return {
    id: id || crypto.randomUUID(),
    name: 'New Floor Plan',
    created: new Date().toISOString(),
    modified: new Date().toISOString(),
    metadata: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1
    },
    objects: [],
    width: 800,
    height: 600
  };
}

export type StrokeTypeLiteral = 'solid' | 'dashed' | 'dotted';

export interface Stroke {
  type: StrokeTypeLiteral;
  width: number;
  color: string;
  opacity?: number;
}
