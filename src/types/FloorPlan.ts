
/**
 * Floor Plan type definitions
 * Centralized to avoid duplicates
 */

// Import drawing modes from the centralized source
import { DrawingMode } from '@/constants/drawingModes';
// Re-export DrawingMode to maintain backward compatibility
export { DrawingMode };

export interface FloorPlan {
  id: string;
  name: string;
  label: string;
  data: any; // Generic data container 
  userId: string;
  walls: any[];
  rooms: any[];
  strokes: any[];
  canvasJson: string | null;
  canvasData: any | null;
  createdAt: string;
  updatedAt: string;
  gia: number;
  level: number;
  index: number;
  metadata: {
    createdAt: string;
    updatedAt: string;
    paperSize: PaperSize;
    level: number;
    collaborators?: string[];
    lastModifiedBy?: string;
    lastModifiedAt?: string;
    version?: number;
    crdtState?: string;
  };
}

export enum PaperSize {
  A4 = 'A4',
  A3 = 'A3',
  A2 = 'A2', 
  A1 = 'A1',
  A0 = 'A0'
}

export const stringToPaperSize = (size: string): PaperSize => {
  switch (size.toUpperCase()) {
    case 'A4': return PaperSize.A4;
    case 'A3': return PaperSize.A3;
    case 'A2': return PaperSize.A2; 
    case 'A1': return PaperSize.A1;
    case 'A0': return PaperSize.A0;
    default: return PaperSize.A4;
  }
};

// Create an empty floor plan with defaults
export function createEmptyFloorPlan(overrides: Partial<FloorPlan> = {}): FloorPlan {
  const now = new Date().toISOString();
  
  return {
    id: `fp-${Date.now()}`,
    name: 'New Floor Plan',
    label: 'Untitled',
    data: {},
    userId: 'anonymous',
    walls: [],
    rooms: [],
    strokes: [],
    canvasJson: null,
    canvasData: null,
    createdAt: now,
    updatedAt: now,
    gia: 0,
    level: 0,
    index: 0,
    metadata: {
      createdAt: now,
      updatedAt: now,
      paperSize: PaperSize.A4,
      level: 0,
      collaborators: [],
      version: 1
    },
    ...overrides
  };
}
