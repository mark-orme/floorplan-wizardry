
/**
 * App floor plan type definition
 * @module types/core/floor-plan/AppFloorPlan
 */
import { 
  FloorPlan as CoreFloorPlan,
  Wall,
  Room,
  Stroke
} from './FloorPlan';

/**
 * App-specific floor plan interface
 * Extends the core floor plan with additional properties needed for the app
 */
export interface FloorPlan extends Omit<CoreFloorPlan, 'metadata'> {
  createdAt: string;
  updatedAt: string;
  walls: Wall[];
  rooms: Room[];
  strokes: Stroke[];
  metadata: {
    createdAt: string;
    updatedAt: string;
    author?: string;
    version?: string;
    paperSize?: string;
    level?: number;
    lastModified?: string;
    notes?: string;
  };
}

export type AppFloorPlan = FloorPlan;
