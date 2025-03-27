
/**
 * Floor plan utilities
 * Helper functions for floor plan operations
 */
import { FloorPlan, Wall, Room, Point, PaperSize } from '@/types/floorPlanTypes';
import { v4 as uuidv4 } from 'uuid';

/**
 * Create a new empty floor plan
 * @param name Optional floor plan name
 * @returns New floor plan object
 */
export const createEmptyFloorPlan = (name: string = 'New Floor'): FloorPlan => {
  const now = new Date().toISOString();
  
  return {
    id: uuidv4(),
    name,
    label: name,
    gia: 0,
    walls: [],
    rooms: [],
    strokes: [],
    canvasData: null,
    createdAt: now,
    updatedAt: now
  };
};

/**
 * Create a default floor plan with preset dimensions
 * @returns Default floor plan
 */
export const createDefaultFloorPlan = (): FloorPlan => {
  const floorPlan = createEmptyFloorPlan('Ground Floor');
  
  // Add basic walls to form a simple room
  const width = 500;
  const height = 400;
  const thickness = 10;
  
  // Convert string dimensions to numbers explicitly
  const numericWidth = typeof width === 'string' ? parseInt(width, 10) : width;
  const numericHeight = typeof height === 'string' ? parseInt(height, 10) : height;
  
  // Add walls around the perimeter
  floorPlan.walls = [
    // Top wall
    {
      id: uuidv4(),
      start: { x: 100, y: 100 },
      end: { x: 100 + numericWidth, y: 100 },
      thickness
    },
    // Right wall
    {
      id: uuidv4(),
      start: { x: 100 + numericWidth, y: 100 },
      end: { x: 100 + numericWidth, y: 100 + numericHeight },
      thickness
    },
    // Bottom wall
    {
      id: uuidv4(),
      start: { x: 100 + numericWidth, y: 100 + numericHeight },
      end: { x: 100, y: 100 + numericHeight },
      thickness
    },
    // Left wall
    {
      id: uuidv4(),
      start: { x: 100, y: 100 + numericHeight },
      end: { x: 100, y: 100 },
      thickness
    }
  ];
  
  // Add a room defined by the walls
  floorPlan.rooms = [
    {
      id: uuidv4(),
      name: 'Living Room',
      points: [
        { x: 100, y: 100 },
        { x: 100 + numericWidth, y: 100 },
        { x: 100 + numericWidth, y: 100 + numericHeight },
        { x: 100, y: 100 + numericHeight }
      ],
      area: numericWidth * numericHeight,
      color: 'rgba(200, 220, 240, 0.3)'
    }
  ];
  
  // Calculate GIA
  floorPlan.gia = numericWidth * numericHeight / 10000; // Convert to m²
  
  return floorPlan;
};

/**
 * Get paper size dimensions in pixels
 * @param size Paper size
 * @param orientation Page orientation
 * @returns Width and height in pixels
 */
export const getPaperSizeDimensions = (
  size: PaperSize,
  orientation: 'portrait' | 'landscape' = 'landscape'
): { width: number; height: number } => {
  // Define sizes in mm, then convert to pixels
  const sizes: Record<string, [number, number]> = {
    'A4': [297, 210],
    'A3': [420, 297],
    'A2': [594, 420],
    'A1': [841, 594],
    'A0': [1189, 841],
    'Letter': [279, 216],
    'Legal': [356, 216],
    'Tabloid': [432, 279],
    'infinite': [2000, 1500]
  };
  
  // Get dimensions or use default if size not found
  const [w, h] = sizes[size] || sizes['A4'];
  
  // Apply orientation and convert to pixels (approx 3.78 pixels per mm at 96 DPI)
  const pxPerMm = 3.78;
  const dimensions = orientation === 'portrait' ?
    { width: h * pxPerMm, height: w * pxPerMm } :
    { width: w * pxPerMm, height: h * pxPerMm };
  
  return dimensions;
};
