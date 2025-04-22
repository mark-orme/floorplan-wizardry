
import { v4 as uuid } from 'uuid';
import { FloorPlan } from '@/types/core';

export const createFloorPlan = (propertyId: string, level: number, label?: string, index = 0) => {
  const currentTime = new Date().toISOString();
  
  // Fix for missing required FloorPlan properties
  const floorPlan: FloorPlan = {
    id: uuid(),
    propertyId: propertyId,
    name: `Floor ${level}`,
    label: label || `Floor ${level}`,
    level: level,
    index: index,
    data: {},
    createdAt: currentTime,
    updatedAt: currentTime,
    walls: [],
    rooms: [],
    strokes: []
  };

  return floorPlan;
};
