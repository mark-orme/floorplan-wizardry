
import { FloorPlan } from '@/types/core';
import { PaperSize } from '@/types/floor-plan/PaperSize';

/**
 * Creates an empty floor plan
 * @returns Empty floor plan object
 */
export function createEmptyFloorPlan(overrides: Partial<FloorPlan> = {}): FloorPlan {
  const now = new Date().toISOString();
  
  return {
    id: `fp-${Date.now()}`,
    name: 'New Floor Plan',
    label: 'New Floor Plan',
    data: {}, // Ensure data is always initialized
    userId: '',
    walls: [],
    rooms: [],
    strokes: [],
    canvasJson: null,
    canvasData: null,
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
      version: "1.0",
      author: "",
      dateCreated: now,
      lastModified: now,
      notes: ""
    },
    ...overrides
  };
}

/**
 * Creates a default metadata object for floor plans
 * @returns Default floor plan metadata
 */
export function createDefaultMetadata() {
  const now = new Date().toISOString();
  return {
    createdAt: now,
    updatedAt: now,
    paperSize: PaperSize.A4,
    level: 0,
    version: "1.0",
    author: "",
    dateCreated: now,
    lastModified: now,
    notes: ""
  };
}
