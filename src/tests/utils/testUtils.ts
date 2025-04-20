
import { FloorPlan, Room, Stroke, Wall } from '@/types/floor-plan/typesBarrel';

export const createTestFloorPlan = (overrides: Partial<FloorPlan> = {}): FloorPlan => {
  const now = new Date().toISOString();
  
  return {
    id: 'test-floor-plan',
    name: 'Test Floor Plan',
    label: 'Test Label',
    data: {},
    userId: 'test-user',
    strokes: [],
    walls: [],
    rooms: [],
    createdAt: now,
    updatedAt: now,
    level: 0,
    index: 0,
    gia: 0,
    canvasData: null,
    canvasJson: null,
    metadata: {
      version: '1.0',
      author: 'test-author',
      dateCreated: now,
      lastModified: now
    },
    ...overrides
  };
};

export const createTestRoom = (overrides: Partial<Room> = {}): Room => {
  return {
    id: 'test-room',
    name: 'Test Room',
    type: 'other',
    points: [],
    walls: [],
    color: '#ffffff',
    area: 0,
    level: 0,
    ...overrides
  };
};

export const createTestStroke = (overrides: Partial<Stroke> = {}): Stroke => {
  return {
    id: 'test-stroke',
    points: [],
    type: 'line',
    color: '#000000',
    thickness: 1,
    width: 1,
    ...overrides
  };
};

