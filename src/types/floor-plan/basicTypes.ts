
/**
 * Basic Types for Floor Plans
 * Common type definitions used across floor plan modules
 * @module types/floor-plan/basicTypes
 */

/**
 * Stroke type literals for various drawing types
 */
export type StrokeTypeLiteral = 
  'line' | 
  'polyline' | 
  'wall' | 
  'room' | 
  'freehand' | 
  'door' | 
  'window' | 
  'furniture' | 
  'annotation' | 
  'straight' |  // Added 'straight' to match floorPlanTypes.ts
  'other';

/**
 * Room type literals for different room types
 */
export type RoomTypeLiteral = 
  'living' | 
  'bedroom' | 
  'kitchen' | 
  'bathroom' | 
  'office' | 
  'other';

/**
 * Paper size literals for floor plan exports
 */
export enum PaperSize {
  A4 = 'A4',
  A3 = 'A3',
  A5 = 'A5',
  LETTER = 'LETTER',
  LEGAL = 'LEGAL',
  TABLOID = 'TABLOID',
  CUSTOM = 'CUSTOM'
}
