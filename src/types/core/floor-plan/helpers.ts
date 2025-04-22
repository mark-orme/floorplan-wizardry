
/**
 * Floor plan helper functions
 * @module types/core/floor-plan/helpers
 */

import { v4 as uuidv4 } from 'uuid';
import { FloorPlan } from './FloorPlan';
import { PaperSize } from './PaperSize';

/**
 * Create a new floor plan with default values
 */
export function createFloorPlan(propertyId: string = ''): FloorPlan {
  const now = new Date().toISOString();
  
  return {
    id: uuidv4(),
    name: 'Untitled Floor Plan',
    label: 'Untitled',
    walls: [],
    rooms: [],
    strokes: [],
    createdAt: now,
    updatedAt: now,
    level: 0,
    index: 0,
    gia: 0,
    metadata: {
      createdAt: now,
      updatedAt: now,
      paperSize: PaperSize.A4,
      level: 0,
      version: '1.0',
      author: 'System',
      notes: '',
      dateCreated: now,
      lastModified: now
    },
    userId: 'default-user',
    propertyId,
    data: {}
  };
}
