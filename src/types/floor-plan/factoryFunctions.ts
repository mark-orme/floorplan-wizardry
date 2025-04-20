
import { FloorPlan } from './floorPlanTypes';
import { FloorPlanMetadata } from './metadataTypes';
import { v4 as uuidv4 } from 'uuid';

/**
 * Creates an empty floor plan metadata object
 * @returns Empty floor plan metadata
 */
export function createEmptyFloorPlanMetadata(): FloorPlanMetadata {
  const now = new Date().toISOString();
  return {
    version: '1.0',
    author: '',
    notes: '',
    createdAt: now,
    updatedAt: now,
    paperSize: 'A4',
    level: 0,
    dateCreated: now,
    lastModified: now
  };
}

/**
 * Creates an empty floor plan object with default values
 * @param partialFloorPlan Partial floor plan data to override defaults
 * @returns Empty floor plan
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
    metadata: partialFloorPlan.metadata || createEmptyFloorPlanMetadata(),
    data: partialFloorPlan.data || {},
    userId: partialFloorPlan.userId || ''
  };
}
