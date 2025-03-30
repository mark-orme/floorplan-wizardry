
/**
 * Main FloorPlan interface and factory
 * @module types/core/floor-plan/FloorPlan
 */

import { Wall } from './Wall';
import { Room } from './Room';
import { Stroke } from './Stroke';
import { FloorPlanMetadata, createDefaultMetadata } from './Metadata';
import { PaperSize } from './PaperSize';

/**
 * Floor plan interface
 */
export interface FloorPlan {
  /** Unique identifier */
  id: string;
  
  /** Floor plan name */
  name: string;
  
  /** Display label */
  label: string;
  
  /** Floor index for compatibility with app FloorPlan */
  index?: number;
  
  /** Walls in the floor plan */
  walls: Wall[];
  
  /** Rooms in the floor plan */
  rooms: Room[];
  
  /** Annotations and drawings */
  strokes: Stroke[];
  
  /** Serialized canvas data (optional) */
  canvasData: string | null;
  
  /** Canvas JSON serialization for fabric.js */
  canvasJson?: string;
  
  /** Creation timestamp */
  createdAt: string;
  
  /** Last update timestamp */
  updatedAt: string;
  
  /** Gross internal area in square meters */
  gia: number;
  
  /** Floor level (0 = ground floor) */
  level: number;
  
  /** Paper size */
  paperSize?: PaperSize | string;
  
  /** Metadata */
  metadata: FloorPlanMetadata;
}

/**
 * Create a new floor plan with default values
 * @param id - Floor plan ID
 * @param name - Floor plan name
 * @param level - Floor level
 * @returns New floor plan object
 */
export const createFloorPlan = (id: string, name: string, level: number = 0): FloorPlan => {
  const now = new Date().toISOString();
  return {
    id,
    name,
    label: name,
    walls: [],
    rooms: [],
    strokes: [],
    canvasData: null,
    canvasJson: null,
    createdAt: now,
    updatedAt: now,
    gia: 0,
    level,
    index: level,
    paperSize: PaperSize.A4,
    metadata: createDefaultMetadata(level)
  };
};
