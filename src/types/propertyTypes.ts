
/**
 * Property type definitions
 * @module types/propertyTypes
 */

/**
 * Property status enum
 */
export enum PropertyStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  PENDING = 'pending',
  ARCHIVE = 'archive'
}

/**
 * Property type interface
 */
export interface Property {
  /** Unique identifier */
  id: string;
  /** Property name */
  name: string;
  /** Property address */
  address: string;
  /** Property type (house, apartment, etc.) */
  type: string;
  /** Number of bedrooms */
  bedrooms: number;
  /** Number of bathrooms */
  bathrooms: number;
  /** Property size in square feet or meters */
  area: number;
  /** Current status */
  status: PropertyStatus;
  /** Creation date */
  createdAt: string;
  /** Last update date */
  updatedAt: string;
  /** Owner user ID */
  userId: string;
  /** Gross internal area (GIA) */
  gia?: number;
  /** Floor plans */
  floorPlans?: string;
}

/**
 * New property input interface
 */
export interface NewPropertyInput {
  /** Property name */
  name: string;
  /** Property address */
  address: string;
  /** Property type (house, apartment, etc.) */
  type: string;
  /** Number of bedrooms */
  bedrooms: number;
  /** Number of bathrooms */
  bathrooms: number;
  /** Property size in square feet or meters */
  area: number;
}
