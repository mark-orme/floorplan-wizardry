
/**
 * Tests for floor plan adapter converters
 * @module utils/floorPlanAdapter/converters.test
 */
import { describe, it, expect } from 'vitest';
import { 
  appToCoreFloorPlans,
  coreToAppFloorPlans,
  convertWall,
  convertRoom,
  convertStroke,
  convertMetadata
} from './converters';
import { adaptWall, adaptRoom, adaptMetadata, adaptFloorPlan } from '@/utils/typeAdapters';
import { PaperSize } from '@/types/floor-plan/unifiedTypes';

describe('Floor Plan Adapters - Converters', () => {
  it('should convert walls correctly', () => {
    const wall = {
      id: 'wall-1',
      start: { x: 0, y: 0 },
      end: { x: 100, y: 0 },
      thickness: 2,
      color: '#000000',
      length: 100,
      roomIds: []
    };
    
    const result = convertWall(wall);
    
    expect(result.id).toBe('wall-1');
    expect(result.start).toEqual({ x: 0, y: 0 });
    expect(result.end).toEqual({ x: 100, y: 0 });
    expect(result.length).toBe(100);
    expect(result.roomIds).toEqual([]);
  });
  
  it('should convert rooms correctly', () => {
    const room = {
      id: 'room-1',
      name: 'Living Room',
      type: 'living',
      points: [
        { x: 0, y: 0 },
        { x: 100, y: 0 },
        { x: 100, y: 100 },
        { x: 0, y: 100 }
      ],
      area: 10000,
      color: '#ffffff',
      level: 0,
      walls: []
    };
    
    const result = adaptRoom(room);
    
    expect(result.id).toBe('room-1');
    expect(result.name).toBe('Living Room');
    expect(result.type).toBe('living');
    expect(result.area).toBe(10000);
  });
  
  it('should round-trip convert floor plans', () => {
    const now = new Date().toISOString();
    
    const floorPlan = adaptFloorPlan({
      id: 'floor-1',
      name: 'Test Floor',
      label: 'Test Floor',
      walls: [],
      rooms: [],
      strokes: [],
      createdAt: now,
      updatedAt: now,
      gia: 0,
      level: 0,
      index: 0,
      canvasData: null,
      canvasJson: null,
      metadata: adaptMetadata({
        paperSize: PaperSize.A4,
        level: 0
      })
    });
    
    const coreFloorPlans = appToCoreFloorPlans([floorPlan]);
    const roundTripped = coreToAppFloorPlans(coreFloorPlans);
    
    expect(roundTripped[0].id).toBe('floor-1');
    expect(roundTripped[0].name).toBe('Test Floor');
  });
});
