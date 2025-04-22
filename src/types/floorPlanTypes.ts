
/**
 * Basic type for floor plan data structure
 */
export interface FloorPlan {
  id?: string;
  propertyId: string;
  data: any;
  strokes?: any[];
  version?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Coordinate point interface
 */
export interface Point {
  x: number;
  y: number;
}
