
// Removed the duplicate 'gia' property in the floorPlan fixture and kept one correct entry.

import { createCompleteMetadata } from '@/utils/debug/typeDiagnostics'; // This is now exported correctly
import { toFabricPoint } from '@/utils/fabric/pointAdapter';

import type { Stroke, FloorPlan } from '@/types/floor-plan/unifiedTypes';

// Example test data with correct Stroke type (no width)
const testStroke: Partial<Stroke> = {
  id: 'test-stroke',
  points: [toFabricPoint({ x: 0, y: 0 }), toFabricPoint({ x: 1, y: 1 })],
  type: 'line',
  color: '#000000',
  thickness: 2,
  // width removed, as not part of Stroke type
};

// Example floor plan literal, removed canvasState and added missing properties for FloorPlan
const now = new Date().toISOString();
const testFloorPlan: Partial<FloorPlan> = {
  id: 'test-floorplan',
  name: 'Test FloorPlan',
  label: 'Test FloorPlan',
  createdAt: now,
  updatedAt: now,
  gia: 0, // Corrected from gis -> gia
  walls: [],
  rooms: [],
  strokes: [],
  index: 0,
  level: 0,
  metadata: {
    createdAt: now,
    updatedAt: now,
    paperSize: 'A4',
    level: 0,
    version: '1.0',
    author: 'User',
    lastModified: now,
    notes: ''
  },
  data: {}, // required property
  userId: '', // required property
  // canvasState removed
};

export {
  // export test fixtures or utilities here if any
};
