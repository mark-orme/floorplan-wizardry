
/**
 * Basic Types for Floor Plans
 * Common type definitions used across floor plan modules
 * @module types/floor-plan/basicTypes
 */

// Import the unified types to ensure consistency
import type { StrokeTypeLiteral, RoomTypeLiteral } from './typesBarrel';

// Re-export the types
export type { StrokeTypeLiteral, RoomTypeLiteral };

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
