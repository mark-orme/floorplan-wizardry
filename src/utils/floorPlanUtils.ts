import { FloorPlan, FloorPlanMetadata } from '@/types/floor-plan/unifiedTypes';
import { PaperSize } from '@/types/floor-plan/basicTypes';
import { createCompleteMetadata } from '@/utils/debug/typeDiagnostics';
import { v4 as uuidv4 } from 'uuid';

/**
 * Create a new empty floor plan with default values
 */
export function createEmptyFloorPlan(name = 'New Floor Plan', level = 0): FloorPlan {
  const now = new Date().toISOString();
  
  return {
    id: uuidv4(),
    name,
    label: `Level ${level}`,
    walls: [],
    rooms: [],
    strokes: [],
    canvasJson: null,
    canvasData: null,
    createdAt: now,
    updatedAt: now,
    gia: 0,
    level,
    index: 0,
    data: {},
    userId: '',
    metadata: {
      createdAt: now,
      updatedAt: now,
      paperSize: PaperSize.A3,
      level
    }
  };
}

/**
 * Calculate gross internal area (GIA) from a floor plan
 */
export function calculateGIA(floorPlan: FloorPlan): number {
  // Sum up the areas of all rooms
  return floorPlan.rooms.reduce((total, room) => {
    return total + (room.area || 0);
  }, 0);
}

/**
 * Format area in square meters
 */
export function formatArea(areaInSquareMeters: number): string {
  return `${areaInSquareMeters.toFixed(2)} m²`;
}

/**
 * Get the appropriate scales based on paper size
 */
export function getPaperSizeScales(paperSize: PaperSize): { width: number; height: number } {
  switch (paperSize) {
    case PaperSize.A0:
      return { width: 841, height: 1189 };
    case PaperSize.A1:
      return { width: 594, height: 841 };
    case PaperSize.A2:
      return { width: 420, height: 594 };
    case PaperSize.A3:
      return { width: 297, height: 420 };
    case PaperSize.A4:
    default:
      return { width: 210, height: 297 };
  }
}

/**
 * Create default metadata for a floor plan
 * @param level Floor level (0 = ground floor)
 * @returns Default floor plan metadata
 */
export function createDefaultMetadata(level: number = 0): FloorPlanMetadata {
  return createCompleteMetadata({ level });
}
