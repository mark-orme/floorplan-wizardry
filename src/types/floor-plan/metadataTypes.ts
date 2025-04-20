
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
  /** Version of the floor plan format */
  version?: string;
  
  /** Author of the floor plan */
  author?: string;
  
  /** Notes about the floor plan */
  notes?: string;
  
  /** Date when the floor plan was created */
  createdAt: string;
  
  /** Date when the floor plan was last updated */
  updatedAt: string;
  
  /** Paper size for printing */
  paperSize: PaperSize | string;
  
  /** Floor level (0 = ground floor) */
  level: number;
  
  /** Date the floor plan was created (alias for createdAt) */
  dateCreated?: string;
  
  /** Date the floor plan was last modified (alias for updatedAt) */
  lastModified?: string;
}
