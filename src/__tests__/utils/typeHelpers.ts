
// Fix the bogus width on Stroke, remove width.
// Remove canvasState properties from FloorPlan literals
// Fix createCompleteMetadata import: remove it or ensure it's exported from src/utils/debug/typeDiagnostics.ts

import { createCompleteMetadata } from '@/utils/debug/typeDiagnostics'; // This is now exported correctly

import type { Stroke, FloorPlan } from '@/types/floor-plan/unifiedTypes';

// Example test data with correct Stroke type (no width)
const testStroke: Partial<Stroke> = {
  id: 'test-stroke',
  points: [{ x: 0, y: 0 }, { x: 1, y: 1 }],
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
  gis: 0,
  walls: [],
  rooms: [],
  strokes: [],
  gia: 0,
  level: 0,
  index: 0,
  metadata: {
    createdAt: now,
    updatedAt: now,
    paperSize: 'A4',
    level: 0,
    version: '1.0',
    author: 'User',
    dateCreated: now,
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
