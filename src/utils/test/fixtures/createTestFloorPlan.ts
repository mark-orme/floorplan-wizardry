
import { FloorPlan } from '@/types/floor-plan/unifiedTypes';

/**
 * Create a test floor plan
 * @param partialFloorPlan Partial floor plan data
 * @returns Test floor plan
 */
export function createTestFloorPlan(partialFloorPlan: Partial<FloorPlan> = {}): FloorPlan {
  const now = new Date().toISOString();
  
  // Create proper metadata with all required fields
  const metadata = partialFloorPlan.metadata || {
    createdAt: now,
    updatedAt: now,
    paperSize: 'A4',
    level: partialFloorPlan.level || 0,
    version: '1.0',
    author: 'Test User',
    dateCreated: now,
    lastModified: now,
    notes: 'Test floor plan created for testing purposes'
  };
  
  return {
    id: partialFloorPlan.id || 'floor-test',
    name: partialFloorPlan.name || 'Test Floor Plan',
    label: partialFloorPlan.label || 'Test Floor Plan',
    walls: partialFloorPlan.walls || [],
    rooms: partialFloorPlan.rooms || [],
    strokes: partialFloorPlan.strokes || [],
    canvasData: partialFloorPlan.canvasData || null,
    canvasJson: partialFloorPlan.canvasJson || null,
    canvasState: partialFloorPlan.canvasState || null,
    metadata,
    data: partialFloorPlan.data || {},
    createdAt: partialFloorPlan.createdAt || now,
    updatedAt: partialFloorPlan.updatedAt || now,
    gia: partialFloorPlan.gia || 0,
    level: partialFloorPlan.level || 0,
    index: partialFloorPlan.index || 0,
    userId: partialFloorPlan.userId || 'test-user'
  };
}
