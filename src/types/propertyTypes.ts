
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
  ARCHIVE = 'archive',
  PENDING_REVIEW = 'pending_review',
  COMPLETED = 'completed'
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
  /** Order ID */
  order_id?: string;
  /** Client name */
  client_name?: string;
  /** Creation date (API compat) */
  created_at?: string;
  /** Update date (API compat) */
  updated_at?: string;
  /** Branch name */
  branch_name?: string;
  /** Notes */
  notes?: string;
  /** Created by user */
  created_by?: string;
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

/**
 * PropertyListItem interface for list views
 */
export interface PropertyListItem {
  /** Unique identifier */
  id: string;
  /** Order ID */
  order_id: string;
  /** Property address */
  address: string;
  /** Client name */
  client_name: string;
  /** Current status */
  status: PropertyStatus;
  /** Creation date */
  created_at: string;
  /** Last update date */
  updated_at: string;
  /** Created by user ID */
  created_by: string;
}

/**
 * Determines if a user can edit a property
 * @param property The property to check
 * @param userRole The role of the current user
 * @param userId The ID of the current user
 * @returns Whether the user can edit the property
 */
export function canEditProperty(property: Property, userRole: string | null, userId: string): boolean {
  if (!userRole) return false;
  
  // Managers can edit any property
  if (userRole === 'manager') return true;
  
  // Photographers can only edit their own properties
  if (userRole === 'photographer') {
    return property.created_by === userId;
  }
  
  // Processing managers can edit properties in review
  if (userRole === 'processing_manager') {
    return property.status === PropertyStatus.PENDING_REVIEW;
  }
  
  return false;
}
