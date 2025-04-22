
import { PropertyStatus } from '@/lib/supabase';

/**
 * Property interface
 */
export interface Property {
  id: string;
  name: string;
  address: string;
  userId: string;
  status: PropertyStatus;
  createdAt: string;
  updatedAt: string;
  clientName?: string;
  orderId?: string;
  metadata?: any;
}

/**
 * Property list item interface (simplified property for listings)
 */
export interface PropertyListItem {
  id: string;
  name: string;
  address: string;
  status: PropertyStatus;
  updatedAt: string;
  client_name?: string; // DB field name format
  order_id?: string; // DB field name format
}

/**
 * Create empty property with default values
 */
export function createEmptyProperty(userId: string): Property {
  const now = new Date().toISOString();
  return {
    id: `property-${Date.now()}`,
    name: 'Untitled Property',
    address: '',
    userId,
    status: PropertyStatus.DRAFT,
    createdAt: now,
    updatedAt: now
  };
}

/**
 * Format property address for display
 */
export function formatPropertyAddress(property: Property): string {
  return property.address || 'No address provided';
}

/**
 * Get property status display text
 */
export function getPropertyStatusText(status: PropertyStatus): string {
  switch (status) {
    case PropertyStatus.DRAFT:
      return 'Draft';
    case PropertyStatus.PENDING_REVIEW:
      return 'Pending Review';
    case PropertyStatus.COMPLETED:
      return 'Completed';
    case PropertyStatus.ARCHIVED:
      return 'Archived';
    default:
      return 'Unknown';
  }
}

/**
 * Get property status color class for UI
 */
export function getPropertyStatusColorClass(status: PropertyStatus): string {
  switch (status) {
    case PropertyStatus.DRAFT:
      return 'bg-yellow-200 text-yellow-800';
    case PropertyStatus.PENDING_REVIEW:
      return 'bg-blue-200 text-blue-800';
    case PropertyStatus.COMPLETED:
      return 'bg-green-200 text-green-800';
    case PropertyStatus.ARCHIVED:
      return 'bg-gray-200 text-gray-800';
    default:
      return 'bg-gray-200 text-gray-800';
  }
}
