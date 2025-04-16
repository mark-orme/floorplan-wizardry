
import { Point } from '@/types/core/Point';
import { Room } from '@/types/floor-plan/roomTypes';
import { PIXELS_PER_METER, AREA_PRECISION } from '@/constants/numerics';

/**
 * Room calculation result interface
 */
interface RoomCalculationResult {
  id: string;
  name: string;
  areaM2: number;
  areaSqFt: number;
  type: 'internal' | 'external' | 'excluded';
}

/**
 * GIA calculation result interface
 */
interface GIACalculationResult {
  isValid: boolean;
  areaM2: number;
  areaSqFt: number;
  rooms: RoomCalculationResult[];
  errorMessage?: string;
}

/**
 * Calculate area of a polygon using the Shoelace formula
 * 
 * @param points Array of points forming a polygon
 * @returns Area in square pixels
 */
const calculatePolygonArea = (points: Point[]): number => {
  if (points.length < 3) return 0;
  
  let area = 0;
  
  // Shoelace formula (Gauss's area formula)
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    area += points[i].x * points[j].y;
    area -= points[j].x * points[i].y;
  }
  
  // Take absolute value and divide by 2
  return Math.abs(area / 2);
};

/**
 * Convert area from square pixels to square meters
 * 
 * @param areaInPixels Area in square pixels
 * @returns Area in square meters
 */
const convertPixelsToSquareMeters = (areaInPixels: number): number => {
  return areaInPixels / (PIXELS_PER_METER * PIXELS_PER_METER);
};

/**
 * Convert area from square meters to square feet
 * 
 * @param areaInM2 Area in square meters
 * @returns Area in square feet
 */
const convertSquareMetersToSquareFeet = (areaInM2: number): number => {
  return areaInM2 * 10.764; // 1 sq m = 10.764 sq ft
};

/**
 * Format area with unit
 * 
 * @param areaInM2 Area in square meters
 * @returns Formatted string with unit
 */
export const formatArea = (areaInM2: number): string => {
  return `${areaInM2.toFixed(AREA_PRECISION)} m²`;
};

/**
 * Calculate Gross Internal Area (GIA) for a collection of rooms
 * 
 * @param rooms Array of rooms with points and type
 * @returns Calculation result with total area and breakdown
 */
export const calculateGIA = (
  rooms: Array<{
    id: string;
    points: Point[];
    type: 'internal' | 'external' | 'excluded';
    name?: string;
  }>
): GIACalculationResult => {
  if (!rooms || rooms.length === 0) {
    return {
      isValid: false,
      areaM2: 0,
      areaSqFt: 0,
      rooms: [],
      errorMessage: 'No rooms provided for calculation'
    };
  }
  
  // Calculate area for each room
  const roomCalculations: RoomCalculationResult[] = rooms.map(room => {
    const areaInPixels = calculatePolygonArea(room.points);
    const areaInM2 = convertPixelsToSquareMeters(areaInPixels);
    const areaInSqFt = convertSquareMetersToSquareFeet(areaInM2);
    
    // Round to specified precision
    const roundedAreaM2 = parseFloat(areaInM2.toFixed(AREA_PRECISION));
    const roundedAreaSqFt = parseFloat(areaInSqFt.toFixed(AREA_PRECISION));
    
    return {
      id: room.id,
      name: room.name || `Room ${room.id}`,
      areaM2: roundedAreaM2,
      areaSqFt: roundedAreaSqFt,
      type: room.type
    };
  });
  
  // Sum up internal areas only
  const totalInternalAreaM2 = roomCalculations
    .filter(room => room.type === 'internal')
    .reduce((sum, room) => sum + room.areaM2, 0);
  
  const totalInternalAreaSqFt = roomCalculations
    .filter(room => room.type === 'internal')
    .reduce((sum, room) => sum + room.areaSqFt, 0);
  
  return {
    isValid: true,
    areaM2: parseFloat(totalInternalAreaM2.toFixed(AREA_PRECISION)),
    areaSqFt: parseFloat(totalInternalAreaSqFt.toFixed(AREA_PRECISION)),
    rooms: roomCalculations
  };
};

/**
 * Hook interface for GIA calculations
 */
export interface GIACalculatorHook {
  calculateGIA: (rooms: Room[]) => GIACalculationResult;
  formatArea: (areaInM2: number) => string;
}
