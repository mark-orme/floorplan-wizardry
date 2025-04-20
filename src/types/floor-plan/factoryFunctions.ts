
import { FloorPlan, FloorPlanMetadata } from './floorPlanTypes';
import { v4 as uuidv4 } from 'uuid';

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
