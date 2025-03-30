
/**
 * Floor Plan Metadata definitions
 * @module types/core/floor-plan/Metadata
 */

import { PaperSize } from './PaperSize';

/**
 * Floor plan metadata interface
 */
export interface FloorPlanMetadata {
  /** Date when the floor plan was created */
  createdAt: string;
  
  /** Date when the floor plan was last updated */
  updatedAt: string;
  
  /** Paper size for printing */
  paperSize: PaperSize | string;
  
  /** Floor level (0 = ground floor) */
  level: number;
}

/**
 * Create a default floor plan metadata object
 * @returns Default floor plan metadata
 */
export const createDefaultMetadata = (level: number = 0): FloorPlanMetadata => {
  const now = new Date().toISOString();
  return {
    createdAt: now,
    updatedAt: now,
    paperSize: PaperSize.A4,
    level
  };
};
