
/**
 * Metadata Types
 * Metadata interface and related types for floor plans
 * @module types/floor-plan/metadataTypes
 */
import { PaperSize } from './basicTypes';

/**
 * Floor plan metadata interface
 */
export interface FloorPlanMetadata {
  /** Unique identifier (optional) */
  id?: string;
  
  /** Metadata name (optional) */
  name?: string;
  
  /** Thumbnail URL (optional) */
  thumbnail?: string;
  
  /** Creation date timestamp */
  createdAt: string;
  
  /** Last update timestamp */
  updatedAt: string;
  
  /** Paper size for printing (optional) */
  paperSize?: PaperSize | string;
  
  /** Floor level (0 = ground floor) */
  level?: number;
  
  /** Version (required) */
  version: string;
  
  /** Author (required) */
  author: string;
  
  /** Date created formatted (required) */
  dateCreated: string;
  
  /** Last modified formatted (required) */
  lastModified: string;
  
  /** Notes (required) */
  notes: string;
}

/**
 * Create default metadata object
 * @param level Floor level
 * @returns Default metadata object
 */
export function createDefaultMetadata(level: number = 0): FloorPlanMetadata {
  const now = new Date().toISOString();
  return {
    createdAt: now,
    updatedAt: now,
    paperSize: PaperSize.A4,
    level,
    version: '1.0',
    author: '',
    dateCreated: now,
    lastModified: now,
    notes: ''
  };
}
