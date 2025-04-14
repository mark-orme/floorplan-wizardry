
/**
 * Floor Plan Basic Types
 * Core type definitions for floor plans
 * @module types/floor-plan/basicTypes
 */

/**
 * Paper size enum for printing
 */
export enum PaperSize {
  A3 = "A3",
  A4 = "A4",
  A5 = "A5",
  Letter = "Letter",
  Legal = "Legal",
  Tabloid = "Tabloid",
  Custom = "Custom"
}

/**
 * Stroke type literal for drawing types
 * Ensure this matches the main floorPlanTypes.ts StrokeTypeLiteral
 */
export type StrokeTypeLiteral = 'line' | 'wall' | 'door' | 'window' | 'furniture' | 'annotation' | 'polyline' | 'room' | 'freehand';

/**
 * Stroke type (same as StrokeTypeLiteral for backward compatibility)
 */
export type StrokeType = StrokeTypeLiteral;

/**
 * Room type literal
 */
export type RoomTypeLiteral = 'living' | 'bedroom' | 'kitchen' | 'bathroom' | 'office' | 'other';
