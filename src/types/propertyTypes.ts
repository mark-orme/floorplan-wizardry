
import { PropertyStatus } from '@/lib/supabase';

/**
 * Property data interface
 */
export interface Property {
  id: string;
  name: string;
  address: string;
  description?: string;
  status: PropertyStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  assignedTo?: string;
  
  // Add extended properties that are used in components
  order_id?: string;
  client_name?: string;
  branch_name?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  floorPlans?: string;
}

/**
 * Property list item interface
 * Used for property listings
 */
export interface PropertyListItem {
  id: string;
  name?: string;
  address: string;
  order_id?: string;
  client_name?: string;
  status: PropertyStatus;
  created_at?: string;
  updated_at?: string;
}

/**
 * Property form data interface
 */
export interface PropertyFormData {
  name: string;
  address: string;
  description?: string;
  status?: PropertyStatus;
}

/**
 * Check if a user can edit a property
 * @param property The property to check
 * @param userRole The user's role
 * @param userId The user's ID
 * @returns Whether the user can edit the property
 */
export function canEditProperty(property: Property, userRole: string, userId: string): boolean {
  // Admins and managers can edit any property
  if (userRole === 'admin' || userRole === 'manager') {
    return true;
  }
  
  // Photographers can only edit their own properties
  if (userRole === 'photographer' && property.createdBy === userId) {
    return true;
  }
  
  // Processing managers can edit properties in review
  if (userRole === 'processing_manager' && property.status === PropertyStatus.PENDING_REVIEW) {
    return true;
  }
  
  return false;
}

// Re-export the PropertyStatus enum
export { PropertyStatus } from '@/lib/supabase';
