
/**
 * Floor Plan Metadata Types
 * Metadata interface for floor plan
 * @module types/floor-plan/metadataTypes
 */
import { PaperSize } from './basicTypes';

/**
 * FloorPlan metadata interface
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
