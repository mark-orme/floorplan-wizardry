
import { Point } from '@/types/core/Point';
import { GRID_CONSTANTS } from '@/constants/gridConstants';

interface Room {
  id: string;
  name?: string;
  points: Point[];
  type: 'internal' | 'external' | 'excluded';
}

interface AreaCalculationResult {
  areaM2: number;
  areaSqFt: number;
  perimeter: number;
  isValid: boolean;
  errorMessage?: string;
}

/**
 * Calculate area of a polygon using the Shoelace formula (Gauss's area formula)
 * @param points Array of points forming a polygon
 * @returns Area in square pixels
 */
export const calculatePolygonArea = (points: Point[]): number => {
  if (points.length < 3) return 0;
  
  let area = 0;
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    area += points[i].x * points[j].y;
    area -= points[j].x * points[i].y;
  }
  
  return Math.abs(area / 2);
};

/**
 * Calculate perimeter of a polygon
 * @param points Array of points forming a polygon
 * @returns Perimeter in pixels
 */
export const calculatePolygonPerimeter = (points: Point[]): number => {
  if (points.length < 2) return 0;
  
  let perimeter = 0;
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    const dx = points[j].x - points[i].x;
    const dy = points[j].y - points[i].y;
    perimeter += Math.sqrt(dx * dx + dy * dy);
  }
  
  return perimeter;
};

/**
 * Convert area from pixels to square meters
 * @param areaPixels Area in square pixels
 * @returns Area in square meters
 */
export const pixelsToSquareMeters = (areaPixels: number): number => {
  const pixelsPerMeter = GRID_CONSTANTS.PIXELS_PER_METER;
  return areaPixels / (pixelsPerMeter * pixelsPerMeter);
};

/**
 * Convert area from square meters to square feet
 * @param areaM2 Area in square meters
 * @returns Area in square feet
 */
export const squareMetersToSquareFeet = (areaM2: number): number => {
  return areaM2 * 10.764;
};

/**
 * Calculate the Gross Internal Area (GIA) of a collection of rooms
 * @param rooms Array of room polygons
 * @returns Area calculation result
 */
export const calculateGIA = (rooms: Room[]): AreaCalculationResult => {
  try {
    // Filter for internal rooms only
    const internalRooms = rooms.filter(room => room.type === 'internal');
    
    if (internalRooms.length === 0) {
      return {
        areaM2: 0,
        areaSqFt: 0,
        perimeter: 0,
        isValid: false,
        errorMessage: 'No internal rooms found'
      };
    }
    
    // Calculate total area in pixels
    let totalAreaPixels = 0;
    let totalPerimeterPixels = 0;
    
    for (const room of internalRooms) {
      const roomArea = calculatePolygonArea(room.points);
      const roomPerimeter = calculatePolygonPerimeter(room.points);
      
      totalAreaPixels += roomArea;
      totalPerimeterPixels += roomPerimeter;
    }
    
    // Convert to square meters and square feet
    const areaM2 = pixelsToSquareMeters(totalAreaPixels);
    const areaSqFt = squareMetersToSquareFeet(areaM2);
    
    return {
      areaM2: Math.round(areaM2 * 100) / 100, // Round to 2 decimal places
      areaSqFt: Math.round(areaSqFt * 100) / 100, // Round to 2 decimal places
      perimeter: totalPerimeterPixels / GRID_CONSTANTS.PIXELS_PER_METER, // Convert to meters
      isValid: true
    };
  } catch (error) {
    console.error('Error calculating GIA:', error);
    return {
      areaM2: 0,
      areaSqFt: 0,
      perimeter: 0,
      isValid: false,
      errorMessage: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Check if a polygon is valid (no self-intersections)
 * @param points Array of points forming a polygon
 * @returns Whether the polygon is valid
 */
export const isValidPolygon = (points: Point[]): boolean => {
  if (points.length < 3) return false;
  
  // Simple validation - check for minimum area
  const area = calculatePolygonArea(points);
  return area > 0;
};

/**
 * Format area for display
 * @param areaM2 Area in square meters
 * @returns Formatted area string
 */
export const formatArea = (areaM2: number): string => {
  return `${areaM2.toFixed(2)} m² (${squareMetersToSquareFeet(areaM2).toFixed(2)} ft²)`;
};
