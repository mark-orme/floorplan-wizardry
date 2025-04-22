
/**
 * Property Types
 * Type definitions for property-related data structures
 */

export enum PropertyStatus {
  DRAFT = 'draft',
  PENDING_REVIEW = 'pending_review',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  ARCHIVED = 'archived'
}

export interface PropertyListItem {
  id: string;
  address: string;
  status: PropertyStatus;
  updatedAt: string;
  client_name: string;
  order_id: string;
  branch_name: string; // Added to match PropertyDetailContent usage
}

export interface Property extends PropertyListItem {
  createdAt: string;
  // Added branch_name to match PropertyDetailContent usage
  branch_name: string;
  // Add notes property to match usage in PropertyDetailContent
  notes?: string;
  details?: {
    [key: string]: any;
  };
}

export interface PropertyUpdateInput {
  status?: PropertyStatus;
  address?: string;
  client_name?: string;
  details?: {
    [key: string]: any;
  };
}

/**
 * Check if a property can be edited based on its status
 * @param statusOrProperty Property status or property object
 * @param userRole The user's role (optional)
 * @param userId The user's ID (optional)
 * @returns Whether the property can be edited
 */
export function canEditProperty(statusOrProperty: PropertyStatus | Property, userRole?: string, userId?: string): boolean {
  // If a property object is passed
  if (typeof statusOrProperty !== 'string') {
    const property = statusOrProperty;
    // Default implementation just checks status
    return property.status !== PropertyStatus.ARCHIVED;
  }
  
  // If just a status is passed
  return statusOrProperty !== PropertyStatus.ARCHIVED;
}

/**
 * Get the appropriate color for a property status
 * @param status Property status
 * @returns Color string
 */
export function getStatusColor(status: PropertyStatus): string {
  switch (status) {
    case PropertyStatus.DRAFT:
      return 'gray';
    case PropertyStatus.PENDING_REVIEW:
      return 'yellow';
    case PropertyStatus.IN_PROGRESS:
      return 'blue';
    case PropertyStatus.COMPLETED:
      return 'green';
    case PropertyStatus.ARCHIVED:
      return 'red';
    default:
      return 'gray';
  }
}
