
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import type { Point } from '@/types/core/Point';
import type { FloorPlan, Room, Wall } from '@/types/core/floor-plan';

export function createMockPoint(x = 0, y = 0): Point {
  return { x, y };
}

export function createMockWall(id: string, start: Point, end: Point): Wall {
  return {
    id,
    start,
    end,
    thickness: 10
  };
}

export function createMockRoom(id: string, walls: Wall[]): Room {
  return {
    id,
    walls,
    area: 0,
    name: ''
  };
}
