
import { v4 as uuid } from 'uuid';
import { FloorPlan } from '@/types/core';

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
