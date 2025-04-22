
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

// Add missing function that's imported elsewhere
export function canEditProperty(status: PropertyStatus): boolean {
  return status !== PropertyStatus.ARCHIVED;
}

// Add missing function that may be used in components
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
