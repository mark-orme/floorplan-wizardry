
import { createCompleteMetadata } from '@/utils/debug/typeDiagnostics';
import { SimplePoint, toFabricPoint } from '@/utils/fabric/pointAdapter';

import type { Stroke, FloorPlan } from '@/types/floor-plan/unifiedTypes';

// Example test data with correct Stroke type
const testStroke: Partial<Stroke> = {
  id: 'test-stroke',
  points: [toFabricPoint({ x: 0, y: 0 }), toFabricPoint({ x: 1, y: 1 })],
  type: 'line',
  color: '#000000',
  width: 2, // Use width instead of thickness as per the interface
};

// Example floor plan literal, removed canvasState and added missing properties for FloorPlan
const now = new Date().toISOString();
const testFloorPlan: Partial<FloorPlan> = {
  id: 'test-floorplan',
  name: 'Test FloorPlan',
  label: 'Test FloorPlan',
  createdAt: now,
  updatedAt: now,
  gia: 0,
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
    notes: ''
  },
  data: {}, // required property
  userId: '', // required property
};

export {
  // export test fixtures or utilities here if any
};
