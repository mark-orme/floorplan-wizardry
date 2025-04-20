
/**
 * Unified DrawingMode type definition
 * This file centralizes the DrawingMode enum to resolve incompatibility issues
 * @module types/drawing/UnifiedDrawingMode
 */

// Create a type mapping between different DrawingMode value formats
export type DrawingModeValue = 'select' | 'SELECT' | 
                              'draw' | 'DRAW' | 
                              'erase' | 'ERASE' | 
                              'hand' | 'HAND' | 
                              'wall' | 'WALL' | 
                              'pencil' | 'PENCIL' | 
                              'room' | 'ROOM' | 
                              'text' | 'TEXT' | 
                              'shape' | 'SHAPE' | 
                              'line' | 'LINE' | 
                              'rectangle' | 'RECTANGLE' | 
                              'circle' | 'CIRCLE' | 
                              'door' | 'DOOR' | 
                              'window' | 'WINDOW' | 
                              'straight_line' | 'STRAIGHT_LINE' | 
                              'pan' | 'PAN' | 
                              'eraser' | 'ERASER' | 
                              'measure' | 'MEASURE';

/**
 * Convert between different DrawingMode formats
 * @param mode The input drawing mode value
 * @returns A standardized drawing mode value
 */
export function normalizeDrawingMode(mode: DrawingModeValue): string {
  // Normalize to lowercase for comparison
  const normalizedMode = mode.toLowerCase();
  
  // Map of normalized modes to standardized values
  const modeMap: Record<string, string> = {
    'select': 'select',
    'draw': 'draw',
    'erase': 'erase',
    'hand': 'hand',
    'wall': 'wall',
    'pencil': 'pencil',
    'room': 'room',
    'text': 'text',
    'shape': 'shape',
    'line': 'line',
    'rectangle': 'rectangle',
    'circle': 'circle',
    'door': 'door',
    'window': 'window',
    'straight_line': 'straight_line',
    'pan': 'pan',
    'eraser': 'eraser',
    'measure': 'measure'
  };
  
  return modeMap[normalizedMode] || 'select';
}

/**
 * Function to adapt the drawing mode based on the target enum
 * @param mode The source drawing mode value
 * @param targetEnum The target enum to map to
 * @returns The drawing mode value in the format of the target enum
 */
export function adaptDrawingMode(mode: DrawingModeValue, targetEnum: any): any {
  const normalizedMode = normalizeDrawingMode(mode);
  
  // Find the matching key in the target enum
  for (const key in targetEnum) {
    const enumValue = targetEnum[key];
    if (typeof enumValue === 'string' && normalizeDrawingMode(enumValue as DrawingModeValue) === normalizedMode) {
      return enumValue;
    }
  }
  
  // Return default value
  return Object.values(targetEnum)[0];
}

// Export wrapper functions to easily convert between different DrawingMode enum formats
export const convertToFloorPlanDrawingMode = (mode: DrawingModeValue) => 
  adaptDrawingMode(mode, require('../FloorPlan').DrawingMode);

export const convertToConstantsDrawingMode = (mode: DrawingModeValue) => 
  adaptDrawingMode(mode, require('../../constants/drawingModes').DrawingMode);
